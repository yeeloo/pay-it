module.exports = function (grunt)
{
	grunt.registerTask('organize-imports', 'Organizes the imports of a TypeScript file', function(n)
	{
		grunt.log.writeln('Organize imports');

		var file = grunt.option('file');
		var sourceDir = grunt.config('organize-imports.options.sourceDir');

		if (!file)
		{
			grunt.log.error("No file specified");
			return;
		}

		grunt.log.writeln('file: ' + file);
		grunt.log.writeln('sourceDir: ' + sourceDir);

		// is file a directory?
		if (grunt.file.isDir(file))
		{
			grunt.file.recurse(file, function callback(abspath, rootdir, subdir, filename)
			{
				abspath = abspath.replace(/\//g, "\\");

				organizeImportsInFile(abspath, sourceDir);
			});
		}
		else
		{
			organizeImportsInFile(file, sourceDir)
		}
	});

	function organizeImportsInFile(file, sourceDir)
	{
		var dotIndex = file.lastIndexOf(".");

		if(file.substring(dotIndex + 1) == "ts")
		{
			var currentClass = file.substring(file.lastIndexOf("\\") + 1, dotIndex);
			// for Mac
			currentClass = currentClass.substring(currentClass.lastIndexOf("/"));

			grunt.log.writeln('currentClass: ' + currentClass);

			var path = file.replace(/\\/g, "/");
			path = path.substring(path.indexOf(sourceDir) + sourceDir.length);
			path = path.substring(0, path.lastIndexOf("/") + 1);

			grunt.log.writeln('path: ' + path);

			var content = grunt.file.read(file);

			var imports = "import refdef = require('def/ReferenceDefinitions');\n";

			// get current imports
			var currentImports = {};
			var regExp = /^import\s+(\w+)\s*=\s*require\(['"]([\w/.]+)['"]\);*$/gm;
			var result;
			while ((result = regExp.exec(content)) !== null)
			{
				// leave all lowercase imports, except for the refdef, since we always import this
				if (result[1] != "refdef" && result[1].charAt(0) == result[1].charAt(0).toLowerCase())
				{
					imports += result[0] + "\n";
				}
				else
				{
					currentImports[result[1]] = result[2];
				}
			}

			// remove current imports
			content = content.replace(/^import.+[\n\r]+/gm, "");

			// find all classes
			// get only the code, so remove comments and strings
			var code = content.replace(/(\/\*)[\s\S]*?(\*\/)/gm, '').replace(/(\/\/).+/gm, "").replace(/('.+')|(".+")/g, "");


			var classes = [];
			var regExp = /([\s:<>\(\[\!])([A-Z]\w+)/gm;
			var result;
			while ((result = regExp.exec(code)) !== null)
			{
				var className = result[2];
				if (classes.indexOf(className) == -1)
				{
					classes.push(className);
				}
			}
			//grunt.log.writeln(classes);

			// get catalog
			var custom = grunt.file.readJSON(grunt.config('organize-imports.options.customCatalogFile'));

			// get ignore list
			var ignore = grunt.file.readJSON(grunt.config('organize-imports.options.ignoreFile'));

			//grunt.log.writeln('ignore: ' + ignore);

			var catalog = grunt.file.readJSON(grunt.config('organize-imports.options.catalogFile'));

			for (var i = 0; i < classes.length; i++)
			{
				var className = classes[i];

				if (ignore.indexOf(className) != -1)
				{
					// ignore this class
					//console.log("ignore class '" + className + "'");
				}
				else if (className != currentClass)
				{
					if (custom[className])
					{
						imports += "import " + className + " = require('" + custom[className] + "');\n";
					}
					else if (catalog[className])
					{
						if (catalog[className].length > 1)
						{
							// found multiple classes with this name, check current imports
							if (currentImports[className])
							{
								// found, use current
								imports += "import " + className + " = require('" + currentImports[className] + "');\n";
							}
							else
							{
								// put all in
								imports += "// ambiguous imports\n";
								for (var j = 0; j < catalog[className].length; j++)
								{
									imports += "import " + className + " = require('" + catalog[className][j] + "');\n";
								}
							}
						}
						else
						{
							imports += "import " + className + " = require('" + (matchPaths(currentImports[className], catalog[className][0], path) || makeRelative(catalog[className][0], path)) + "');\n";
						}

					}
					else
					{
						grunt.log.warn("Class '" + className + "' not found");
					}
				}
			}
			imports += "\n";

			//grunt.log.writeln(imports + content);

			grunt.file.write(file, imports + content)
		}
		else
		{
			grunt.log.error("No TypeScript file: '" + file + "'");
			return;
		}
	}


	function matchPaths(current, className, path)
	{
		if (!current) return null;

		// if current is the same class as className, use current
		if (current == className)
		{
			return current;
		}
		// if it's relative, let resolve the absolute path and compaire again
		var currents = current.split("/");
		var paths = path.split("/");

		while (currents[0] == "." || currents[0] == "..")
		{
			if (currents.shift() == "..")
			{
				paths.pop();
			}
		}
		//console.log("-------------------");
		//console.log("current " + current);
		//console.log("className " + className);
		//console.log("path " + path);
		//console.log("currents " + currents);
		//console.log("matchPaths " + paths.join('/') + currents.join('/'));

		if (paths.join('/') + currents.join('/') == className)
		{
			//console.log('relative: ' + current + " resolves to absolute path " + className);
			return current;
		}
		// no match, return null

		return null;
	}

	function makeRelative(className, path)
	{
		var classNames = className.split("/");
		var paths = path.split("/");

		//grunt.log.writeln('makeRelative');
		//grunt.log.writeln(className);
		//grunt.log.writeln(path);

		while(classNames[0] == paths[0])
		{
			classNames.shift();
			paths.shift();
		}

		relativeClassName = classNames.join('/');

		if (classNames.length > 3 || paths.length > 2)
		{
			return className;
		}

		if (paths.length > 1)
		{
			for (var i = 1, leni = paths.length; i < leni; i++)
			{
				relativeClassName = "../" + relativeClassName;
			}
		}

		if (relativeClassName.substring(0, 3) != "../")
		{
			relativeClassName = "./" + relativeClassName;
		}

		//grunt.log.writeln(classNames);
		//grunt.log.writeln(paths);

		return relativeClassName;
	}
};