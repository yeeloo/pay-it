module.exports = function (grunt, options)
{
	return {
		compile: {
			name: 'MediaMonks - Skeleton',
			description: 'documentation',
			version: 1,
			url: 'http://www.mediamonks.com',
			options: {
				quiet: true,
				linkNatives: true,
//				attributesEmit: true,
//				markdown: true,

				paths: '<%= sourceDir %>../../',
				outdir: 'docs/',
				themedir: 'tools/docs/mediamonks-bootstrap-theme',
				helpers: [ "tools/docs/mediamonks-bootstrap-theme/helpers/helpers.js" ],
				extension: ".ts",
				tabtospace: 1
			}
		}
	};
};