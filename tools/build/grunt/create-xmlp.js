module.exports = function( grunt, options )
{
	var config = {
		default: {
			files: [
				{
					expand: true,
					cwd: "<%= sourceDir %>",
					src: [
						'data/locale/*.xml'
					],
					dest: "<%= sourceDir %>",
					ext: '.xmlp'
				}
			]
		}
	};

	return config;
};