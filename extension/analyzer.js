// analyzer.js – shared logic for extension

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
            error: "Invalid URL",
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
