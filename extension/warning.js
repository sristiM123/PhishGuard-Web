// warning.js – safe landing page behaviour with parent/child mode

(function () {
    const params = new URLSearchParams(window.location.search);
    const targetUrl = params.get("url") || "";

    const urlEl = document.getElementById("target-url");
    if (urlEl) {
        urlEl.textContent = targetUrl || "(no link found)";
    }

    const backBtn = document.getElementById("back-btn");
    const openBtn = document.getElementById("open-btn");
    const modeLabel = document.getElementById("mode-label");
    const childNote = document.getElementById("child-note");

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.close();
            }
        });
    }

    if (openBtn) {
        openBtn.addEventListener("click", () => {
            if (targetUrl) {
                window.location.href = targetUrl;
            }
        });
    }

    chrome.storage.local.get("pg_mode", (res) => {
        const mode = res && res.pg_mode ? res.pg_mode : "parent";
        if (mode === "child") {
            modeLabel.textContent =
                "Mode: Child (stronger protection)";
            childNote.style.display = "block";
        } else {
            modeLabel.textContent =
                "Mode: Parent (gentle warnings)";
            childNote.style.display = "none";
        }
    });
})();
