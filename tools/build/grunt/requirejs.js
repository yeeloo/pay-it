module.exports = function (grunt, options)
{
	var path = require('path');
	
	var modules = [
		{
			name: "app/bundle",
			create: true,
			include: [
				"requireLib",
				"app/Bootstrap",
				"text",
				"app/config/sitemap",

				"app/page/DefaultPageController",
				"lib/gaia/assets/AbstractPageViewModel",
				"app/page/DefaultPageViewModel",

				"app/page/index/IndexPageViewModel",
				"app/page/index/IndexPageController",

				"lib/temple/component/AbstractComponentController",
				"lib/temple/component/AbstractComponentViewModel",
			]
		}
	];
	
	// find all component bundles and add them to the modules array
	// this will compile all component bundles into single files so it doesn't need additional HTTP requests for the
	// controller, viewmodel and template.
	var componentScriptDir = grunt.config().base + grunt.config().sourceDir + 'inc/script/app/component/';
	var files = grunt.file.expand({
		matchBase: true,
		cwd: componentScriptDir,
		filter: 'isFile'
	}, '**/*Bundle.js');

	for ( var i = 0; i < files.length; i++ ) {
		var file = 'app/component/' + path.dirname(files[ i ]) + '/' + path.basename(files[ i ], '.js');

		modules.push({
			name: file,
			exclude: [
				"app/Bootstrap",
				"lib/temple/component/AbstractComponentController",
				"lib/temple/component/AbstractComponentViewModel",
				"text"
			]
		});

		modules[0].include.push(file);
	}


	// enable when needed...
	if (false)
	{
		// find all html templates and add them to the modules array
		// this will compile all html templates into the main build so it doesn't need additional HTTP requests for
		// all individual files, which also solves crossdomain issues.
		var scriptDir = grunt.config().base + grunt.config().sourceDir + 'inc/script/';
		files = grunt.file.expand({
			matchBase: true,
			cwd: scriptDir,
			filter: 'isFile'
		}, ['../template/**/*.html']);


		var templates = {
			name: "app/../../template/templates",
			include: [],
			exclude: [
				"text"
			]
		};

		files.forEach(function(filePath)
		{
			templates.include.push('text!app/../' + filePath);
		});

		modules.push(templates);

		if (!modules[0].exclude)
		{
			modules[0].exclude = [];
		}

		modules[0].exclude.push('app/../../template/templates');
	}



	return {
		options: {
			appDir: '<%= sourceDir %>',
			mainConfigFile: '<%= sourceDir %>inc/script/app/Bootstrap.js',
			dir: '<%= buildVersionDir %>',
			optimizeCss: "none",
			optimize: "none",
			normalizeDirDefines: "skip",
			fileExclusionRegExp: /(^bundle.js$|^\.svn$|^\.git$|^\.gitignore$|^\.idea$|.+?\.pem$|.+?\.pub$|.+?\.map$|.+?\.map.+?|^\.DS_STORE$|.+?\.sh$|^Thumbs\.db$)/,
			modules: modules,
			removeCombined: true
		},

		release: {
			options: {
				//generateSourceMaps: true
			}
		},

		debug: {
			options: {
			}
		}

	};
};