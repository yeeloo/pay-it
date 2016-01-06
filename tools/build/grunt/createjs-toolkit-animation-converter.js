module.exports = function (grunt, options)
{
	return {
		options: {
			sourceDir: '<%= sourceDir %>',
			sourceAssets: 'asset/createjs-animation/**/*.js',
			images: '<%= sourceDir %>inc/image/createjs-animation',
			sound: '<%= sourceDir %>inc/audio/createjs-animation',
			script: '<%= sourceDir %>inc/script/app/asset/createjs-animation'
		}
	};
};