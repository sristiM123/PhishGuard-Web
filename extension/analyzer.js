// analyzer.js
// The scoring logic that was here has been moved to pg-core.js
// which is the single source of truth for all URL analysis.
//
// All functions are now available as globals when pg-core.js is loaded:
//   pgAnalyzeUrl(urlString) -> { valid, error, score, riskLevel, factors, parsed }
//   pgIsIpAddress(hostname)
//   pgGetTld(hostname)
//   pgIsPunycode(hostname)
//   pgEntropy(str)
//   pgEncodedCount(str)
//   PG_SUSPICIOUS_TLDS
//   PG_PHISHING_KEYWORDS