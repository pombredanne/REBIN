var api = require('../../server/api');

var redis = require("redis"),
    client = redis.createClient();


module.exports = function(req, res, ss) {
  req.use('session');
  req.use('user.authenticated');
  return {
    create: function(model) {
      client.incr("endpoints_id", function (err, autoid) {
        var cid;
        cid = req.cid;
        model.id = autoid.toString();
        res = {
          cid: cid,
          model: model,
          method: "confirm",
          modelname: "Endpoint"
        };
        
        // massage the model to save nicely in redis
        // save parameters as json string
        model.parameters = JSON.stringify(model.parameters);
        
        client.hmset("endpoints:"+model.id, model);
        client.rpush("endpoints", model.id);
        
        api.generateBinaryRoutes();
        ss.publish.socketId(req.socketId, "sync:Endpoint:" + cid, JSON.stringify(res));
        delete res.cid;
        res.method = "create";
        ss.publish.all("sync:Endpoint", JSON.stringify(res));
      });
      return;
    },
    update: function(model) {
      // waiting on the redis client fix so i don't have to manually make numbers into string before using hmset
      model.id = model.id.toString();
      
      res = {
        model: model,
        method: "update",
        modelname: "Endpoint"
      };
      res = JSON.stringify(res);
      
      // massage the model to save nicely in redis
      // save parameters as json string
      model.parameters = JSON.stringify(model.parameters);
      
      client.hmset("endpoints:"+model.id, model);
      
      api.generateBinaryRoutes();
      return ss.publish.all("sync:Endpoint:" + model.id, res);
    },
    read: function(model) {
      var fetchedModel;
      client.hgetall("endpoints:"+model.id, function (err, object) {
        // massage the model to save nicely in redis
        // save parameters as json string
        object.parameters = JSON.parse(object.parameters);
        
        res = {
          model: object,
          method: "read",
          modelname: "Endpoint"
        };
        ss.publish.socketId(req.socketId, "sync:Endpoint:" + model.id, JSON.stringify(res));
      });
      return;
    },
    readAll: function(model) {
      var id, models;
      models = [];
      client.lrange("endpoints", "0", "-1", function (err, ids) {
        var multi = client.multi();
        
        for (id in ids) {
          multi.hgetall("endpoints:"+ids[id])
        }
        
        multi.exec(function (err, objects) {
          for (object in objects) {
            // massage the model to save nicely in redis
            // save parameters as json string
            objects[object].parameters = JSON.parse(objects[object].parameters);
            
            models.push(objects[object]);
          }

          res = {
            models: models,
            method: "read",
            modelname: "Endpoint"
          };
          ss.publish.socketId(req.socketId, "sync:Endpoint", JSON.stringify(res));
        });
      });
      
      return;
    },
    delete: function(model) {
      client.lrem("endpoints", "0", model.id);
      client.del("endpoints:"+model.id);
      res = {
        method: "delete",
        model: model,
        modelname: "Endpoint"
      };
      api.generateBinaryRoutes();
      return ss.publish.all("sync:Endpoint:" + model.id, JSON.stringify(res));
    }
  };
};