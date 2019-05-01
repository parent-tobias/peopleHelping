module.exports = (app, passport, user) => {

// define some roles here, to limit which routes are accessible to whom
  /***
   * First, we define roles specifically limited to anonymous users.
   *  If we return false here, any other rules are not run.
   ***/
  user.use(function(req, action){
    if(!req.isAuthenticated() ) return action === 'access public page'
  });
  
  // Members can access basic member pages, but so can others.
  //  because of this, we don't return false if the user isn't a mod.
  user.use('access member page', function(req){
    if(req.user.local.role === 'member' || req.user.local.role === 'provider' || req.user.local.role === 'admin'){
      return true;
    }
  });
  
  user.use('access provider page', function(req){
    if(req.user.local.role === 'provider' || req.user.local.role === 'admin'){
      return true;
    }
  });
  
  // Admin users can go ANYWHERE
  user.use(function(req){
    if(req.user.local.role === 'admin'){
      return true;
    }
  })
  
  /* Home page, with login links */
  app.get('/', user.can('access public page'), function(req, res){
    user = user ? user : undefined;
    res.render('index');
  });
  
  app.get('/login', user.can('access public page'), function(req, res){
    res.render('login', {message: req.flash('loginMessage') });
  });
  
  //process a login attempt
  app.post('/login', user.can('access public page'), passport.authenticate('local-login', {
    successRedirect   : '/profile',
    failureRedirect   : '/signup',
    failureFlash      : true  
  }));
  
  /* ======================================================== *
   *               SIGNUP stuff                               *
   * ======================================================== */
  app.get('/signup', user.can('access public page'), function(req, res){
    res.render('signup', {message: req.flash('signupMessage') });
  })
  
  //Process the signup
  app.post('/signup', user.can('access public page'), passport.authenticate('local-signup',{
    successRedirect   : '/profile',
    failureRedirect   : '/signup',
    failureFlash      : true  
  }));
  
  app.get('/profile', user.can('access member page'), function(req, res){
  /* ============================================================ *
   *   Content below should only be accessible to logged in users *
   * ============================================================ */
    res.render('secure/profile', {
      user: req.user // pull the user from the session, pass it to the template
    });
  });
  
  app.get('/users/about', user.can('access member page'), function(req, res){
    res.render('secure/about', {
      user: req.user // pull the user from the session, pass it to the template
    });
  });
  
  /* ============================================================ *
   *   Content below should only be accessible to logged in users *
   * ============================================================ */
  app.get('/admin', user.can('access admin page'), function(req, res){
    res.render('admin/index', {
      user: req.user
    })
  });
  
  
  /* ======================================================== *
   *               LOGOUT stuff                               *
   * ======================================================== */
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}