// pg-safebrowsing.js — Google Safe Browsing Lookup API v4
//
// SETUP: Replace the empty string below with your API key.
// How to get a free key (10,000 checks/day):
//   1. Go to https://console.cloud.google.com/
//   2. Create a project (or use an existing one)
//   3. Go to "APIs & Services" → "Enable APIs" → search "Safe Browsing API" → Enable
//   4. Go to "APIs & Services" → "Credentials" → "Create Credentials" → "API Key"
//   5. Paste the key below
//   6. Optionally restrict the key to the Safe Browsing API only in the key settings
//
// Privacy note: this function is ONLY called when a user explicitly checks a URL.
// Links are never sent to Google passively or in bulk.

const PG_SAFE_BROWSING_KEY = ""; // <-- paste your API key here

const PG_SB_ENDPOINT =
    "https://safebrowsing.googleapis.com/v4/threatMatches:find";

const PG_THREAT_LABELS = {
    MALWARE:
        "Google has flagged this as a malware distribution site.",
    SOCIAL_ENGINEERING:
        "Google has flagged this as a phishing / social engineering site.",
    UNWANTED_SOFTWARE:
        "Google has flagged this as distributing unwanted software.",
    POTENTIALLY_HARMFUL_APPLICATION:
        "Google has flagged this as a potentially harmful application."
};

/* === Core check === */

async function pgCheckSafeBrowsing(url) {
    if (!PG_SAFE_BROWSING_KEY) {
        return { checked: false, reason: "no_key" };
    }

    try {
        const response = await fetch(
            `${PG_SB_ENDPOINT}?key=${PG_SAFE_BROWSING_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client: {
                        clientId: "phishguard",
                        clientVersion: "4.1.0"
                    },
                    threatInfo: {
                        threatTypes: [
                            "MALWARE",
                            "SOCIAL_ENGINEERING",
                            "UNWANTED_SOFTWARE",
                            "POTENTIALLY_HARMFUL_APPLICATION"
                        ],
                        platformTypes: ["ANY_PLATFORM"],
                        threatEntryTypes: ["URL"],
                        threatEntries: [{ url }]
                    }
                })
            }
        );

        if (!response.ok) {
            return { checked: false, reason: "api_error" };
        }

        const data = await response.json();

        if (data.matches && data.matches.length > 0) {
            const threatType = data.matches[0].threatType;
            return {
                checked: true,
                safe: false,
                threatType,
                label: PG_THREAT_LABELS[threatType] || "Google has flagged this URL as dangerous."
            };
        }

        return { checked: true, safe: true };

    } catch {
        return { checked: false, reason: "network_error" };
    }
}
