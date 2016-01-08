module.exports = function (grunt)
{
	grunt.registerMultiTask(
		'strip-imported-css',
		'Strips the css that is generaged from imported css files',
		function ()
		{
			var findClasses = /^\.[^(){\s]+\s?\{/gm;
			var findClassBody = new Regexp('^\\.' + 'hide' + '\\s?\\{[^}]+}', 'gm');
		}
	);
};