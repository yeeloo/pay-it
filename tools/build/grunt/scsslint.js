module.exports = function (grunt, options)
{
	return {
		allFiles: [
			'<%= sourceDir %>inc/style/**/*.scss'
		],
		options: {
			bundleExec: false,
			config: '<%= gruntDir %>.scss-lint.yml',
			reporterOutput: null,
			colorizeOutput: true
		}
	};
};