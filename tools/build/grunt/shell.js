module.exports = function (grunt, options)
{
	return {
		release: {
			command: function (platform) {
				if (process.platform === 'win32')
				{
					return 'tools\\build\\bin\\7za a -mx9 -r -tzip release/update-<%= version %>.zip ./current/*'
				}
				else
				{
					return 'cd ./current && zip -r -X ../release/update-<%= version %>.zip *';
				}
			},
			options: {
				execOptions: {
					cwd: ''
				},
				stdout: true,
				stderr: true,
				failOnError: true
			}
		},
		pgbuildIos: {
			command: function (platform) {
				return 'cd ' + grunt.config('appDir') + ' && phonegap build ios';
			},
			options: {
				execOptions: {
					cwd: ''
				},
				stdout: true,
				stderr: true,
				failOnError: true
			}
		},
		pgbuildAndroid: {
			command: function (platform) {
				return 'cd ' + grunt.config('appDir') + ' && phonegap run android';
			},
			options: {
				execOptions: {
					cwd: ''
				},
				stdout: true,
				stderr: true,
				failOnError: true
			}
		}
	};
};