/* ======================= app/routes.js ======================= */
module.exports = function(app, passport, user) {
  require('./routes/user.routes.js')(app, passport, user);
  require('./routes/category.routes.js')(app, passport,user);
};

// route middleware to check if user is logged in
function isLoggedIn(req, res, next){
  // if user is authenticated in the sessions...
  if(req.isAuthenticated() )
    return next();
  
  // If they aren't authenticated, ditch them.
  res.redirect('/');
}