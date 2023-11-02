const isAuthorized = (roles) => {
  return (req, res, next) => {
    return roles.includes(req.user.role)
      ? next()
      : res.status(403).json({ message: "Unauthorized" });
  };
};

export default isAuthorized;
