const { timingSafeEqual } = require("crypto");

function hasValidAdminBootstrapKey(suppliedKey) {
  const configuredKey = process.env.ADMIN_BOOTSTRAP_KEY;
  if (!configuredKey || typeof suppliedKey !== "string") return false;

  const expected = Buffer.from(configuredKey);
  const supplied = Buffer.from(suppliedKey);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

module.exports = hasValidAdminBootstrapKey;
