const isAuthorized = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};

module.exports = isAuthorized;
