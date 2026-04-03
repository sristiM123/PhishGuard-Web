// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 9091;

// Serve web app files from public/
app.use(express.static(path.join(__dirname, "public")));

// Also expose extension/ so index.html can load extension/pg-core.js
app.use("/extension", express.static(path.join(__dirname, "extension")));

app.listen(PORT, () => {
    console.log(` PhishGuard running at http://localhost:${PORT}`);
});