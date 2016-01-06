module.exports = function (grunt, options)
{
	return {
		// copy files to builddir that need processing by grunt (and should be copied back by the deploytool or uploaded manually)
		'versioning': {
			nonull: true,
			src:  'deploy/htdocs/index.php',
			dest: '<%= buildDir %>'
		},

		'phonegap-index': {
			nonull: true,
			src:  'asset/phonegap/index.html',
			dest: '<%= buildDir %>index.html'
		}
	};
};