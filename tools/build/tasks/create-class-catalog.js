module.exports = function (grunt)
{
	grunt.registerTask('create-class-catalog', 'Create a catalog with all classes of the project.', function(n)
	{
		grunt.log.writeln('Create Class Catalog');

		var sourceDir = grunt.config('organize-imports.options.sourceDir');

		grunt.log.writeln(sourceDir);

		catalog = {};

		grunt.file.recurse(sourceDir, function (abspath, rootdir, subdir, filename)
		{
			// is TypeScript class?
			var indexOfDot = filename.indexOf(".");

			// only files with .ts extension, starting with an uppercase character
			if (filename.charAt(0) == filename.charAt(0).toUpperCase() && filename.substring(indexOfDot + 1) == "ts")
			{
				// check if 'export = classname' in the file
				var className = filename.substring(0, indexOfDot);

				var content = grunt.file.read(abspath);

				if (content.indexOf("export = " + className) == -1)
				{
					grunt.log.warn("invalid export for " + abspath);
				}
				else
				{
					if (catalog[className])
					{
						catalog[className].push(subdir + "/" + className);
					}
					else
					{
						catalog[className] = [subdir + "/" + className];
					}
				}
			}

			// write to file
			grunt.file.write(grunt.config('organize-imports.options.catalogFile'), JSON.stringify(catalog));
		});

	});
};