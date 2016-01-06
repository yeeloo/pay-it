module.exports = function( grunt, options )
{
	return {
		install: {
			options: {
				command: 'reinstall',
				config: 'tools/build/tsd.json'
			}
		}
	};
};