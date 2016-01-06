/**
 * @module Number
 * @author Mient-jan stelling, Arjan van Wijk
 *
 * Properties -> Not supported by internet explorer and safari
 * - Number.EPSILON - es6 - done
 * - Number.MAX_SAFE_INTEGER - es6 - done
 * - Number.MIN_SAFE_INTEGER - es6 - done
 *
 *  Properties -> Supported by all browsers
 * - Number.MAX_VALUE - all
 * - Number.MIN_VALUE - all
 * - Number.NEGATIVE_INFINITY - all
 * - Number.NaN - all
 * - Number.POSITIVE_INFINITY - all
 * - Number.prototype - all
 *
 *  Methods
 * - Number.isFinite() - es6 - done
 * - Number.isInteger() - es6 - done
 * - Number.isNaN() - es6 - done
 * - Number.isSafeInteger() - es6 - done
 * - Number.parseFloat() - es6 - done
 * - Number.parseInt() - es6 - done
 * - Number.prototype.toExponential() - all
 * - Number.prototype.toFixed() - all
 * - Number.prototype.toLocaleString() - all
 * - Number.prototype.toPrecision() - all
 * - Number.prototype.toSource() - MISSING - NON-STANDARDS
 * - Number.prototype.toString() - all
 * - Number.prototype.valueOf() - all
 * - Number.toInteger() - REMOVED - NON-STANDARDS
 */


if (!Number.EPSILON)
{
	Number.EPSILON = 2.2204460492503130808472633361816E-16;
}
if (!Number.MAX_SAFE_INTEGER)
{
	Number.MAX_SAFE_INTEGER = 9007199254740991;
}
if (!Number.MIN_SAFE_INTEGER)
{
	Number.MIN_SAFE_INTEGER = 9007199254740991;
}

/**
 * @name Number.isFinite
 * @see http://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isfinite
 */
if( typeof Number.isFinite !== 'function' )
{
	if (typeof Number.isFinite !== 'function') {
		Number.isFinite = function isFinite(value) {
			// 1. If Type(number) is not Number, return false.
			if (typeof value !== 'number') {
				return false;
			}
			// 2. If number is NaN, +∞, or −∞, return false.
			if (value !== value || value === Infinity || value === -Infinity) {
				return false;
			}
			// 3. Otherwise, return true.
			return true;
		};
	}
}

/**
 * @name Number.isInteger()
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 */
if( !Number.isInteger )
{
	Number.isInteger = function isInteger( nVal )
	{
		return typeof nVal === 'number'
			&& isFinite( nVal )
			&& nVal > -9007199254740992
			&& nVal < 9007199254740992
			&& Math.floor( nVal ) === nVal;
	};
}

// Polyfill for Number.isNaN
if( !Number.isNaN )
{
	Number.isNaN = function(value){
		return typeof value === 'number' && value !== value;
	}
}

if( !Number.isSafeInteger ){
	Number.isSafeInteger = function(value){
		return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
	}
}

if( !Number.parseFloat ){
	Number.parseFloat = window.parseFloat;
}

if( !Number.parseInt ){
	Number.parseInt = window.parseInt;
}