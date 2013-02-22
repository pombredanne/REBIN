var diveSync = require("diveSync");

exports.actions = function(req, res, ss) {

  return {

    list: function(){
      var dir = process.cwd() + "/executables";
      var results = [];
      diveSync(dir, function(err, file) {
        if (err) throw err;
        results.push({
          fileName: file.replace(dir+"/", "")
        });
      });
      res(results);
    }
  }
};