module.exports = function (grunt, options)
{
	return {
		options: {
			ext: '.png',
			force: true
		},
		default: {
			files: [
				{
					expand: true, // required option
					src: ['inc/style/**/*.css'],
					cwd: '<%= buildVersionDir %>',
					dest: '<%= buildVersionDir %>'
				}
			]
		}
	};
};