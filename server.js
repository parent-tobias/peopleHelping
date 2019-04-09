/* Setup */
const express       = require('express'),
      app           = express(),
      port          = process.env.PORT || 3030,
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      ConnectRoles  = require('connect-roles'),
      flash         = require('connect-flash'),
      
      morgan        = require('morgan'),
      cookieParser  = require('cookie-parser'),
      bodyParser    = require('body-parser'),
      session       = require('express-session'),
      
      configDB      = require('./config/database');

// Connect to our mongoose db
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url); 

require('./config/passport')(passport);

// Set up some user roles
const user = new ConnectRoles({
  failureHandler: function(req, res, action){
    // optional function that runs when the user fails
    //  authorisation (that is **not** the same as authentication!)
    let accept = req.headers.accept || '';
    res.status(403);
    if(~accept.indexOf('html')){
      res.render('access-denied', {action: action});
    } else {
      res.send(`Access Denied - You don't have permisson to: ${action}`);
    }
  }
});


// set up our express app
app.use(morgan('dev'));   // log requests to the console
app.use(cookieParser() ); // We'll use cookies for auth. Eventually, change to JWT
app.use(bodyParser());    // get HTML form info.

app.set('view engine', 'ejs');

// Passport requirements
app.use(session({ secret: 'whosthe13igbad13unny' })); // session secret
app.use(passport.initialize() );
app.use(passport.session() ); // persistent login sessions
app.use(user.middleware() );

app.use(flash() );  // use connect-flash for flash messages stored in session 

/* ===================== Routes ===================== */
require('./app/routes')(app, passport, user); // load our routes, pass in our app and passport

/* ================== LAUNCH IT!! =================== */
app.listen(port);
console.log(`The magic is live on port ${port}.`);