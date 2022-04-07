module.exports = function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() || req.session.loggedIn) return next();
  res.redirect('/users/login');
}