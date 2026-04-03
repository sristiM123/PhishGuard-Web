// pg-core.js — PhishGuard shared scoring engine
// Single source of truth for all URL analysis logic.
// Used by: content-script.js, background.js (via importScripts), app.js (via <script> tag)

/* === Data === */

const PG_SUSPICIOUS_TLDS = [
    ".xyz",
    ".top",
    ".click",
    ".gq",
    ".tk",
    ".ml",
    ".cf",
    ".zip",
    ".review"
];

const PG_PHISHING_KEYWORDS = [
    "login",
    "verify",
    "update",
    "secure",
    "account",
    "banking",
    "confirm",
    "password",
    "signin",
    "paypal",
    "office365",
    "support",
    "reset"
];

/* === Helpers === */

function pgIsIpAddress(hostname) {
    const ipv4Regex =
        /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/;
    return ipv4Regex.test(hostname);
}

function pgGetTld(hostname) {
    const parts = hostname.split(".");
    if (parts.length < 2) return "";
    return "." + parts[parts.length - 1];
}

function pgIsPunycode(hostname) {
    return hostname.toLowerCase().includes("xn--");
}

function pgEntropy(str) {
    const s = str.replace(/[^a-zA-Z0-9]/g, "");
    const len = s.length;
    if (!len) return 0;
    const counts = {};
    for (const ch of s) counts[ch] = (counts[ch] || 0) + 1;
    let entropy = 0;
    for (const ch in counts) {
        const p = counts[ch] / len;
        entropy -= p * Math.log2(p);
    }
    return entropy;
}

function pgEncodedCount(str) {
    const matches = str.match(/%[0-9A-Fa-f]{2}/g);
    return matches ? matches.length : 0;
}

/* === Homoglyph detection === */

// Characters commonly substituted to impersonate brand domains
const PG_HOMOGLYPH_MAP = {
    "0": "o", "1": "l", "3": "e", "4": "a",
    "5": "s", "6": "g", "7": "t", "8": "b",
    // Cyrillic confusables
    "\u0430": "a", "\u0435": "e", "\u043e": "o",
    "\u0440": "r", "\u0441": "c", "\u0445": "x",
    "\u0456": "i", "\u04cf": "l",
    // Greek confusables
    "\u03bf": "o", "\u03b1": "a", "\u03c1": "p"
};

// Major brands commonly targeted by lookalike domains
const PG_BRAND_DOMAINS = [
    "paypal", "google", "facebook", "microsoft", "apple",
    "amazon", "netflix", "instagram", "twitter", "linkedin",
    "dropbox", "yahoo", "outlook", "onedrive", "icloud",
    "ebay", "chase", "wellsfargo", "bankofamerica", "citibank",
    "barclays", "hsbc", "whatsapp", "telegram", "discord",
    "slack", "github", "gitlab", "reddit", "youtube",
    "tiktok", "spotify", "adobe", "salesforce", "zoom"
];

function pgNormalizeHostname(str) {
    // Replace confusable characters with ASCII equivalents
    let result = str.toLowerCase().split("").map(
        (ch) => PG_HOMOGLYPH_MAP[ch] || ch
    ).join("");
    // Replace multi-character lookalikes
    result = result.replace(/rn/g, "m").replace(/vv/g, "w").replace(/cl/g, "d");
    return result;
}

function pgCheckHomoglyph(hostname) {
    const clean = hostname.replace(/^www\./, "").toLowerCase();
    // Extract just the second-level domain (e.g. "paypa1" from "paypa1.com")
    const parts = clean.split(".");
    const sld = parts.length >= 2 ? parts[parts.length - 2] : clean;
    const normalizedSld = pgNormalizeHostname(sld);

    for (const brand of PG_BRAND_DOMAINS) {
        // Skip if it's actually the real brand
        if (sld === brand) continue;
        // If normalized version matches the brand but original doesn't → homoglyph
        if (normalizedSld === brand && sld !== brand) {
            return { detected: true, spoofing: brand };
        }
    }
    return { detected: false };
}

