function requireAdmin(req, res, next) {
  if (req.user?.admin !== true) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  return next();
}

module.exports = requireAdmin;
