if (typeof console === 'undefined')
{
	window['console'] = {
		/**
		 * @param {...*} message
		 */
		log: function(message){},
		/**
		 * @param {...*} message
		 */
		debug: function(message){},
		/**
		 * @param {...*} message
		 */
		warn: function(message){},
		/**
		 * @param {...*} message
		 */
		error: function(message){},
		/**
		 * @param {...*} message
		 */
		info: function(message){}
	}
}

define([
	"require",
	"exports",

	//'lib/polyfills/polyfill.ie8',

	'lib/polyfills/polyfill.array',
	'lib/polyfills/polyfill.base64',
	'lib/polyfills/polyfill.date',
	'lib/polyfills/polyfill.function',
	'lib/polyfills/polyfill.number',
	'lib/polyfills/polyfill.object',
	'lib/polyfills/polyfill.string'

	//'lib/polyfills/polyfill.requestAnimationFrame'
], function(require, exports)
{
	exports.default = {};
});