/* ======================= app/routes.js ======================= */
module.exports = function(app, passport) {
  /* Home page, with login links */
  app.get('/', function(req, res){
    res.render('index');
  });
  
  app.get('/login', function(req, res){
    res.render('login', {message: req.flash('loginMessage') });
  });
  
  //process a login attempt
  app.post('/login', passport.authenticate('local-login', {
    successRedirect   : '/profile',
    failureRedirect   : '/signup',
    failureFlash      : true  
  }));
  
  /* ======================================================== *
   *               SIGNUP stuff                               *
   * ======================================================== */
  app.get('/signup', function(req, res){
    res.render('signup', {message: req.flash('signupMessage') });
  })
  
  //Process the signup
  app.post('/signup', passport.authenticate('local-signup',{
    successRedirect   : '/profile',
    failureRedirect   : '/signup',
    failureFlash      : true  
  }));
  
  /* ============================================================ *
   *   Content below should only be accessible to logged in users *
   * ============================================================ */
  app.get('/profile', isLoggedIn, function(req, res){
    res.render('profile', {
      user: req.user // pull the user from the session, pass it to the template
    });
  });
  
  app.get('/users/about', isLoggedIn, function(req, res){
    res.render('secure/about', {
      user: req.user // pull the user from the session, pass it to the template
    });
  });
  
  
  
  /* ======================================================== *
   *               LOGOUT stuff                               *
   * ======================================================== */
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
};

// route middleware to check if user is logged in
function isLoggedIn(req, res, next){
  // if user is authenticated in the sessions...
  if(req.isAuthenticated() )
    return next();
  
  // If they aren't authenticated, ditch them.
  res.redirect('/');
}