exports.authenticated = function() {
  return function(req, res, next) {
    if (req.session && (req.session.passport.user != null)) {
      return next();
    } else {
      return res(401);
    }
  };
};