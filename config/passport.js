// Load all the things we'll need
const LocalStrategy = require('passport-local').Strategy,
  User = require('../app/models/user');

const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = function(passport) {
  // passport session setup
  // required for persistent logins.
  //   ** v2 should include the JWT option

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /****
   * LOCAL SINGNUP
   * We are using named strategies since we have one for login and
   *   one for signup. By default, if there was no name, it would be
   *   called 'local' 
   ****/
  passport.use('local-signup', new LocalStrategy({
    // By default username and password. We'll use email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass the entire request
  }, function(req, email, password, done) {
    // Asynchronous
    // User.findOne won't fire unless data is sent back
    process.nextTick(function() {
      // Find a user whose email is the same as the form's
      User.findOne({
        'local.email': email
      }, function(err, user) {
        if (err)
          return done(err);

        // Do we have a user?
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is taken.'));
        } else {
          // No user with that email. Yaay!
          var newUser = new User();

          // Set credentials...
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.local.role = 'member';

          // Let's save them!
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));
  
  /****
 * LOCAL LOGIN 
 *
 * we are using named strategies since we have one for login and one
 *   for signup by default, if there was no name, it would just be
 *   called 'local'
 ****/
passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) { // callback with email and password from our form

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({
      'local.email': email
    }, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err)
        return done(err);

      // if no user is found, return the message
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

      // if the user is found but the password is wrong
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

      // all is well, return successful user
      return done(null, user);
    });
  }));


passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'sophie_is_qU3En'
    },
    function (jwtPayload, cb) {

        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return UserModel.findOneById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
  ));
};