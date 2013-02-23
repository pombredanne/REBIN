var redis = require("redis"),
    client = redis.createClient();


module.exports = function(req, res, ss) {
  req.use('session');
  req.use('user.authenticated');
  return {
    create: function(model) {
      // not implemented
      return;
    },
    update: function(model) {
      // not implemented
      return;
    },
    read: function(model) {
      var fetchedModel;
      client.hgetall("logs:"+model.id, function (err, object) {
        object.error = object.error || false;
        res = {
          model: object,
          method: "read",
          modelname: "Log"
        };
        ss.publish.socketId(req.socketId, "sync:Log:" + model.id, JSON.stringify(res));
      });
      return;
    },
    readAll: function(model) {
      var id, models;
      models = [];
      client.lrange("logs", "-10", "-1", function (err, ids) {
        var multi = client.multi();
        
        for (id in ids) {
          multi.hgetall("logs:"+ids[id])
        }
        
        multi.exec(function (err, objects) {
          for (object in objects) {
            var obj = objects[object];
            obj.error = obj.error || false;
            
            models.push(obj);
          }

          res = {
            models: models,
            method: "read",
            modelname: "Log"
          };
          ss.publish.socketId(req.socketId, "sync:Log", JSON.stringify(res));
        });
      });
      
      return;
    },
    delete: function(model) {
      // not implemented
      return;
    }
  };
};