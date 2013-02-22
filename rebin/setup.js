var bcrypt = require('bcrypt');
var prompt = require('prompt');
var redis = require("redis"),
    client = redis.createClient();


var schema = {
  properties: {
    username: {
      pattern: /^[a-zA-Z0-9\-]+$/,
      message: 'Username must be only letters, numbers, or dashes',
      required: true
    },
    password: {
      hidden: true
    }
  }
};

//
// Start the prompt
//
prompt.start();

//
// Get two properties from the user: username, password
//
prompt.get(schema, function (err, result) {
  var user = {
    username: result.username,
    password: bcrypt.hashSync(result.password, 8)
  }
  client.hmset("users:"+result.username, user);
  
  console.log('Account created for ' + result.username);
  process.exit(code=0)
});
