module.exports = function (grunt, options)
{
	return {
		'default': {
			'options' : {
				'sourceDir': '<%= buildDir %>'
			}
		},
		'current': {
			'options' : {
				'sourceDir': 'current/'
			}
		},
		'plugins': {
			'options' : {
				'sourceDir': 'phonegap/platforms/android/assets/www/plugins'
			}
		}
	};
};