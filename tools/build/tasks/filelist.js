module.exports = function (grunt) {

	var fs = require('fs-extra');
	var walk = require('walk');
	var AdmZip = require('adm-zip');
//	var NodeZip = require('node-zip');

	grunt.registerMultiTask('filelist', 'create filelist.txt for android first launch', function () {

		var done = this.async();

		var sourceDirAndroid = grunt.config(this.name + '.' + this.target + '.options.sourceDir');

		getFiles(sourceDirAndroid, {}, function(files)
		{
			console.log(files);
			if(sourceDirAndroid.indexOf("android/assets/www/plugins") > -1)
			{
				files.push('cordova.js');
				files.push('cordova_plugins.js');
			}

			grunt.file.write(sourceDirAndroid + 'filelist.txt', files.join("\r\n"));

			done();
		});
	});

	function getFiles(dir, options, cb)
	{
		options = options || {allContent: false};

		var walkDir = dir.split('').pop() == '/' ? dir.substr(0, dir.length - 1) : dir;

		walker = walk.walk(walkDir, {
			followLinks: false
			// directories with these keys will be skipped
			, filters: ["Temp", "_Temp", '.svn']
		});

		var files = [];

		walker.on("file", function (root, fileStats, next)
		{
//			console.log(fileStats.name, fileStats.name.indexOf('.idea'));

			var name = (root + '/' + fileStats.name).substr(dir.length);

			if(root.indexOf("android/assets/www/plugins") > -1)
			{
				name = 'plugins' + name;
			}

			if (
				name.indexOf('.svn') != -1 ||
				name.indexOf('.idea') != -1
			)
			{
				next();
				return;
			}

			console.log('file ', name);

			files.push(name);

			next();
		});

		walker.on("errors", function (root, nodeStatsArray, next)
		{
			next();
		});

		walker.on("end", function ()
		{
			cb(files);
		});
	}
}