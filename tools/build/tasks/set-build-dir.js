module.exports = function (grunt) {
	grunt.registerTask('set-build-dir', 'Set the build dir', function (dir) {
		grunt.config('buildDir', dir);
	});
}