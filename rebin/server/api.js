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


function sanitise(unsanitised_string, match_to){
  var sanitised = unsanitised_string.match(match_to);
  if (sanitised !== null) {
    var toReturn = new Array();
    for(var idx = 1; idx < sanitised.length; idx++){
      toReturn.push(sanitised[idx]);
    }
    toReturn = toReturn.join('');
    return toReturn; 
  } else {
    return null;
  }
}

exports.get = function (req, res, next) {
  var binaryName = req.params.binary;
  if (binaryName in binaryRoutes) {
    var binary = binaryRoutes[binaryName];
    var executable = binary.executable;
    
    var params = "";
    if (Object.keys(req.query).length) {
      for (parameterObject in binary.parameters) {
        var parameter = binary.parameters[parameterObject]['name'];
        var match_to = new RegExp(binary.parameters[parameterObject]['regex']);
        // Commands can have a command line flag bound to them. If they do we wish to prepend
        // the flag before the command. 
        var cli_binding = binary.parameters[parameterObject]['command line flag binding'];
        if (cli_binding != null) {
          params += ' '+cli_binding;
        }
        var param = req.query[parameter];


        // Sometimes you may wish to pass a default value to a command line
        // argument, without need the user to specify it manually (or maybe you
        // want it to be opaque to the end user). 
        var default_value = binary.parameters[parameterObject]['default value'];
        var override_allowed = binary.parameters[parameterObject]['allow override of default'];
        if (
          default_value != null //make sure we have a default to set, otherwise assume comes from user
          && 
          ((param == null || param.length == 0 ) // in the case that they didn't set the argument
          || 
          ( override_allowed == false )) // Or if they aren't allowed to override it, we use the default
        ) {
          params += ' '+default_value;
          // In the event the user provides a value (and is allowed to override)
          // OR there is no default, we should attempt to use that
        } else {
          // if multiple parameters is with the same name are in the query string, 
          // they are combined into an array with the param name as key
          if (Array.isArray(param)) {
            var safe_params = new Array();
            for(idx in param){
              var sanitised = sanitise(param[idx],match_to);
              if (sanitised != null) {
                safe_params.push(sanitise(param[idx],match_to));
              }
            }
            params += ' "' + safe_params.join('" "');
            params += '"';
          } else if (typeof param !== 'undefined') {
            param = sanitise(param,match_to);
            if(param != null) {
              params += ' "' + param + '"';
            }
          }
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
