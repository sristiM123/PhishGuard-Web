

const POPUP_I18N = {
    en: {
        popup_title: "PhishGuard",
        popup_tagline: "A friendly view of your links.",
        popup_page_title: "Current page links",
        popup_page_wait: "Waiting for page report…",
        popup_page_total: "Total links found",
        popup_net_title: "Recent network traffic",
        popup_net_wait: "Collecting simple stats…",
        popup_net_total: "Total requests",
        popup_low: "Low",
        popup_medium: "Medium",
        popup_high: "High"
    },
    mk: {
        popup_title: "PhishGuard",
        popup_tagline: "Пријателски преглед на вашите линкови.",
        popup_page_title: "Линкови на оваа страница",
        popup_page_wait: "Се чека извештај од страницата…",
        popup_page_total: "Вкупно линкови",
        popup_net_title: "Скорешен мрежен сообраќај",
        popup_net_wait: "Се собираат едноставни статистики…",
        popup_net_total: "Вкупно барања",
        popup_low: "Низок",
        popup_medium: "Среден",
        popup_high: "Висок"
    }
};

function getLang() {
    const stored = localStorage.getItem("pg_popup_lang");
    if (stored && POPUP_I18N[stored]) return stored;
    const nav = (navigator.language || "en").split("-")[0];
    return POPUP_I18N[nav] ? nav : "en";
}

let lang = getLang();

function applyI18n() {
    const dict = POPUP_I18N[lang] || POPUP_I18N.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        if (dict[key]) el.textContent = dict[key];
    });
}

function renderPageReport(report) {
    const status = document.getElementById("page-status");
    const summary = document.getElementById("page-summary");
    const totalEl = document.getElementById("total-count");
    const lowEl = document.getElementById("low-count");
    const mediumEl = document.getElementById("medium-count");
    const highEl = document.getElementById("high-count");
    const list = document.getElementById("sample-list");

    status.style.display = "none";
    summary.style.display = "block";

    totalEl.textContent = report.total;
    lowEl.textContent = report.low;
    mediumEl.textContent = report.medium;
    highEl.textContent = report.high;

    list.innerHTML = "";
    if (!report.samples || report.samples.length === 0) {
        const li = document.createElement("li");
        li.className = "sample-item";
        li.textContent =
            "No medium or high-risk links detected on this page.";
        list.appendChild(li);
        return;
    }

    report.samples.forEach((s) => {
        const li = document.createElement("li");
        li.className = "sample-item";

        const risk = document.createElement("span");
        risk.className = "sample-risk";
        risk.textContent = `${s.risk} (${s.score})`;

        const url = document.createElement("span");
        url.className = "sample-url";
        url.textContent = s.href;

        li.appendChild(risk);
        li.appendChild(url);
        list.appendChild(li);
    });
}

function renderNetReport(netSummary) {
    const status = document.getElementById("net-status");
    const summary = document.getElementById("net-summary");
    const totalEl = document.getElementById("net-total");
    const lowEl = document.getElementById("net-low");
    const mediumEl = document.getElementById("net-medium");
    const highEl = document.getElementById("net-high");
    const list = document.getElementById("net-sample-list");

    status.style.display = "none";
    summary.style.display = "block";

    totalEl.textContent = netSummary.total;
    lowEl.textContent = netSummary.low;
    mediumEl.textContent = netSummary.medium;
    highEl.textContent = netSummary.high;

    list.innerHTML = "";
    if (!netSummary.samples || netSummary.samples.length === 0) {
        const li = document.createElement("li");
        li.className = "sample-item";
        li.textContent =
            "No medium or high-risk requests recorded yet.";
        list.appendChild(li);
        return;
    }

    netSummary.samples.slice(-10).forEach((s) => {
        const li = document.createElement("li");
        li.className = "sample-item";

        const risk = document.createElement("span");
        risk.className = "sample-risk";
        risk.textContent = `${s.risk} (${s.score})`;

        const url = document.createElement("span");
        url.className = "sample-url";
        url.textContent = s.url;

        li.appendChild(risk);
        li.appendChild(url);
        list.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("popup-lang-select");
    select.value = lang;
    select.addEventListener("change", () => {
        lang = select.value;
        localStorage.setItem("pg_popup_lang", lang);
        applyI18n();
    });

    applyI18n();

    document.getElementById("open-dashboard").addEventListener("click", () => {
        chrome.tabs.create({
            url: chrome.runtime.getURL("dashboard.html")
        });
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab || !tab.id) return;
        chrome.tabs.sendMessage(
            tab.id,
            { type: "PG_GET_PAGE_REPORT" },
            (response) => {
                if (chrome.runtime.lastError || !response || !response.report) {
                    document.getElementById("page-status").textContent =
                        "No link analysis available here.";
                    return;
                }
                renderPageReport(response.report);
            }
        );
    });

    chrome.runtime.sendMessage(
        { type: "PG_GET_NETWORK_REPORT" },
        (response) => {
            if (!response || !response.netSummary) {
                document.getElementById("net-status").textContent =
                    "No network data yet.";
                return;
            }
            renderNetReport(response.netSummary);
        }
    );
});
