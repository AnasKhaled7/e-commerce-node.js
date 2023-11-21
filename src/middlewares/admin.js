const isAdmin = (req, res, next) => {
  return req.user.isAdmin
    ? next()
    : next(new Error("Not authorized", { cause: 403 }));
};

export default isAdmin;
