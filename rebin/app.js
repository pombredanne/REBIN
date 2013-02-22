// rebin

var ss = require('socketstream'),
    express = require('express');
    
var app = express();

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['app.less', 'libs'],
  code: ['libs', 'app'],
  tmpl: '*'
});

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
var api = require('./server/api');
api.generateBinaryRoutes();

app.get('/api/:binary', api.get);
app.post('/api/:binary', api.post);


// Start web server
var server = app.listen(3000);

// Start SocketStream
ss.start(server);

// Append SocketStream middleware to the stack
app.stack = ss.http.middleware.stack.concat(app.stack);
