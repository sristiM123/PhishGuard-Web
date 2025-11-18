// dashboard.js – renders the friendly statistics dashboard + parent/child mode

function niceTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
}

function renderDashboard(data, mode) {
    const pages = data.pages || {};
    const checks = data.linkChecks || { checks: [] };
    const net = data.netSummary || {};

    document.getElementById("pages-total").textContent =
        pages.totalPages || 0;
    document.getElementById("pages-med-high").textContent =
        pages.pagesWithMediumOrHigh || 0;
    document.getElementById("pages-high").textContent =
        pages.pagesWithHigh || 0;

    document.getElementById("links-total").textContent =
        pages.totalLinksSeen || 0;
    document.getElementById("links-medium").textContent =
        pages.mediumLinksSeen || 0;
    document.getElementById("links-high").textContent =
        pages.highLinksSeen || 0;

    document.getElementById("checks-total").textContent =
        checks.total || 0;
    document.getElementById("checks-low").textContent = checks.low || 0;
    document.getElementById("checks-medium").textContent =
        checks.medium || 0;
    document.getElementById("checks-high").textContent =
        checks.high || 0;

    const modeSelect = document.getElementById("mode-select");
    if (modeSelect) {
        modeSelect.value = mode || "parent";
    }

    const checksBody = document.querySelector("#checks-table tbody");
    checksBody.innerHTML = "";
    (checks.checks || []).slice(0, 15).forEach((c) => {
        const tr = document.createElement("tr");

        const tdTime = document.createElement("td");
        tdTime.textContent = niceTime(c.time);

        const tdRisk = document.createElement("td");
        const dot = document.createElement("span");
        dot.className =
            "risk-dot " +
            (c.risk === "Low"
                ? "risk-low"
                : c.risk === "Medium"
                    ? "risk-medium"
                    : "risk-high");
        tdRisk.appendChild(dot);
        tdRisk.appendChild(
            document.createTextNode(c.risk + " (" + c.score + ")")
        );

        const tdUrl = document.createElement("td");
        tdUrl.className = "url-cell";
        tdUrl.textContent = c.url;

        tr.appendChild(tdTime);
        tr.appendChild(tdRisk);
        tr.appendChild(tdUrl);
        checksBody.appendChild(tr);
    });

    if (!checks.checks || checks.checks.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 3;
        td.textContent =
            "You have not asked PhishGuard to check any links yet.";
        tr.appendChild(td);
        checksBody.appendChild(tr);
    }

    document.getElementById("net-total").textContent = net.total || 0;
    document.getElementById("net-low").textContent = net.low || 0;
    document.getElementById("net-medium").textContent =
        net.medium || 0;
    document.getElementById("net-high").textContent = net.high || 0;

    const netBody = document.querySelector("#net-table tbody");
    netBody.innerHTML = "";
    (net.samples || []).slice(-15).forEach((s) => {
        const tr = document.createElement("tr");

        const tdRisk = document.createElement("td");
        const dot = document.createElement("span");
        dot.className =
            "risk-dot " +
            (s.risk === "Low"
                ? "risk-low"
                : s.risk === "Medium"
                    ? "risk-medium"
                    : "risk-high");
        tdRisk.appendChild(dot);
        tdRisk.appendChild(
            document.createTextNode(s.risk + " (" + s.score + ")")
        );

        const tdUrl = document.createElement("td");
        tdUrl.className = "url-cell";
        tdUrl.textContent = s.url;

        tr.appendChild(tdRisk);
        tr.appendChild(tdUrl);
        netBody.appendChild(tr);
    });

    if (!net.samples || net.samples.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 2;
        td.textContent =
            "No medium or high-risk requests recorded yet.";
        tr.appendChild(td);
        netBody.appendChild(tr);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage(
        { type: "PG_GET_DASHBOARD_DATA" },
        (response) => {
            if (!response || !response.dashboardData) return;
            renderDashboard(response.dashboardData, response.mode || "parent");
        }
    );

    const modeSelect = document.getElementById("mode-select");
    if (modeSelect) {
        modeSelect.addEventListener("change", () => {
            const newMode = modeSelect.value;
            chrome.runtime.sendMessage(
                { type: "PG_SET_MODE", mode: newMode },
                () => {}
            );
        });
    }
});
