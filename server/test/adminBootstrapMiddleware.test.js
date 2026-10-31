const test = require("node:test");
const assert = require("node:assert/strict");
const requireAdminBootstrapKey = require("../src/middleware/adminBootstrapMiddleware");

function response() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test("bootstrap middleware accepts the configured header secret", () => {
  const previous = process.env.ADMIN_BOOTSTRAP_KEY;
  process.env.ADMIN_BOOTSTRAP_KEY = "test-secret";
  const res = response();
  let continued = false;
  requireAdminBootstrapKey({ get: () => "test-secret" }, res, () => { continued = true; });
  if (previous === undefined) delete process.env.ADMIN_BOOTSTRAP_KEY;
  else process.env.ADMIN_BOOTSTRAP_KEY = previous;
  assert.equal(continued, true);
});

test("bootstrap middleware rejects wrong or unconfigured secrets", () => {
  const previous = process.env.ADMIN_BOOTSTRAP_KEY;
  process.env.ADMIN_BOOTSTRAP_KEY = "test-secret";
  const wrongKey = response();
  requireAdminBootstrapKey({ get: () => "wrong-secret" }, wrongKey, () => {});
  assert.equal(wrongKey.statusCode, 401);

  delete process.env.ADMIN_BOOTSTRAP_KEY;
  const unconfigured = response();
  requireAdminBootstrapKey({ get: () => "test-secret" }, unconfigured, () => {});
  if (previous !== undefined) process.env.ADMIN_BOOTSTRAP_KEY = previous;
  assert.equal(unconfigured.statusCode, 503);
});
