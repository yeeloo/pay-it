/**
 * @module String
 * @author (port) Mient-jan stelling, Arjan van Wijk
 * @description Polyfill list of all the String functions javascript is going to support in the future.
 *
 * Properties:
 * - length - all
 *
 * Static Methods:
 * - fromCharCode - all
 * - fromCodePoint - es6 - done
 * - raw - es6 - MISSING
 *
 * Prototype Methods:
 * - anchor - all
 * - big - DEPRECATED
 * - blink - DEPRECATED
 * - bold - DEPRECATED
 * - charAt - all
 * - charCodeAt - all
 * - codePointAt - es6 - done
 * - concat - all
 * - endsWith - es6 - done
 * - fixed - DEPRECATED
 * - fontcolor - DEPRECATED
 * - fontsize - DEPRECATED
 * - includes - es6 - done
 * - indexOf - all
 * - italics - DEPRECATED
 * - lastIndexOf - all
 * - link - all
 * - localeCompare - IE10 - MISSING
 * - match - all
 * - normalize - es6 - MISSING
 * - quote - DEPRECATED - NON-STANDARD
 * - repeat - es6 - done
 * - replace - all
 * - search - all
 * - slice - all
 * - small - DEPRECATED
 * - split - all
 * - startsWith - es6 - done
 * - strike - DEPRECATED
 * - sub - DEPRECATED
 * - substr - all
 * - substring - all
 * - sup - DEPRECATED
 * - toLocaleLowerCase - all
 * - toLocaleUpperCase - all
 * - toLowerCase - all
 * - toSource - MISSING - NON-STANDARD
 * - toString - all
 * - toUpperCase -  all
 * - trim - ie8 - done
 * - trimLeft - NON-STANDARD - done
 * - trimRight - NON-STANDARD - done
 * - valueOf - all
 * - [@@iterator] - es6 - MISSING
 */



/*!
 * @name fromCodePoint
 * http://mths.be/fromcodepoint v0.1.0 by @mathias
 */
if (!String.fromCodePoint)
{
	(function() {
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var stringFromCharCode = String.fromCharCode;
		var floor = Math.floor;
		var fromCodePoint = function() {
			var MAX_SIZE = 0x4000;
			var codeUnits = [];
			var highSurrogate;
			var lowSurrogate;
			var index = -1;
			var length = arguments.length;
			if (!length) {
				return '';
			}
			var result = '';
			while (++index < length) {
				var codePoint = Number(arguments[index]);
				if (
					!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
					codePoint < 0 || // not a valid Unicode code point
					codePoint > 0x10FFFF || // not a valid Unicode code point
					floor(codePoint) != codePoint // not an integer
				) {
					throw RangeError('Invalid code point: ' + codePoint);
				}
				if (codePoint <= 0xFFFF) { // BMP code point
					codeUnits.push(codePoint);
				} else { // Astral code point; split in surrogate halves
					// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					codePoint -= 0x10000;
					highSurrogate = (codePoint >> 10) + 0xD800;
					lowSurrogate = (codePoint % 0x400) + 0xDC00;
					codeUnits.push(highSurrogate, lowSurrogate);
				}
				if (index + 1 == length || codeUnits.length > MAX_SIZE) {
					result += stringFromCharCode.apply(null, codeUnits);
					codeUnits.length = 0;
				}
			}
			return result;
		};
		if (defineProperty) {
			defineProperty(String, 'fromCodePoint', {
				'value': fromCodePoint,
				'configurable': true,
				'writable': true
			});
		} else {
			String.fromCodePoint = fromCodePoint;
		}
	}());
}

/*!
 * @name codePointAt
 * http://mths.be/codepointat v0.1.0 by @mathias
 * */
