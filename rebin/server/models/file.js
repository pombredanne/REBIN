var diveSync = require("diveSync");

module.exports = function(req, res, ss) {
  req.use('session');
  req.use('user.authenticated');
  return {
    readAll: function(model) {
      var id, models;
      models = [];
      
      var dir = process.cwd() + "/executables";
      diveSync(dir, function(err, file) {
        if (err) throw err;
        models.push({
          fileName: file.replace(dir+"/", "")
        });
      });
      
      res = {
        models: models,
        method: "read",
        modelname: "File"
      };
      ss.publish.socketId(req.socketId, "sync:File", JSON.stringify(res));
            
      return;
    }
  };
};