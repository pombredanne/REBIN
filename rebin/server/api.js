var ss = require('socketstream'),
    path = require('path'),
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
    var executable = binary.executable;
    
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
    
    var command = path.join(process.cwd(), "executables", executable) + params;
    
    var child = exec(command, function (error, stdout, stderr) {
      console.log(stderr)
      res.send({ output: stdout });
      
      // log the request and response to redis for debug viewer
      client.incr("logs_id", function (err, autoid) {
        var model = {
          id: autoid.toString(),
          datetime: new Date().toISOString(),
          remote_ip: req.ip,
          url: req.path,
          parameters: JSON.stringify(req.query),
          // user:
          headers: JSON.stringify(req.headers),
          response: stdout,
          error: stderr
        };
        
        client.hmset("logs:"+model.id, model);
        client.expire("logs:"+model.id, 3600)
        client.rpush("logs", model.id);
        
        model.error = model.error || false;
        
        res = {
          model: model,
          method: "create",
          modelname: "Endpoint"
        };
        ss.api.publish.all("sync:Log", JSON.stringify(res));
      });
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