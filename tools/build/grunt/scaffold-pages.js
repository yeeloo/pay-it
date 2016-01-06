module.exports = function( grunt, options )
{
	return {
		options: {
			'sitemapPath': '<%= sourceDir %>inc/script/app/config/sitemap.js',
			'branchesPath': '<%= sourceDir %>inc/script/app/data/enum/Branches.ts',
			'styleCollectionFilename': '_page.scss',
			'scaffold': 'non-default', // 'all' | 'non-default'
			'directories': {
				'script': '<%= sourceDir %>inc/script/',
				'pageScript': 'app/page/',
				'style': '<%= sourceDir %>inc/style/page/',
				'html': '<%= sourceDir %>inc/template/'
			},
			'mobileDirectories': {
				'pageScript': 'mobile/page',
				'html': '<%= sourceDir %>inc/template/mobile/'
			},
			'clean': false
		},
		default: {}
	}
};