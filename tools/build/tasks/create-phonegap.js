module.exports = function (grunt) {

	//Depends on: ruby, thor (gem), rb-appscript(gem), xcs (https://github.com/gonzoua/xcs), phonegap
	//Grunt: load-grunt-tasks

	var exec = require('child_process').exec;

	grunt.registerMultiTask('create-phonegap', 'create a PhoneGap project on a Mac.', function () {
		var done = this.async();
		var appDir = grunt.config('appDir');
		var appBundle = grunt.config('appBundle');
		var appName = grunt.config('appName');

		createProject(appDir, appBundle, appName, done);
	});

	function createProject(dir, appBundle, appName, done)
	{
		var options = {
				stdout: true,
				stderr: true,
				stdin: true,
				failOnError: true,
				stdinRawMode: false
			};

		var cmd = 'phonegap create ' + dir + ' ' + appBundle + ' ' + appName;

		var cp = exec(cmd, options, function (err, stdout, stderr) {
			if (err && options.failOnError) {
				grunt.warn(err);
			}
			else
			{
				grunt.log.writeln('PhoneGap project creation done.');
				grunt.log.writeln(dir);
				//Config.xml lives outside the www folder since PhoneGap 3.6
				/*grunt.file.copy(dir + 'www/config.xml', projectDir+'config.xml');*/
				done();
			}
		});
	}
}