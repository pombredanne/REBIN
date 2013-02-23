// rebin
var redis = require("redis"),
    client = redis.createClient();

var ss = require('socketstream'),
    express = require('express');
    
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    
var bcrypt = require('bcrypt');
var api = require('./server/api');
    
var app = express();

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['app.less', 'libs'],
  code: ['libs', 'app'],
  tmpl: '*'
});

ss.client.define('login', {
  view: 'login.html',
  css:  ['app.less', 'libs'],
  code: null,
  tmpl: '*'
});

ss.session.store.use('redis');
ss.publish.transport.use('redis');

passport.use(new LocalStrategy(
  function(username, password, done) {
    client.hgetall("users:"+username, function (err, user) {
      if (err) { return done(err); }
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  client.hgetall("users:"+username, function (err, user) {
    done(err, user);
  });
});

ss.http.middleware.prepend(ss.http.connect.bodyParser());

app.use(passport.initialize());
app.use(passport.session());


// Code Formatters
ss.client.formatters.add(require('ss-less'));

// Use server-side compiled Hogan (Mustache) templates
ss.client.templateEngine.use(require('ss-hogan'));

// responders
ss_backbone_opts = {
  models: {
    folder: "models"
  }
}
ss.responders.add(require('./server/ss-backbone'), ss_backbone_opts);

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

// Serve this client on the root URL
app.get('/', function(req, res) {
  res.serveClient('main');
});

// serve api based on configured binaries
api.generateBinaryRoutes();

app.get('/api/:binary', api.get);
app.post('/api/:binary', api.post);


app.get('/login', function(req, res) {
  res.serveClient('login');
});

app.post('/login', passport.authenticate('local', { 
  successRedirect: '/',
  failureRedirect: '/login'
}));


// Start web server
var server = app.listen(process.env.REBIN_PORT || 3000);

// Start SocketStream
ss.start(server);

// Append SocketStream middleware to the stack
app.stack = ss.http.middleware.stack.concat(app.stack);

process.on('uncaughtException', function(error) {
  console.log(error);
});
