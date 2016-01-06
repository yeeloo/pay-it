var importers = require("../sass/importers");
var path = require('path');

module.exports = function (grunt, options)
{
	var importersConfig = importers(grunt, options);
	var importerFunctions = [];

	importersConfig.forEach(function(config) {
		importerFunctions.push(function(url, prev, done) {
			var matches = config.match.test(url);
			if(matches) {
				var filePath = config.replace ? url.replace(config.match, config.replace) : url;
				var absFilePath = path.join(process.cwd(), filePath);
				config.importer(absFilePath, function(error, result) {
					if(error) {
						done(new Error(error));
					} else {
						done(result);
					}
				});
			} else {
				done(this.NULL);
			}
		});
	});

	return {
		options: {
			sourcemap: false,
			importer : importerFunctions
			//outputStyle: 'compressed'
		},
		dist: {
			files: [
				{
					expand: true,
					cwd: '<%= sourceDir %>inc/style',
					src: ['*.scss'],
					dest: '<%= sourceDir %>inc/style',
					ext: '.css'
				}
			]
		}

	};
};