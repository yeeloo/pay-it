module.exports = function (grunt, options)
{
	return {
		version: {
			src:  '<%= buildDir %>inc/script/app/Main.js',
			dest: '<%= buildDir %>inc/script/app/Main.js',

			replacements: [
				{
					from: '{_MAJOR_VERSION_}',
					to: grunt.config('version').split('.')[0]
				},
				{
					from: '{_MINOR_VERSION_}',
					to: grunt.config('version').split('.')[1]
				}
			]
		},
		uncache: {
			src:  '<%= buildDir %>index.html',
			dest: '<%= buildDir %>index.html',

			replacements: [
				{
					from: '{_VERSION_}',
					to: grunt.config('version')
				}
			]
		}
	};
};