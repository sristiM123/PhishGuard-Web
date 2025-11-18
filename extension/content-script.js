function simpleAnalyzeUrl(url) {
    try {
        if (!/^https?:\/\//i.test(url)) url = "http://" + url;
        const u = new URL(url);
        const href = u.href.toLowerCase();
        let score = 0;

        // Insecure protocol
        if (u.protocol === "http:") score += 20;

        // @ in URL
        if (href.includes("@")) score += 25;

        // IP instead of hostname
        if (/\d+\.\d+\.\d+\.\d+/.test(u.hostname)) score += 25;

        // Very long
        if (href.length > 180) score += 15;

        // Phishy keywords
        const kws = ["login", "signin", "verify", "reset", "password", "bank"];
        if (kws.some((kw) => href.includes(kw))) score += 20;

        if (score > 100) score = 100;

        let risk = "Low";
        if (score > 30 && score <= 70) risk = "Medium";
        else if (score > 70) risk = "High";

        return { valid: true, score, risk, url: u.href };
    } catch (e) {
        return { valid: false, score: 0, risk: "Low", url };
    }
}

/* ---------- Page report + smart popup styling ---------- */

(function () {
    const EMAIL_HOSTS = [
        "mail.google.com",
        "outlook.live.com",
        "outlook.office.com",
        "mail.yahoo.com"
    ];

    const CHAT_HOSTS = [
        "web.whatsapp.com",
        "www.messenger.com",
        "teams.microsoft.com",
        "app.slack.com",
        "web.telegram.org"
    ];

    const report = {
        total: 0,
        analyzed: 0,
        low: 0,
        medium: 0,
        high: 0,
        samples: []
    };
    const MAX_SAMPLES = 20;
    let summarySent = false;

    // CSS: smart warning icon + tooltip, email panel, scam hints
    const style = document.createElement("style");
    style.textContent = `
    .pg-risky-link {
      text-decoration: underline dotted rgba(248,113,113,0.8);
      text-decoration-thickness: 1px;
    }
    .pg-warning-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 3px;
      font-size: 11px;
      width: 16px;
      height: 16px;
      border-radius: 999px;
      border: 1px solid rgba(248,113,113,0.7);
      background: #fef2f2;
      color: #b91c1c;
      cursor: pointer;
      position: relative;
    }
    .pg-tooltip {
      position: absolute;
      top: 22px;
      left: 0;
      z-index: 999999;
      max-width: 260px;
      padding: 6px 8px;
      border-radius: 8px;
      background: #111827;
      color: #f9fafb;
      font-size: 11px;
      line-height: 1.3;
      box-shadow: 0 10px 25px rgba(0,0,0,0.35);
      opacity: 0;
      visibility: hidden;
      transform: translateY(4px);
      transition: opacity 0.15s ease-out, transform 0.15s ease-out,
        visibility 0.15s;
    }
    .pg-warning-icon:hover .pg-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    /* Email summary panel */
    .pg-email-panel {
      position: fixed;
      right: 16px;
      top: 16px;
      z-index: 99999;
      padding: 10px 12px;
      border-radius: 12px;
      background: #fffbeb;
      border: 1px solid #fed7aa;
      box-shadow: 0 10px 30px rgba(248,171,88,0.35);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        sans-serif;
      font-size: 11px;
      color: #7c2d12;
      max-width: 260px;
    }
    .pg-email-panel-title {
      font-weight: 600;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .pg-email-pills {
      display: flex;
      gap: 6px;
      margin-top: 4px;
      flex-wrap: wrap;
    }
    .pg-email-pill {
      padding: 1px 6px;
      border-radius: 999px;
      border: 1px solid rgba(0,0,0,0.04);
      font-size: 10px;
    }
    .pg-email-pill-low {
      border-color: rgba(22,163,74,0.4);
      background: #ecfdf4;
      color: #166534;
    }
    .pg-email-pill-medium {
      border-color: rgba(234,179,8,0.6);
      background: #fffbeb;
      color: #92400e;
    }
    .pg-email-pill-high {
      border-color: rgba(248,113,113,0.7);
      background: #fef2f2;
      color: #b91c1c;
    }

    /* Scam message hints */
    .pg-scam-message {
      position: relative;
      box-shadow: 0 0 0 2px rgba(248,113,113,0.4);
      border-radius: 6px;
      background: rgba(254,242,242,0.4);
    }
    .pg-scam-label {
      position: absolute;
      top: -14px;
      left: 4px;
      padding: 1px 6px;
      border-radius: 999px;
      background: #b91c1c;
      color: #fef2f2;
      font-size: 9px;
      font-weight: 600;
    }
  `;
    document.documentElement.appendChild(style);

    function isEmailHost() {
        return EMAIL_HOSTS.includes(window.location.host);
    }

    function isChatHost() {
        return CHAT_HOSTS.includes(window.location.host);
    }

    function decorateHighRiskLink(a, result) {
        if (a.dataset.pgDecorated === "1") return;
        a.dataset.pgDecorated = "1";

        a.classList.add("pg-risky-link");

        // Smart warning icon with tooltip
        const icon = document.createElement("span");
        icon.className = "pg-warning-icon";
        icon.textContent = "!";
        const tooltip = document.createElement("div");
        tooltip.className = "pg-tooltip";
        tooltip.textContent =
            "PhishGuard thinks this link looks very risky. It may be safer not to open it.\n\nScore: " +
            result.score;

        icon.appendChild(tooltip);
        a.insertAdjacentElement("afterend", icon);

        // Safe landing page: intercept click on the link itself
        a.addEventListener(
            "click",
            (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                chrome.runtime.sendMessage({
                    type: "PG_OPEN_WARNING",
                    url: result.url
                });
            },
            { capture: true }
        );
    }

    function processLink(a) {
        if (!a || a.dataset.pgProcessed === "1") return;

        const href = a.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

        a.dataset.pgProcessed = "1";
        report.total += 1;

        const result = simpleAnalyzeUrl(href);
        if (!result.valid) return;
        report.analyzed += 1;

        const { score, risk, url } = result;

        if (risk === "Low") report.low += 1;
        else if (risk === "Medium") report.medium += 1;
        else report.high += 1;

        if (risk === "High") {
            decorateHighRiskLink(a, result);
        }

        if (
            report.samples.length < MAX_SAMPLES &&
            (risk === "Medium" || risk === "High")
        ) {
            report.samples.push({ href: url, risk, score });
        }
    }

    function scanAllLinks(root) {
        const links = root.querySelectorAll("a[href]");
        links.forEach(processLink);
    }

    /* ---------- Anti-scam chat detection ---------- */

    const SCAM_PHRASES = [
        "urgent action",
        "verify your account",
        "verify your identity",
        "confirm your password",
        "confirm your account",
        "gift card",
        "send money",
        "bank transfer",
        "reset your password",
        "one time code",
        "one-time code",
        "do not share this code",
        "limited time",
        "your account will be closed",
        "your account will be locked"
    ];

    function scanMessages(root) {
        if (!isChatHost()) return;
        const nodes = root.querySelectorAll("div, span, p");
        nodes.forEach((el) => {
            if (el.dataset.pgScamChecked === "1") return;
            const text = (el.innerText || "").toLowerCase().trim();
            if (!text || text.length < 15 || text.length > 400) return;

            if (SCAM_PHRASES.some((p) => text.includes(p))) {
                el.dataset.pgScamChecked = "1";
                el.classList.add("pg-scam-message");
                const label = document.createElement("div");
                label.className = "pg-scam-label";
                label.textContent = "Possible scam message";
                el.insertAdjacentElement("afterbegin", label);
            } else {
                el.dataset.pgScamChecked = "1";
            }
        });
    }

    /* ---------- Email panel ---------- */

    function renderEmailPanel() {
        if (!isEmailHost()) return;
        let panel = document.querySelector(".pg-email-panel");
        if (!panel) {
            panel = document.createElement("div");
            panel.className = "pg-email-panel";
            panel.innerHTML = `
        <div class="pg-email-panel-title">PhishGuard summary for this email</div>
        <div class="pg-email-panel-body">
          <div><strong><span id="pg-email-total">0</span></strong> links were found.</div>
          <div class="pg-email-pills">
            <span class="pg-email-pill pg-email-pill-low">
              Low: <span id="pg-email-low">0</span>
            </span>
            <span class="pg-email-pill pg-email-pill-medium">
              Medium: <span id="pg-email-medium">0</span>
            </span>
            <span class="pg-email-pill pg-email-pill-high">
              High: <span id="pg-email-high">0</span>
            </span>
          </div>
          <div style="margin-top:6px; font-size:10px;">
            Hover the small <strong>!</strong> icons next to links
            to see why they might be risky.
          </div>
        </div>
      `;
            document.body.appendChild(panel);
        }
        document.getElementById("pg-email-total").textContent = report.total;
        document.getElementById("pg-email-low").textContent = report.low;
        document.getElementById("pg-email-medium").textContent = report.medium;
        document.getElementById("pg-email-high").textContent = report.high;
    }

    /* ---------- Initial + dynamic scanning ---------- */

    function fullScan(root) {
        scanAllLinks(root);
        if (isChatHost()) {
            scanMessages(root);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => fullScan(document));
    } else {
        fullScan(document);
    }

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    fullScan(node);
                }
            }
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Badge notification (page has high risk links?)
    function notifyBadge() {
        chrome.runtime.sendMessage({
            type: report.high > 0 ? "PG_PAGE_HAS_HIGH" : "PG_PAGE_NO_HIGH",
            from: "content"
        });
    }
    notifyBadge();

    // Send one summary per page for dashboard
    function sendPageSummaryOnce() {
        if (summarySent) return;
        summarySent = true;
        chrome.runtime.sendMessage({
            type: "PG_PAGE_SUMMARY",
            report
        });
        if (isEmailHost()) {
            renderEmailPanel();
        }
    }
    setTimeout(sendPageSummaryOnce, 1500);

    // Answer popup requests
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg && msg.type === "PG_GET_PAGE_REPORT") {
            sendResponse({ report });
        }
    });
})();
