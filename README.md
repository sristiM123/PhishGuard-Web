# PhishGuard — Friendly Link Safety Checker

> A privacy-first phishing detection tool for everyday users. Checks links using structural heuristics, homoglyph detection, and Google Safe Browsing — entirely in the browser, with no data sent to any server unless you explicitly ask it to check a link.

**Live Web App:** https://sristim123.github.io/PhishGuard-Web/
**Chrome Extension:** https://chromewebstore.google.com/detail/phishguard-%E2%80%94-friendly-lin/gcojanglhmkpmlflmafehhdljmmafkha

---

## What It Does

PhishGuard helps non-technical users identify potentially dangerous links before clicking them. It is designed for families, students, and anyone who receives suspicious links in emails, chats, or social media.

It works in two forms:

- **Web app** — paste any link and get an instant analysis with a plain-language explanation
- **Chrome extension** — passively highlights suspicious links on every page you visit, with a popup dashboard and context menu integration

---

## Detection Architecture

PhishGuard uses a three-layer detection approach. Each layer catches a different class of threat.

### Layer 1 — Structural Heuristics (`pg-core.js`)

Analyses the shape and structure of the URL without making any network requests. This layer runs entirely client-side and catches structurally suspicious URLs in real time.

| Signal | Weight | What it detects |
|---|---|---|
| HTTP instead of HTTPS | +20 | Unencrypted connection |
| IP address as hostname | +25 | Direct IP access, common in attacks |
| `@` character in URL | +25 | Credential hiding technique |
| Suspicious TLD (.xyz, .tk, .ml, etc.) | +15 | High-abuse domain extensions |
| Excessive subdomains (3+) | +15 | Domain spoofing via subdomain nesting |
| Long URL (100–200 chars) | +10 | Obfuscation |
| Very long URL (200+ chars) | +20 | Heavy obfuscation |
| Excessive hyphens in hostname (4+) | +15 | Brand impersonation via dashes |
| Phishing keywords in path | +20 | login, verify, account, reset, etc. |
| Punycode in hostname | +25 | Unicode character spoofing |
| High hostname entropy | +15 | Random-looking hostnames (DGA domains) |
| High path entropy | +10 | Randomised paths hiding destination |
| Heavy percent-encoding (15+ chars) | +20 | Path obfuscation |
| Homoglyph/lookalike detection | +40 | Visual character substitution attacks |

Risk thresholds: **Low** (0–30), **Medium** (31–70), **High** (71–100)

### Layer 2 — Homoglyph Detection (`pg-core.js`)

Catches brand impersonation attacks where attackers substitute visually similar characters to fool users. For example `paypa1.com` (digit 1 instead of letter l) or `g00gle.com` (zeros instead of o).

The detector normalises hostnames by mapping confusable characters — digits, Cyrillic, Greek lookalikes, and common multi-character substitutions (`rn` to `m`, `vv` to `w`, `cl` to `d`) — then compares against 35 major brand domains.

**Example:** `arnazon.com` — `rn` normalises to `m`, matching `amazon`. Scored +40 and flagged immediately.

### Layer 3 — Google Safe Browsing API (`pg-safebrowsing.js`)

When a user explicitly checks a link, it is sent to Google's Safe Browsing Lookup API v4. This checks the URL against Google's continuously updated database of confirmed phishing sites, malware distributors, and social engineering pages.

This layer catches threats that look structurally clean — a real phishing site can use HTTPS, a short URL, and a normal-looking domain name, scoring 0/100 on heuristics while being on Google's blocklist.

**Privacy note:** URLs are only sent to Google when the user actively clicks Check. No passive or bulk scanning occurs.

---

## Why Two Layers Are Not Enough Alone

This is the core finding of the project, demonstrated with a concrete example:

**URL:** `http://malware.testing.google.test/testing/malware/`

| Detection method | Result | Correct? |
|---|---|---|
| Heuristics only | Score 25/100 — "Feels mostly okay" | No |
| Safe Browsing only | Not structurally checked | Incomplete |
| Heuristics + Safe Browsing | Score 25 + "Google has flagged this as malware" | Yes |

The heuristic scorer correctly evaluates the URL's structure — HTTP (+20) and multiple subdomains (+5) gives 25/100. Structurally it is not particularly suspicious. Safe Browsing catches it as a confirmed malware distribution site. Neither approach alone is sufficient. Together they cover both structurally suspicious URLs that may not yet be in any database, and confirmed threats that look structurally clean.

---

## Project Structure

```
PhishGuard-Web/
├── extension/
│   ├── pg-core.js           # Canonical scoring engine — single source of truth
│   ├── pg-safebrowsing.js   # Google Safe Browsing API integration
│   ├── background.js        # Service worker — network monitoring, context menu
│   ├── content-script.js    # Page scanner — link decoration, scam detection
│   ├── popup.html/js        # Extension popup with sensitivity slider
│   ├── dashboard.html/js    # Full stats dashboard
│   ├── warning.html/js      # Safe landing page for dangerous links
│   ├── analyzer.js          # Redirect note (logic moved to pg-core.js)
│   └── manifest.json        # Chrome Manifest V3
├── public/
│   ├── index.html           # Web app
│   └── app.js               # Web app UI logic
└── server.js                # Express static server
```

### Key architectural decision — `pg-core.js`

All URL scoring logic lives in exactly one place. Previously the codebase had four separate copies of the scoring function with different numbers of signals. `pg-core.js` is loaded by `background.js` via `importScripts`, by `content-script.js` via the manifest, and by `index.html` via a script tag. Every surface now uses the same 14-signal analyzer.

---

## Extension Features

- **Link highlighting** — risky links on any page get a red dotted underline and a `!` icon with tooltip
- **Email panel** — when visiting Gmail, Outlook, or Yahoo Mail, a summary panel shows link counts for the current email
- **Scam message detection** — on WhatsApp Web, Messenger, Teams, Slack, and Telegram, messages containing known scam phrases are flagged
- **Context menu** — right-click any link to check it instantly, with a Chrome notification showing the result
- **Network dashboard** — full stats on all network requests seen during the session
- **Parent/Child mode** — simplified view for child users
- **Sensitivity slider** — Quiet (High only), Balanced (default), Strict (Medium + High)
- **Multilingual** — English, Macedonian, Bangla, Spanish, French, Turkish, Italian, Hindi, German

---

## Setup

### Web app

```bash
git clone https://github.com/sristiM123/PhishGuard-Web.git
cd PhishGuard-Web
npm install
npm start
# Open http://localhost:9091
```

### Chrome extension

1. Open `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the `extension/` folder

### Google Safe Browsing (optional but recommended)

1. Go to https://console.cloud.google.com
2. Enable the **Safe Browsing API**
3. Create an API key under **Credentials**
4. Paste it into `extension/pg-safebrowsing.js`:

```javascript
const PG_SAFE_BROWSING_KEY = "your-key-here";
```

---

## Limitations

- Heuristic detection is based on URL structure only — it does not fetch or analyse page content
- The Safe Browsing check requires an API key and an active internet connection
- Homoglyph detection covers 35 major brand domains — niche brand impersonation is not detected
- The network simulation in the web app is educational only — it does not reflect actual traffic
- False positives are possible on legitimate URLs with unusual structures

---



## License

MIT License — see `LICENSE` for details.