if (!String.prototype.codePointAt)
{
	(function() {
		'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
		var codePointAt = function(position) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			var size = string.length;
			// `ToInteger`
			var index = position ? Number(position) : 0;
			if (index != index) { // better `isNaN`
				index = 0;
			}
			// Account for out-of-bounds indices:
			if (index < 0 || index >= size) {
				return undefined;
			}
			// Get the first code unit
			var first = string.charCodeAt(index);
			var second;
			if ( // check if it’s the start of a surrogate pair
			first >= 0xD800 && first <= 0xDBFF && // high surrogate
			size > index + 1 // there is a next code unit
			) {
				second = string.charCodeAt(index + 1);
				if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
					// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
				}
			}
			return first;
		};
		if (Object.defineProperty) {
			Object.defineProperty(String.prototype, 'codePointAt', {
				'value': codePointAt,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.codePointAt = codePointAt;
		}
	}());
}

/*!
 * @name endsWidth
 * http://mths.be/endswith v0.2.0 by @mathias
 * */
if (!String.prototype.endsWith)
{
	(function() {
		'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var toString = {}.toString;
		var endsWith = function(search) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			if (search && toString.call(search) == '[object RegExp]') {
				throw TypeError();
			}
			var stringLength = string.length;
			var searchString = String(search);
			var searchLength = searchString.length;
			var pos = stringLength;
			if (arguments.length > 1) {
				var position = arguments[1];
				if (position !== undefined) {
					// `ToInteger`
					pos = position ? Number(position) : 0;
					if (pos != pos) { // better `isNaN`
						pos = 0;
					}
				}
			}
			var end = Math.min(Math.max(pos, 0), stringLength);
			var start = end - searchLength;
			if (start < 0) {
				return false;
			}
			var index = -1;
			while (++index < searchLength) {
				if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
					return false;
				}
			}
			return true;
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'endsWith', {
				'value': endsWith,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.endsWith = endsWith;
		}
	}());
}

/**
 * @name includes
 */
if (!String.prototype.includes)
{
	String.prototype.includes = function() {'use strict';
		return String.prototype.indexOf.apply(this, arguments) !== -1;
	};
}



/*!
 * @name repeat
 * http://mths.be/repeat v0.2.0 by @mathias
 */
if (!String.prototype.repeat)
{
	(function() {
		'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var repeat = function(count) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			// `ToInteger`
			var n = count ? Number(count) : 0;
			if (n != n) { // better `isNaN`
				n = 0;
			}
			// Account for out-of-bounds indices
			if (n < 0 || n == Infinity) {
				throw RangeError();
			}
			var result = '';
			while (n) {
				if (n % 2 == 1) {
					result += string;
				}
				if (n > 1) {
					string += string;
				}
				n >>= 1;
			}
			return result;
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'repeat', {
				'value': repeat,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.repeat = repeat;
		}
	}());
}

/*!
 * @name startsWith
 * http://mths.be/startswith v0.2.0 by @mathias
 */
if (!String.prototype.startsWith)
{
	(function() {
		'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var toString = {}.toString;
		var startsWith = function(search) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			if (search && toString.call(search) == '[object RegExp]') {
				throw TypeError();
			}
			var stringLength = string.length;
			var searchString = String(search);
			var searchLength = searchString.length;
			var position = arguments.length > 1 ? arguments[1] : undefined;
			// `ToInteger`
			var pos = position ? Number(position) : 0;
			if (pos != pos) { // better `isNaN`
				pos = 0;
			}
			var start = Math.min(Math.max(pos, 0), stringLength);
			// Avoid the `indexOf` call if no match is possible
			if (searchLength + start > stringLength) {
				return false;
			}
			var index = -1;
			while (++index < searchLength) {
				if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
					return false;
				}
			}
			return true;
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'startsWith', {
				'value': startsWith,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.startsWith = startsWith;
		}
	}());
}


/**
 * @name trimLeft
 */
if(!String.prototype.trimLeft)
{
	String.prototype.trimLeft = function()
	{
		return String(this).replace(/^\s+/g, '');
	}
}

/**
 * @name trimRight
 */
if(!String.prototype.trimRight)
{
	String.prototype.trimRight = function()
	{
		return String(this).replace(/\s+$/g, '');
	}
}
