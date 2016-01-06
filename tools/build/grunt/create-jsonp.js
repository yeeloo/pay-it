module.exports = function( grunt, options )
{
	var config = {
		default: {
			files: [
				{
					expand: true,
					cwd: "<%= sourceDir %>",
					src: [
						'data/locale/*.json'
					],
					dest: "<%= sourceDir %>",
					ext: '.jsonp'
				}
			]
		}
	};

	return config;
};