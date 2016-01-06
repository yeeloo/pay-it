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
					src: ['**/*.png'],
					cwd: '<%= sourceDir %>',
					dest: '<%= buildVersionDir %>'
				}
			]
		}
	};
};