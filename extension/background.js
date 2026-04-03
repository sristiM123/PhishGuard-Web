importScripts("pg-core.js");
importScripts("pg-safebrowsing.js");

const STORAGE_KEY = "pg_dashboard_data";
let mode = "parent"; // "parent" or "child"

let dashboardData = {
    netSummary: {
        total: 0,
        low: 0,
        medium: 0,
        high: 0,
        samples: [] // {url, risk, score}
    },
    linkChecks: {
        total: 0,
        low: 0,
        medium: 0,
        high: 0,
        checks: [] // {url, risk, score, time}
    },
    pages: {
        totalPages: 0,
        pagesWithHigh: 0,
        pagesWithMediumOrHigh: 0,
        totalLinksSeen: 0,
        mediumLinksSeen: 0,
        highLinksSeen: 0
    }
};

const MAX_NET_SAMPLES = 40;
const MAX_CHECKS = 100;

function loadFromStorage() {
    chrome.storage.local.get([STORAGE_KEY, "pg_mode"], (res) => {
        if (res && res[STORAGE_KEY]) {
            dashboardData = res[STORAGE_KEY];
        }
        if (res && res.pg_mode) {
            mode = res.pg_mode;
        }
    });
}

function persist() {
    chrome.storage.local.set({
        [STORAGE_KEY]: dashboardData,
        pg_mode: mode
    });
}

/* ---------- Network summary ---------- */

chrome.webRequest.onCompleted.addListener(
    (details) => {
        const url = details.url;
        const { score, riskLevel: risk } = pgAnalyzeUrl(url);
        const ns = dashboardData.netSummary;

        ns.total += 1;
        if (risk === "Low") ns.low += 1;
        else if (risk === "Medium") ns.medium += 1;
        else ns.high += 1;

        if (
            (risk === "Medium" || risk === "High") &&
            ns.samples.length < MAX_NET_SAMPLES
        ) {
            ns.samples.push({ url, risk, score });
        }

        chrome.action.setBadgeText({
            text: ns.high ? String(ns.high) : ""
        });
        chrome.action.setBadgeBackgroundColor({ color: "#b91c1c" });

        persist();
    },
    { urls: ["<all_urls>"] }
);

/* ---------- Context menu: “Check this link with PhishGuard” ---------- */

function createContextMenu() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "pg-check-link",
            title: "Check this link with PhishGuard",
            contexts: ["link"]
        });
    });
}

chrome.runtime.onInstalled.addListener(() => {
    loadFromStorage();
    createContextMenu();
});

chrome.runtime.onStartup.addListener(() => {
    loadFromStorage();
    createContextMenu();
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "pg-check-link" && info.linkUrl) {
        const { score, riskLevel: risk, parsed } = pgAnalyzeUrl(info.linkUrl);
        const url = parsed ? parsed.href : info.linkUrl;

        // Save into linkChecks
        const lc = dashboardData.linkChecks;
        lc.total += 1;
        if (risk === "Low") lc.low += 1;
        else if (risk === "Medium") lc.medium += 1;
        else lc.high += 1;

        const entry = {
            url,
            risk,
            score,
            time: new Date().toISOString()
        };
        lc.checks.unshift(entry);
        if (lc.checks.length > MAX_CHECKS) lc.checks.pop();
        persist();

        // Friendly notification
        let message;
        if (risk === "Low") {
            message =
                "This link mostly looks fine, but please still be careful.\n\nScore: " +
                score;
        } else if (risk === "Medium") {
            message =
                "This link looks a little unusual. It may be better to double-check before opening.\n\nScore: " +
                score;
        } else {
            message =
                "This link looks very risky. It may be safer not to open it.\n\nScore: " +
                score;
        }

        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon128.png",
            title: "PhishGuard link check",
            message
        });

        // Safe Browsing check — runs after the heuristic notification
        pgCheckSafeBrowsing(url).then((sb) => {
            if (!sb.checked) return; // no key or network error — skip silently
            if (!sb.safe) {
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "icon128.png",
                    title: "⚠️ PhishGuard — Google Safe Browsing Alert",
                    message: sb.label
                });
            }
        });
    }
});

/* ---------- Messages from popup / content script / dashboard ---------- */

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!msg || !msg.type) return;

    // Popup asks for network summary
    if (msg.type === "PG_GET_NETWORK_REPORT") {
        sendResponse({ netSummary: dashboardData.netSummary });
        return true;
    }

    // Dashboard asks for full data
    if (msg.type === "PG_GET_DASHBOARD_DATA") {
        sendResponse({ dashboardData, mode });
        return true;
    }

    // Dashboard sets mode
    if (msg.type === "PG_SET_MODE" && msg.mode) {
        mode = msg.mode === "child" ? "child" : "parent";
        persist();
        sendResponse({ ok: true, mode });
        return true;
    }

    // Page summary from content script
    if (msg.type === "PG_PAGE_SUMMARY" && msg.report) {
        const rep = msg.report;
        const p = dashboardData.pages;

        p.totalPages += 1;
        p.totalLinksSeen += rep.total || 0;
        p.mediumLinksSeen += rep.medium || 0;
        p.highLinksSeen += rep.high || 0;
        if ((rep.medium || 0) + (rep.high || 0) > 0) {
            p.pagesWithMediumOrHigh += 1;
        }
        if ((rep.high || 0) > 0) {
            p.pagesWithHigh += 1;
        }
        persist();
    }

    // Page has high risk links → orange exclamation badge
    if (msg.type === "PG_PAGE_HAS_HIGH") {
        chrome.action.setBadgeText({ text: "!" });
        chrome.action.setBadgeBackgroundColor({ color: "#f97316" });
    }

    // Page has no high risk links → revert to global high count
    if (msg.type === "PG_PAGE_NO_HIGH") {
        const ns = dashboardData.netSummary;
        chrome.action.setBadgeText({
            text: ns.high ? String(ns.high) : ""
        });
        chrome.action.setBadgeBackgroundColor({ color: "#b91c1c" });
    }

    // Open safe landing page for dangerous link
    if (msg.type === "PG_OPEN_WARNING" && msg.url) {
        const targetUrl = msg.url;
        chrome.tabs.create({
            url:
                chrome.runtime.getURL("warning.html") +
                "?url=" +
                encodeURIComponent(targetUrl)
        });
    }
});