// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 9091; // required port

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log(` PhishGuard running at http://localhost:${PORT}`);
});
