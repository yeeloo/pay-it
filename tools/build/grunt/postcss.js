module.exports = function (grunt, options)
{
	/* Autoprefixer is deprecated in favor of PostCSS. We only need the Autoprefixer task from PostCSS */

	return {
		options: {
			map: false,
			processors: [
				require('autoprefixer-core')({ browsers: ['last 2 versions', 'ie >= 9'] })
			]
		},
		dist: {
			src: '<%= sourceDir %>inc/style/screen.css'
		}
	}
};