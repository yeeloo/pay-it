module.exports = function (grunt)
{
	setupGruntTime(grunt);

	var pkg = grunt.file.readJSON('package.json');
	var path = require('path');

	var sourceDir = 'deploy/htdocs/version/src/';
	var appDir = 'phonegap/';
	var buildDir = 'build/';
	var buildVersionDir = 'build/version/';
	var gruntDir = path.normalize(process.cwd() + '/');
	var version = pkg.appversion;
	var appName = pkg.appname;
	var exportSourceMaps = true;
	var base = '../../';

	grunt.config('version', version);
	grunt.config('sourceDir', sourceDir);
	grunt.config('base', base);

	require('load-grunt-config')(grunt, {

		//auto grunt.initConfig
		init: true,

		//data passed into config.  Can use with <%= test %>
		data: {
			sourceDir: sourceDir,
			buildDir: buildDir,
			buildVersionDir: buildVersionDir,
			gruntDir: gruntDir,
			appDir: appDir,
			version: version,
			appName: appName,
			exportSourceMaps: exportSourceMaps
		},

		// auto-loads tasks when needed, instead of by default
		jitGrunt: {
			// here you can pass options to jit-grunt (or just jitGrunt: true)
			customTasksDir: 'tasks',
			pluginsRoot: 'tools/build/node_modules',
			staticMappings: {
				availabletasks: 'grunt-available-tasks',
				scsslint: 'grunt-scss-lint'
			}
		}
	});

	// change base so tasks don't have to '../'
	grunt.file.setBase(base);
};

function setupGruntTime(grunt)
{
	if (process.argv.length > 2 && !(grunt.option('q') || grunt.option('quiet')))
	{
		require('time-grunt')(grunt);
	}
}
