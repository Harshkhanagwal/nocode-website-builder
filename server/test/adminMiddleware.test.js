const test = require("node:test");
const assert = require("node:assert/strict");
const requireAdmin = require("../src/middleware/adminMiddleware");

function makeResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test("admin middleware allows users with admin set to true", () => {
  const response = makeResponse();
  let continued = false;
  requireAdmin({ user: { email: "user@example.com", admin: true } }, response, () => { continued = true; });
  assert.equal(continued, true);
});

test("admin middleware rejects regular users and missing authenticated users", () => {
  const forbidden = makeResponse();
  requireAdmin({ user: { email: "user@example.com", admin: false } }, forbidden, () => {});
  assert.equal(forbidden.statusCode, 403);

  const unauthenticated = makeResponse();
  requireAdmin({}, unauthenticated, () => {});
  assert.equal(unauthenticated.statusCode, 403);
});
