module.exports = function (grunt) {

	var fs = require('fs-extra');
	var walk = require('walk');
	var AdmZip = require('adm-zip');

	grunt.registerMultiTask('make-update', 'Create update zip', function () {

		var done = this.async();

		var version = grunt.config('version');

		var major = version.split('.')[0];
		var minor = version.split('.')[1];

		var releaseDir = grunt.config('make-update.' + this.target + '.options.releaseDir');
		var releaseDirVersion = releaseDir + version + '/';
		var buildDir = grunt.config('make-update.' + this.target + '.options.buildDir');
		var buildFiles = grunt.config('make-update.' + this.target + '.options.buildFiles');
		var exclude = grunt.config('make-update.' + this.target + '.options.exclude');

		var wwwDir = grunt.config('make-update.' + this.target + '.options.wwwDir');
		var target = this.target;
		// create version dir
		fs.mkdirsSync(releaseDirVersion);

		var doAll = function()
		{
			var onZipDone = function()
			{
				console.log('zip android');
				console.log(target);

				if (target == "android")
				{
					console.log('Zip done Android');

					grunt.task.run('shell:zipAndroid');
				}

				deleteFolderRecursive('previous');
//				deleteFolderRecursive('current');

				done();
			}

			// if we have a major release
			// do full package, no diff checking
			if (minor == 0)
			{
				console.log('Major');
				var copyFiles = function(files, cb)
				{
					var copyFile = function()
					{
						if (files.length > 0)
						{
							var file = files.pop();

							var fileData = grunt.file.read(wwwDir + file);
							if (fileData.indexOf('{_version_}') != -1)
							{
								console.log('Writing verion ' + version + ' in ' + wwwDir + file);
								fileData = fileData.replace('{_version_}', version);

								grunt.file.write(wwwDir + file, fileData);
							}

							fs.createFileSync('current/' + file);
							fs.copy(wwwDir + file, 'current/' + file, function()
							{
								copyFile();
							});
						}
						else
						{
							cb();
						}
					}

					copyFile();
				}

				getFiles(wwwDir, null, function(wwwFiles)
				{
					var files = [];
					for (var i in wwwFiles)
					{
						if (exclude.indexOf(i) != -1)
						{
							continue;
						}
						files.push(i);
					}
					copyFiles(files, function()
					{
						onZipDone();
					});
				});

			}
			// we have a minor, find the major and do diff from there
			else
			{
				console.log('Minor');

				var lastMajorVersion = major + '.' + (minor - 1);

				// clear old folders
				deleteFolderRecursive('previous');
				deleteFolderRecursive('current');

				console.log('previous zip ', 'release/update-' + lastMajorVersion + '.zip');
				// extract last major

				for (var i = 0; i < minor; i++) {
					var zip = 'release/update-' + major + '.' + i + '.zip';
					console.log('Extracting ' + zip + ' to previous/');
					if (fs.existsSync(zip)) {
						var zip = new AdmZip(zip);
						zip.extractAllTo('previous/', true);
					} else {
						console.error('Zip does not exist!');
					}
				}

				console.log(exclude);

				getFiles(wwwDir, null, function(newFiles)
				{
					getFiles("previous/", null, function(oldFiles)
					{
						var updates = [];

						for (var name in newFiles)
						{
							if (exclude.indexOf(name) != -1)
							{
								continue;
							}

							var nFile = newFiles[name];
							var oFile = oldFiles[name];
							if (!oFile)
							{
								console.log(' - new :\t\t\t' + name);
								updates.push(name);
							}
							else
							{
								// no content, check on filesize
								if (!nFile.content)
								{
									if (nFile.stats.size != oFile.stats.size)
									{
										console.log(' - changed size:\t\t' + name);
										updates.push(name);
									}
								}
								// we have content
								else
								{
									if (nFile.content != oFile.content)
									{
										console.log(' - changed content:\t\t' + name);
										updates.push(name);
									}
								}
							}
						}

						if (!fs.existsSync('current'))
						{
							fs.mkdirSync('current');
						}

						var copyFiles = function(files, cb)
						{
							var copyFile = function()
							{
								if (files.length > 0)
								{
									var file = files.pop();
									if (!fs.existsSync('current/' + file))
									{
										fs.createFileSync('current/' + file);
									}
									fs.copy(wwwDir + file, 'current/' + file, function()
									{
										copyFile();
									});
								}
								else
								{
									cb();
								}
							}

							copyFile();
						}

						copyFiles(updates, function()
						{
							setTimeout(function()
							{
								onZipDone();
							}, 500);
						});
					})
				});
			}
		}

		doAll();
	});

	function getFiles(dir, options, cb)
	{
		options = options || {allContent: false};
		walker = walk.walk(dir.split('').pop() == '/' ? dir.substr(0, dir.length - 1) : dir, {
			followLinks: false
			// directories with these keys will be skipped
			, filters: ["Temp", "_Temp"]
		});

		var files = {};

		walker.on("file", function (root, fileStats, next)
		{
			var name = root + '/' + fileStats.name;

			if (options.allContent)
			{
//				switch (name.split('.').pop())
//				{
//					case 'txt':
//					case 'js':
//					case 'ts':
//					case 'css':
//					case 'html':
//					case 'less':
//					{
				fs.readFile(name, {encoding: 'utf-8'}, function (err, data)
				{
					files[name.replace(dir, '')] = {
						'stats': fileStats,
						'content': data
					};
					// doStuff
					next();
				});

//						break;
//					}
//					default:
//					{
//						fs.readFile(name, {}, function (err, data)
//						{
//							files[name.replace(dir, '')] = {
//								'stats': fileStats,
//								'content': data
//							};
//							// doStuff
//							next();
//						});
//
//						break;
//					}
//				}
			}
			else
			{
				switch (name.split('.').pop())
				{
					case 'txt':
					case 'js':
					case 'map':
					case 'ts':
					case 'css':
					case 'html':
					case 'less':
					{
						fs.readFile(name, {encoding: 'utf-8'}, function (err, data)
						{
							files[name.replace(dir, '')] = {
								'stats': fileStats,
								'content': data
							};
							// doStuff
							next();
						});
						break;
					}
					default:
					{
						files[name.replace(dir, '')] = {
							'stats': fileStats,
							'content': null
						};
						next();
					}
				}
			}
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

	function deleteFolderRecursive(path)
	{
		if (fs.existsSync(path))
		{
			fs.readdirSync(path).forEach(function (file, index)
			{
				var curPath = path + "/" + file;
				if (fs.statSync(curPath).isDirectory())
				{
					deleteFolderRecursive(curPath);
				}
				else
				{ // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	}
}