require("amd-loader");

/**
 * Reads the default export from an AMD module and parses each property of that export to a scss
 * variable.
 * @param file The file to parse
 * @param callback A error-first callback. The first argument is reserved for errors, the second
 * argument is an object with the parsed scss as a string.
 */
function amdDefaultToVariables(file, callback) {
	var amdExports = require(file);
	var output = '';

	for(var i in amdExports) {
		if(amdExports.hasOwnProperty(i)) {
			var currentVar = amdExports[i];
			output += '$'+i+' : ' + parseJSVar(currentVar) + ';\n';
		}
	}

	callback(null, {
		contents : output
	});
}

/**
 * Reads a javascript variable and converts it to a scss variable. If the variable is an array or
 * an object, it will recursively parse all its entries.
 * @param value The variable to parse.
 * @returns {string} A string containing the variable as scss code.
 */
function parseJSVar(value) {
	if(Array.isArray(value)) {
		var parsedValues = value.map(function(item) {
			return parseJSVar(item);
		});
		return '( ' + parsedValues.join(',') + ' )';
	} else if(typeof value == 'object') {
		if(objectIsTSEnum(value)) {
			return '( ' +  Object.keys(value).filter(function(key) {
				return isNaN(parseInt(key,10));
			}).map(function(key) {
				return '"' + key + '"';
			}).join(', ') + ' )';
		}
		var keys = [];
		for(var i in value) {
			if(value.hasOwnProperty(i)) {
				keys.push("'" + i + "'" + ' : ' + parseJSVar(value[i]));
			}
		}
		return '( ' + keys.join(', ') + ' )';
	} else {
		if(typeof value == 'number' || typeof value == 'boolean') {
			return value;
		} else {
			return '"' + value + '"';
		}
	}
}

function objectIsTSEnum(value) {
	return Object.keys(value).filter(function(key) {
		return isNaN(parseInt(key,10));
	}).every(function(key) {
		return !isNaN(value[key]) && value[value[key]] == key;
	});
}

module.exports = function(grunt, options) {
	return [
		{
			match : /scss\-shared\/(.+\.js)$/,
			replace : grunt.config.get('sourceDir') + 'inc/script/app/data/scss-shared/$1',
			importer : amdDefaultToVariables
		}
	];
};