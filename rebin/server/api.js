var events = require('events'),
    exec = require('child_process').exec;

var redis = require("redis"),
    client = redis.createClient();

var binaryRoutes = {};


exports.generateBinaryRoutes = function() {
  console.log('rebuilding binary routes');
  var routes = {}
  client.lrange("endpoints", "0", "-1", function (err, ids) {
    var multi = client.multi();
    
    for (id in ids) {
      multi.hgetall("endpoints:"+ids[id])
    }
    
    multi.exec(function (err, objects) {
      for (objectId in objects) {
        object = objects[objectId]
        object.parameters = JSON.parse(object.parameters);
        routes[object.url] = object;
      }
      binaryRoutes = routes;
    });
  });
}

exports.get = function (req, res, next) {
  var binaryName = req.params.binary;
  if (binaryName in binaryRoutes) {
    var binary = binaryRoutes[binaryName];
    var command = binary.path;
    
    var params = "";
    if (Object.keys(req.query).length) {
      for (parameterId in binary.parameters) {
        var parameter = binary.parameters[parameterId];
        var param = req.query[parameter];
        
        // if multiple parameters is with the same name are in the query string, 
        // they are combined into an array with the param name as key
        if (Array.isArray(param)) {
          params += ' "' + param.join('" "');
          params += '"';
        } else if (typeof param !== 'undefined') {
          params += ' "' + param + '"';
        }
      }
    }
    
    var child = exec(command + params, function (error, stdout, stderr) {
      console.log(stderr)
      res.send({ output: stdout });
    });
    
  } else {
    res.send(404);
  }
};

exports.post = function (req, res, next) {
  var binary = req.params.binary;
  if (binary in binaryRoutes) {
    var command = binaryRoutes[binary].path;
    var child = exec(command, function (error, stdout, stderr) {
      console.log(stderr)
      res.send({ output: stdout });
    });
    
  } else {
    res.send(404);
  }
};