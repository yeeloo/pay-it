/**
 * Cleans the build directory from combined javascript files (based on the build.txt outputted by r.js)
 */
module.exports = function (grunt, options)
{
	var config = {
		default: {
			files: [
				{
			        expand: true,
			        cwd: '<%= buildDir %>',
			        src: [
				        '**/*.ts',
				        '**/*.less',
				        '**/*.scss',
				        '**/*.scss.map',
				        '**/Definitions.js',
				        '**/karma.conf.js',
				        '**/karma.teamcity.conf',
				        '**/karma-start.bat',

						'inc/script/app/component/**/*.html',
						'inc/script/app/component/**/*Options.js',
						
				        'inc/script/test',
				        'inc/script/doc',

				        '!inc/script/lib/modernizr.js',
				        '!inc/script/lib/require/require.js',
				        '!inc/script/app/config/requirejs.config.js',
				        '!inc/script/lib/require/text.js'
			        ],
			        dest: '<%= buildVersionDir %>'
		        }
			],
			options: {
				cleanEmptyDirsIn: [
					'version/inc/**/*'
				]
			}
		}
	};

	if (!options.exportSourceMaps)
	{
		config['default'].files[0].src.push('**/*.js.map')
	}

	return config;
};