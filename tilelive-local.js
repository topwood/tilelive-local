var fs = require("fs");
var path = require("path");
var tiletype = require("tiletype");

function Local(uri, callback) {
	this.pathname = uri.pathname;
	this.hostname = uri.hostname;
	callback(null, this);
	//return undefined;
}

Local.registerProtocols = function(tilelive) {
	tilelive.protocols['local:'] = Local;
};

Local.list = function(filepath, callback) {
	var result = {};
	filepath = path.resolve(filepath);
	fs.readdir(filepath, function(err, files) {
		files.forEach(function(file) {
			result[file] = "local://" + filepath + "\\" + file;
		});
		return callback(null, result);
	})
}

Local.prototype.getTile = function(z, x, y, callback) {

	var filepath = this.hostname + ":" + this.pathname + "/" + z + "/" + x + "/" + y + ".png";
	filepath = path.resolve(filepath);
	fs.readFile(filepath, function(err, file) {
		if (err) {
			console.log(err);
			return callback(err);
		}
		return callback(null, file, {
			'Content-Type': 'img/png'
		});
	})

};

Local.prototype.getInfo = function(callback) {

	var metapath = this.hostname + ":" + this.pathname + "/meta.json";
	metapath = path.resolve(metapath);
	try{
		var meta = require(metapath);//直接require元数据文件
		callback(null, meta);
	}catch(e){
		callback(e);
	}
	
}

module.exports = Local;