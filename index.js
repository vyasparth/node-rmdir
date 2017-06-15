var fs = require("fs");
var path = require('path');

exports.deleteFolder = function(dirpath) {
	var _deleteDir = [];
	var considerDir = [];

	isDir(dirpath, function(err, is_dir) {
		if(err) {
			return err;
		} else {
			if(!is_dir) {
				return deleteFile(dirpath); // returns undefined if file is deleted.
			} else {
				isDirEmpty(dirpath, function(err, dir_content) {
					if(err) {
						return err;
					} else {
						if(!dir_content.length) {
							return deleteDir(dirpath); 
						} else {
							rmFromPath(dirpath);
						}
					}
				});
			}
		}
	});

	function rmFromPath(dirpath) {

		var file_list = currDirFiles(dirpath);
		var dir_list = currDirDirs(dirpath);

		_deleteDir.push(dirpath);
		if(file_list.length)
			delMulFiles(dirpath, file_list)
		if(dir_list.length) {

			dir_list.forEach(function(data, index) {
				dir_list[index] = (dirpath + "/" + data);
			});
			var initDir = dir_list.splice(0,1)[0];
			considerDir = considerDir.concat(dir_list);
			rmFromPath(initDir);
		} else {
			if(considerDir.length) {
				var lastDir = considerDir.pop();
				rmFromPath(lastDir);
			} else {
				delMulDirs(_deleteDir);
			}
		}
		return;
	}

	function delMulFiles(dirpath, file_list) {
		file_list.forEach(function(data) {
			deleteFile(dirpath + "/" + data);
		});
	}

	function delMulDirs(dirpaths) {
		dirpaths.reverse();
		dirpaths.forEach(function(data) {
			deleteDir(data);
		});
	}

	function isDir(dirpath,cb) {
		fs.stat(dirpath, function(err, stats){
			if(err) {
				cb(err, stats);
			} else {
				cb(null, stats.isDirectory());
			}
		});
	}

	function isDirEmpty(dirpath, cb) {
		fs.readdir(dirpath, function(err, data) {
			if(err)
				cb(err, data);
			else
				cb(null, data);
		});
	}

	function currDirFiles(dirpath) {
		return fs.readdirSync(dirpath).filter(file => fs.lstatSync(path.join(dirpath, file)).isFile());
	}

	function currDirDirs(dirpath) {
		return fs.readdirSync(dirpath).filter(file => fs.lstatSync(path.join(dirpath, file)).isDirectory());
	}

	function deleteDir(dirpath) {
		return fs.rmdirSync(dirpath);
	}

	function deleteFile(dirpath) {
		return fs.unlinkSync(dirpath);
	}
}