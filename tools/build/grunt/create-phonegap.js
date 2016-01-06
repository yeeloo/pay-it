module.exports = function (grunt, options)
{
	return {
		'default': {
			'options': {
				'projectDir': '<%= sourceDir %>',
				'appDir': '<%= appDir %>'
			}
		}
	};
};