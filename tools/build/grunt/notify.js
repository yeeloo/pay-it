module.exports = function (grunt, options)
{
	return {
		build: {
			options: {
				title: "Grunt",
				message: 'Build complete!'
			}
		},
		buildIos: {
			options: {
				title: "PhoneGap",
				message: 'Build iOS complete!'
			}
		},
		buildAndroid: {
			options: {
				title: "PhoneGap",
				message: 'Running Android app!'
			}
		}
	};
};