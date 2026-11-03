const { createServer } = require("node:http");
const { readFile } = require("node:fs/promises");
const { join } = require("node:path");

const publicFiles = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/style.css": ["style.css", "text/css; charset=utf-8"],
  "/app.js": ["app.js", "text/javascript; charset=utf-8"],
};

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}

function createAppServer() {
  return createServer(async (request, response) => {
    const pathname = new URL(request.url, "http://localhost").pathname;

    if (request.method !== "GET") {
      response.writeHead(405, { Allow: "GET" });
      response.end("Method Not Allowed");
      return;
    }

    if (pathname === "/api/health") {
      sendJson(response, 200, {
        status: "ok",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const file = publicFiles[pathname];
    if (!file) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }

    try {
      const content = await readFile(join(__dirname, file[0]));
      response.writeHead(200, {
        "Content-Type": file[1],
        "Content-Length": content.length,
      });
      response.end(content);
    } catch (error) {
      console.error(`Failed to serve ${pathname}:`, error);
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Internal Server Error");
    }
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  const server = createAppServer();

  server.on("error", (error) => {
    console.error("Server failed:", error);
    process.exitCode = 1;
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`DevOps Starter listening on port ${port}`);
  });
}

module.exports = { createAppServer };
