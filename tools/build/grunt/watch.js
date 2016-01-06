module.exports = function (grunt, options)
{
	return {
		scripts: {
			files: ['**/*.scss'],
			tasks: ['sass'],
			options: {
				interval: 10,
				spawn: false
			}
		}
	};
};