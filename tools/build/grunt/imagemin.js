module.exports = function (grunt, options)
{
	return {
		options: {
			optimizationLevel: 7
		},
		default: {
			files: [
				{
					src: ['**/*.{jpg,gif}'],
					cwd: '<%= sourceDir %>',
					dest: '<%= buildVersionDir %>',
					expand: true
				}
			]
		}
	};
};