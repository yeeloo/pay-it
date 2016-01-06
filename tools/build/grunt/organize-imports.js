module.exports = function (grunt, options)
{
	return {
		options: {
			'sourceDir': '<%= sourceDir %>inc/script/',
			'catalogFile': 'tools/build/tasks/organize-imports/catalog.json',
			'customCatalogFile': 'tools/build/tasks/organize-imports/custom-catalog.json',
			'ignoreFile': 'tools/build/tasks/organize-imports/ignore.json'
		},
		default: {
		}
	};
};