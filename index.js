var fs = require("fs");
// var path = require('path');

exports.deleteFolder = function(dirpath) {

  if(fs.statSync(dirpath).isFile())
  	fs.unlinkSync(dirpath);
  else
  	rmFromPath(dirpath);

  function rmFromPath(path) {

    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index) {
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          rmFromPath(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }
}