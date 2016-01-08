var gruntTextReplace = require('../tasks/replace/grunt-text-replace');

module.exports = function (grunt)
{
	grunt.registerMultiTask('replace',  'General purpose text replacement for grunt. Allows you to replace ' + 
	'text in files using strings, regexs or functions.', 
	function () { 
		gruntTextReplace.replace({ 
			src: this.data.src, 
			dest: this.data.dest, 
			overwrite: this.data.overwrite, 
			replacements: this.data.replacements 
		}); 
	});
};