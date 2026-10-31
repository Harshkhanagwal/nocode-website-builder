const hasValidAdminBootstrapKey = require("../utils/hasValidAdminBootstrapKey");

function requireAdminBootstrapKey(req, res, next) {
  if (!process.env.ADMIN_BOOTSTRAP_KEY) {
    return res.status(503).json({
      success: false,
      message: "Admin bootstrap is not configured on the server",
    });
  }

  if (!hasValidAdminBootstrapKey(req.get("x-admin-bootstrap-key"))) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin bootstrap key",
    });
  }

  return next();
}

module.exports = requireAdminBootstrapKey;
