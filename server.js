/**
 * server.js - Node.js Backend Server for PromptWars Banking System
 * 
 * Features:
 * - Pure Node.js built-in modules (http, fs, path, url) -> ZERO npm dependencies required!
 * - Serves static frontend assets (index.html, style.css, js/*)
 * - REST API Endpoints:
 *   POST /api/query          -> Pipeline: User Query -> Agent 1 (bankism) -> Agent 2 (BankHandler) -> BankCore
 *   GET  /api/account        -> Fetches current testaccount details and balance
 *   GET  /api/statements     -> Fetches statement audit ledger
 *   POST /api/reset-lockdown -> Resets bankism security lockdown
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

// Import Agent & Core Modules
const BankismAgent = require("./js/bankism.js");
const BankCoreSystem = require("./js/bankCore.js");
const BankHandlerAgent = require("./js/bankHandler.js");

// Initialize Singletons
const bankism = new BankismAgent();
const bankCore = new BankCoreSystem();
const bankHandler = new BankHandlerAgent(bankCore);

const PORT = process.env.PORT || 8000;
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

/**
 * Reads JSON request body from incoming stream
 */
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

/**
 * Sends JSON HTTP response
 */
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer(async (req, res) => {
  // Handle CORS Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 1. API: POST /api/query (Multi-Agent Pipeline)
  if (pathname === "/api/query" && req.method === "POST") {
    try {
      const body = await parseJsonBody(req);
      const query = body.query || "";
      const session = body.session || { username: "testaccount", accountNumber: "ACC-8839201" };

      // Step A: Agent 1 (bankism) evaluates spoken/written query (Zero DB access)
      const bankismTelemetry = bankism.analyzeQuery(query, session);

      // Step B: Agent 2 (BankHandler) coordinates with BankCore
      const handlerResult = bankHandler.processAction(bankismTelemetry);

      // Step C: Get updated account snapshot
      const accountSnapshot = bankCore.getBalance(session.accountNumber);
      const statements = bankCore.getStatements(session.accountNumber);

      return sendJson(res, 200, {
        success: true,
        query: query,
        bankism: bankismTelemetry,
        bankHandler: handlerResult,
        account: accountSnapshot,
        statements: statements
      });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: err.message });
    }
  }

  // 2. API: GET /api/account
  if (pathname === "/api/account" && req.method === "GET") {
    const accNumber = parsedUrl.query.account || "ACC-8839201";
    const acc = bankCore.getBalance(accNumber);
    return sendJson(res, 200, acc);
  }

  // 3. API: GET /api/statements
  if (pathname === "/api/statements" && req.method === "GET") {
    const accNumber = parsedUrl.query.account || "ACC-8839201";
    const stmt = bankCore.getStatements(accNumber);
    return sendJson(res, 200, { statements: stmt });
  }

  // 3b. API: GET /api/recipients
  if (pathname === "/api/recipients" && req.method === "GET") {
    const exclude = parsedUrl.query.exclude || "ACC-8839201";
    const directory = bankCore.getRecipientDirectory(exclude);
    return sendJson(res, 200, { recipients: directory });
  }

  // 4. API: POST /api/reset-lockdown
  if (pathname === "/api/reset-lockdown" && req.method === "POST") {
    bankism.resetLockdown();
    return sendJson(res, 200, { success: true, message: "Security Lockdown reset. Agent 1 re-armed." });
  }

  // 5. Static File Serving (HTML, CSS, JS)
  let filePath = path.join(__dirname, pathname === "/" ? "index.html" : pathname);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Fallback to index.html if root not found
        fs.readFile(path.join(__dirname, "index.html"), (fbErr, fbContent) => {
          if (fbErr) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(fbContent);
          }
        });
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 Server Error");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`PromptWars Banking System running at http://localhost:${PORT}`);
});
