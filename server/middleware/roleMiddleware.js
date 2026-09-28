function authorizeRoles(...allowedRoles) {
  return function(req, res, next) {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        message: "Forbidden: No role assigned",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Access restricted to ${allowedRoles.join(", ")} only`,
      });
    }

    next();
  };
};

export default authorizeRoles;
