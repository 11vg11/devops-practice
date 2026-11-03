const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { createAppServer } = require("../server");

const server = createAppServer();
let baseUrl;

before(async () => {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("health endpoint returns an OK status and ISO timestamp", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(Number.isNaN(Date.parse(body.timestamp)), false);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("homepage and frontend assets are served", async () => {
  const homepage = await fetch(`${baseUrl}/`);
  const html = await homepage.text();
  assert.equal(homepage.status, 200);
  assert.match(html, /Hello, DevOps!/);

  for (const [path, contentType] of [
    ["/style.css", "text/css"],
    ["/app.js", "text/javascript"],
  ]) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), new RegExp(contentType));
  }
});

test("unknown paths return 404", async () => {
  const response = await fetch(`${baseUrl}/not-found`);

  assert.equal(response.status, 404);
  assert.equal(await response.text(), "Not Found");
});

test("methods other than GET return 405", async () => {
  const response = await fetch(`${baseUrl}/api/health`, { method: "POST" });

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET");
});
