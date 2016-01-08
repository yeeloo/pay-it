var fs = require('fs-extra');
var lineReader = require('line-reader');
var walk = require('walk');


module.exports = function (grunt)
{
	grunt.registerMultiTask(
		'clean-build',
		'clean build dir from minified and source files',
		function ()
	{
		var options = this.options();

		// Merge task-specific and/or target-specific options with these defaults.
		var deleteOptions = {
			force: false
		};

		// remove files
		this.files.forEach(function (f)
		{
			var filepath = f.src[0];

			if (!grunt.file.exists(filepath))
			{
				return;
			}
			grunt.verbose.write('Cleaning "' + filepath + '"...');

			try {
				grunt.file.delete(filepath, deleteOptions);
				grunt.verbose.ok();
			}
			catch (e)
			{
				grunt.log.error();
				grunt.verbose.error(e);
				grunt.fail.warn('Clean operation failed.');
			}
		});

		// remove empty dirs
		var dirs = grunt.file.expand({cwd: grunt.config.data.buildDir}, options.cleanEmptyDirsIn);

		dirs.reverse().forEach(function(filepath)
		{
			filepath = grunt.config.data.buildDir + filepath;

			if (grunt.file.isDir(filepath))
			{
				if (fs.readdirSync(filepath).length == 0)
				{
					grunt.verbose.write('Cleaning "' + filepath + '"...');

					grunt.file.delete(filepath, deleteOptions);

					grunt.verbose.ok();
				}
			}
		});

		return;

		var done = this.async();


		var buildDir = grunt.config('clean-build.' + this.target + '.buildDir');
		var excludeList = grunt.config('clean-build.options.exclude');
		var removeList = grunt.config('clean-build.options.remove');

		var type = 'module';
		var modules = {};
		var currentModule;

		// read all lines:
		lineReader.eachLine(buildDir + '/build.txt', function(line)
		{
			switch(true)
			{
				case line == '':
					type = 'module';
					break;

				case line.indexOf('---') == 0:
					type = 'file';
					break;

				default:
					if (type == 'module')
					{
						currentModule = modules[line] = [];
						currentModule.push(line);
					}
					else
					{
						currentModule.push(line);
					}
					break;
			}
		}).then(function ()
			{
//				console.log('modules: ', modules);

				var checkRemove = function(result)
				{
					for (var j = 0; j < removeList.length; j++)
					{
						var removeItem = removeList[j];
						var match = removeItem.replace('*', '');

						var starPos = removeItem.indexOf('*');

						// complete match
						if (starPos == -1 && result == removeItem)
						{
							return true;
						}
						// match end
						else if (starPos == 0 && result.indexOf(match) == result.length - (match.length))
						{
							return true;
						}
						// match anywhere
						else if (starPos == removeItem.length - 1 && result.indexOf(match) != -1)
						{
							return true;
						}
					}

					return false;
				}

				getFiles(buildDir + '/', function(results)
				{
					for (var i = 0; i < results.length; ++i)
					{
						var result = results[i];

						if (excludeList.indexOf(result) != -1)
						{
							results.splice(i, 1);
							--i;
							continue;
						}

						if (checkRemove(result))
						{
							console.log('remove : ' + buildDir + result);
							fs.unlinkSync(buildDir + result)
							results.splice(i, 1);
							--i;
							continue;
						}

						switch (result.split('.').pop().toLowerCase())
						{
							case 'js':
							{
								// check for used files
								var found = false;
								for (var module in  modules)
								{
									for (j = 0; j < modules[module].length && !found; ++j)
									{
										if (result.indexOf(modules[module][j]) != -1)
										{
											if (modules[module][j] != module)
											{
												fs.unlinkSync(buildDir + result);
											}
											results.splice(i, 1);
											--i;
											found = true;
										}
									}
								}

								break;
							}

							default:
							{
								// leave
								results.splice(i, 1);
								--i;
								break;
							}
						}
					}

					console.log('');
					console.log('unused files:');
					console.log(results);

//					console.log('removing unused files: ');
//
//					for (var i = 0; i < results.length; ++i)
//					{
//						console.log('- :', results[i]);
//						fs.unlinkSync(results[i]);
//					}

//					console.log('generated modules: ');
//					for (var module in  modules)
//					{
//						console.log('- :', module);
//					}

					removeEmptyDirs(buildDir + '/');

					done();
				});
			}
		);
	});

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

	function getFiles(dir, cb)
	{
		walker = walk.walk(dir.split('').pop() == '/' ? dir.substr(0, dir.length - 1) : dir, {
			followLinks: false
			// directories with these keys will be skipped
			, filters: ["Temp", "_Temp"]
		});

		var files = [];

		walker.on("file", function (root, fileStats, next)
		{
			var name = root + '/' + fileStats.name;
			files.push(name.replace(dir, ''));
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

	function removeEmptyDirs(dir)
	{
		var list = fs.readdirSync(dir);

		if (list && list.length > 0)
		{
			for (var i = 0; i < list.length; ++i)
			{
				var file = dir + list[i];

				var stat = fs.statSync(file);

				if (stat && stat.isDirectory())
				{
					if (removeEmptyDirs(file + '/'))
					{
						fs.rmdirSync(file);
						list.splice(i, 1);
						--i;
					}
				}
			}
		}

		if (!list || list.length == 0)
		{
			return true;
		}
	}
}