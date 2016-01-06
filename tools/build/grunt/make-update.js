module.exports = function (grunt, options)
{
	return {
		'default': {
			'options' : {
				'releaseDir': 'release/',
				'wwwDir': '<%= buildDir %>',

				'exclude': [
					'inc/script/lib/sockjs/sockjs-0.3.js',
					'inc/script/lib/sockjs/sockjs-0.3.min.js',
					'inc/script/lib/gaia/api/Gaia.js',
					'inc/script/lib/gaia/flow/FlowManager.js',
					'inc/script/lib/gaia/core/BranchTools.js',
					'inc/script/lib/history/history.js',
					'inc/script/lib/jquery/jquery.js',
					'inc/script/lib/knockout/knockout.js',
					'inc/script/lib/mootools/mootools.utils.js',
					'inc/script/lib/temple/utils/MobileDetect.js',
					'inc/script/lib/temple/utils/Request.js',
					'inc/script/lib/temple/utils/types/DateUtils.js',
					'facebook-js-sdk.js',
					'config.xml',
					'cordova.js'
				]
			}
		}
	};
};