/* === Core analysis === */

function pgAnalyzeUrl(urlString) {
    let parsed;
    const factors = [];
    let score = 0;

    try {
        if (!/^https?:\/\//i.test(urlString)) {
            urlString = "http://" + urlString;
        }
        parsed = new URL(urlString);
    } catch {
        return {
            valid: false,
            error: "This does not look like a valid link address.",
            score: 0,
            riskLevel: "High",
            factors: ["This does not look like a valid link address."],
            parsed: null
        };
    }

    const { protocol, hostname, pathname, search, href } = parsed;
    const fullPath = pathname + search;

    if (protocol === "http:") {
        score += 20;
        factors.push("Uses HTTP instead of HTTPS.");
    }

    if (href.includes("@")) {
        score += 25;
        factors.push("Contains '@', which can hide the real destination.");
    }

    if (pgIsIpAddress(hostname)) {
        score += 25;
        factors.push("Points to an IP address instead of a normal website name.");
    }

    const tld = pgGetTld(hostname).toLowerCase();
    if (PG_SUSPICIOUS_TLDS.includes(tld)) {
        score += 15;
        factors.push(`Uses a less common top-level domain (${tld}).`);
    }

    const subdomainCount = Math.max(hostname.split(".").length - 2, 0);
    if (subdomainCount >= 3) {
        score += 15;
        factors.push("Has many subdomains and parts in the name.");
    } else if (subdomainCount === 2) {
        score += 5;
        factors.push("Has multiple subdomains.");
    }

    if (href.length > 100 && href.length <= 200) {
        score += 10;
        factors.push("The URL is quite long.");
    } else if (href.length > 200) {
        score += 20;
        factors.push("The URL is very long and may hide where it goes.");
    }

    const hyphenCount = (hostname.match(/-/g) || []).length;
    if (hyphenCount >= 4) {
        score += 15;
        factors.push("The hostname has many dashes.");
    } else if (hyphenCount >= 2) {
        score += 7;
        factors.push("The hostname has several dashes.");
    }

    const lowerPath = fullPath.toLowerCase();
    const keywords = PG_PHISHING_KEYWORDS.filter((kw) =>
        lowerPath.includes(kw)
    );
    if (keywords.length > 0) {
        score += 20;
        factors.push(
            `Contains sensitive words such as: ${keywords.join(", ")}.`
        );
    }

    if (pgIsPunycode(hostname)) {
        score += 25;
        factors.push("Uses punycode which can hide lookalike characters.");
    }

    const homoglyph = pgCheckHomoglyph(hostname);
    if (homoglyph.detected) {
        score += 40;
        factors.push(
            `The website name appears to impersonate "${homoglyph.spoofing}" using visually similar characters.`
        );
    }

    const hostEntropy = pgEntropy(hostname);
    const pathEntropy = pgEntropy(pathname);

    if (hostname.length > 12 && hostEntropy > 3.5) {
        score += 15;
        factors.push("The hostname looks very random.");
    }
    if (pathname.length > 20 && pathEntropy > 4) {
        score += 10;
        factors.push("The path looks random.");
    }

    const encodedCount = pgEncodedCount(fullPath);
    if (encodedCount >= 5 && encodedCount < 15) {
        score += 10;
        factors.push("Contains several encoded characters.");
    } else if (encodedCount >= 15) {
        score += 20;
        factors.push("Contains many encoded characters.");
    }

    if (score > 100) score = 100;

    let riskLevel = "Low";
    if (score > 30 && score <= 70) riskLevel = "Medium";
    else if (score > 70) riskLevel = "High";

    return {
        valid: true,
        error: null,
        score,
        riskLevel,
        factors,
        parsed: {
            protocol,
            hostname,
            tld,
            pathname,
            search,
            href,
            subdomainCount,
            length: href.length,
            hyphenCount,
            hostEntropy: hostEntropy.toFixed(2),
            pathEntropy: pathEntropy.toFixed(2),
            encodedCount
        }
    };
}