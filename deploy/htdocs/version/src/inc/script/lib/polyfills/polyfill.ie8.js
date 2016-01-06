
/**
 * Polyfill list of all the String functions javascript is going to support in the future.
 *
 * Prototype Methods:
 * - trim - ie8 - done
 *
 * @module String
 * @author (port) Mient-jan stelling, Arjan van Wijk
 */

/**
 * @name trim
 * ie9+, safari5+
 */
if(!String.prototype.trim)
{
	String.prototype.trim = function()
	{
		return String(this).replace(/^\s+|\s+$/g, '');
	}
}


/**
 * @module {Array}
 * @author (port) Mient-jan stelling, Arjan van Wijk
 * @description Polyfill list of all the Array functions javascript is going to support in the future.
 *
 * Static Methods:
 * - isArray - ie8 - done
 *
 * Prototype Methods:
 * - every - ie8 - done
 * - filter - ie8 - done
 * - forEach - ie8 - done
 * - indexOf - ie8 - done
 * - lastIndexOf - ie8 - done
 * - map - ie8 - done
 * - reduce - ie8 - done
 * - reduceRight - ie8 - done
 * - slice - ie8 - done
 * - some - ie8 done
 */

/**
 * @name isArray
 * ie9+, safari5+
 */
if(!Array.isArray)
{
	Array.isArray = function(arg)
	{
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

/**
 * @name every
 * ie9+
 */
if(!Array.prototype.every)
{
	Array.prototype.every = function(callbackfn, thisArg)
	{
		'use strict';
		var T, k;

		if(this == null)
		{
			throw new TypeError('this is null or not defined');
		}

		// 1. Let O be the result of calling ToObject passing the this
		//    value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal method
		//    of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
		if(typeof callbackfn !== 'function')
		{
			throw new TypeError();
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if(arguments.length > 1)
		{
			T = thisArg;
		}

		// 6. Let k be 0.
		k = 0;

		// 7. Repeat, while k < len
		while(k < len)
		{

			var kValue;

			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the HasProperty internal
			//    method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			if(k in O)
			{

				// i. Let kValue be the result of calling the Get internal method
				//    of O with argument Pk.
				kValue = O[k];

				// ii. Let testResult be the result of calling the Call internal method
				//     of callbackfn with T as the this value and argument list
				//     containing kValue, k, and O.
				var testResult = callbackfn.call(T, kValue, k, O);

				// iii. If ToBoolean(testResult) is false, return false.
				if(!testResult)
				{
					return false;
				}
			}
			k++;
		}
		return true;
	};
}

/**
 * @name filter
 * ie9+
 */
if(!Array.prototype.filter)
{
	Array.prototype.filter = function(fun/*, thisArg*/)
	{
		'use strict';

		if(this === void 0 || this === null)
		{
			throw new TypeError();
		}

		var t = Object(this);
		var len = t.length >>> 0;
		if(typeof fun !== 'function')
		{
			throw new TypeError();
		}

		var res = [];
		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for(var i = 0; i < len; i++)
		{
			if(i in t)
			{
				var val = t[i];

				// NOTE: Technically this should Object.defineProperty at
				//       the next index, as push can be affected by
				//       properties on Object.prototype and Array.prototype.
				//       But that method's new, and collisions should be
				//       rare, so use the more-compatible alternative.
				if(fun.call(thisArg, val, i, t))
				{
					res.push(val);
				}
			}
		}

		return res;
	};
}

/**
 * @name Array.prototype.forEach
 * ie9+
 */
if(!Array.prototype.forEach)
{

	Array.prototype.forEach = function(callback, thisArg)
	{

		var T, k;

		if(this == null)
		{
			throw new TypeError(' this is null or not defined');
		}

		// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if(typeof callback !== "function")
		{
			throw new TypeError(callback + ' is not a function');
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if(arguments.length > 1)
		{
			T = thisArg;
		}

		// 6. Let k be 0
		k = 0;

		// 7. Repeat, while k < len
		while(k < len)
		{

			var kValue;

			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			if(k in O)
			{

				// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
				kValue = O[k];

				// ii. Call the Call internal method of callback with T as the this value and
				// argument list containing kValue, k, and O.
				callback.call(T, kValue, k, O);
			}
			// d. Increase k by 1.
			k++;
		}
		// 8. return undefined
	};
}


/**
 * @name indexOf
 * @see Production steps of ECMA-262, Edition 5, 15.4.4.14
 * @link Reference: http://es5.github.io/#x15.4.4.14
 * ie9+
 */
if(!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(searchElement, fromIndex)
	{

		var k;

		// 1. Let O be the result of calling ToObject passing
		//    the this value as the argument.
		if(this == null)
		{
			throw new TypeError('"this" is null or not defined');
		}

		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get
		//    internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If len is 0, return -1.
		if(len === 0)
		{
			return -1;
		}

		// 5. If argument fromIndex was passed let n be
		//    ToInteger(fromIndex); else let n be 0.
		var n = +fromIndex || 0;

		if(Math.abs(n) === Infinity)
		{
			n = 0;
		}

		// 6. If n >= len, return -1.
		if(n >= len)
		{
			return -1;
		}

		// 7. If n >= 0, then Let k be n.
		// 8. Else, n<0, Let k be len - abs(n).
		//    If k is less than 0, then let k be 0.
		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

		// 9. Repeat, while k < len
		while(k < len)
		{
			var kValue;
			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the
			//    HasProperty internal method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			//    i.  Let elementK be the result of calling the Get
			//        internal method of O with the argument ToString(k).
			//   ii.  Let same be the result of applying the
			//        Strict Equality Comparison Algorithm to
			//        searchElement and elementK.
			//  iii.  If same is true, return k.
			if(k in O && O[k] === searchElement)
			{
				return k;
			}
			k++;
		}
		return -1;
	};
}


/**
 * @name lastIndexOf
 * @see Production steps of ECMA-262, Edition 5, 15.4.4.15
 * @link http://es5.github.io/#x15.4.4.15
 * ie9+
 */
if(!Array.prototype.lastIndexOf)
{
	Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/)
	{
		'use strict';

		if(this === void 0 || this === null)
		{
			throw new TypeError();
		}

		var n, k,
			t = Object(this),
			len = t.length >>> 0;
		if(len === 0)
		{
			return -1;
		}

		n = len - 1;
		if(arguments.length > 1)
		{
			n = Number(arguments[1]);
			if(n != n)
			{
				n = 0;
			}
			else if(n != 0 && n != (1 / 0) && n != -(1 / 0))
			{
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}

		for(k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--)
		{
			if(k in t && t[k] === searchElement)
			{
				return k;
			}
		}
		return -1;
	};
}


/**
 * @name map
 * @see Production steps of ECMA-262, Edition 5, 15.4.4.19
 * @link http://es5.github.io/#x15.4.4.19
 * ie9+
 */
if(!Array.prototype.map)
{

	Array.prototype.map = function(callback, thisArg)
	{

		var T, A, k;

		if(this == null)
		{
			throw new TypeError(" this is null or not defined");
		}

		// 1. Let O be the result of calling ToObject passing the |this|
		//    value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal
		//    method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if(typeof callback !== "function")
		{
			throw new TypeError(callback + " is not a function");
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if(arguments.length > 1)
		{
			T = thisArg;
		}

		// 6. Let A be a new array created as if by the expression new Array(len)
		//    where Array is the standard built-in constructor with that name and
		//    len is the value of len.
		A = new Array(len);

		// 7. Let k be 0
		k = 0;

		// 8. Repeat, while k < len
		while(k < len)
		{

			var kValue, mappedValue;

			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the HasProperty internal
			//    method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			if(k in O)
			{

				// i. Let kValue be the result of calling the Get internal
				//    method of O with argument Pk.
				kValue = O[k];

				// ii. Let mappedValue be the result of calling the Call internal
				//     method of callback with T as the this value and argument
				//     list containing kValue, k, and O.
				mappedValue = callback.call(T, kValue, k, O);

				// iii. Call the DefineOwnProperty internal method of A with arguments
				// Pk, Property Descriptor
				// { Value: mappedValue,
				//   Writable: true,
				//   Enumerable: true,
				//   Configurable: true },
				// and false.

				// In browsers that support Object.defineProperty, use the following:
				// Object.defineProperty(A, k, {
				//   value: mappedValue,
				//   writable: true,
				//   enumerable: true,
				//   configurable: true
				// });

				// For best browser support, use the following:
				A[k] = mappedValue;
			}
			// d. Increase k by 1.
			k++;
		}

		// 9. return A
		return A;
	};
}


/**
 * @name reduce
 * @see Production steps of ECMA-262, Edition 5, 15.4.4.21
 * @link http://es5.github.io/#x15.4.4.21
 * ie9+
 */
if(!Array.prototype.reduce)
{
	Array.prototype.reduce = function(callback /*, initialValue*/)
	{
		'use strict';
		if(this == null)
		{
			throw new TypeError('Array.prototype.reduce called on null or undefined');
		}
		if(typeof callback !== 'function')
		{
			throw new TypeError(callback + ' is not a function');
		}
		var t = Object(this), len = t.length >>> 0, k = 0, value;
		if(arguments.length == 2)
		{
			value = arguments[1];
		}
		else
		{
			while(k < len && !k in t)
			{
				k++;
			}
			if(k >= len)
			{
				throw new TypeError('Reduce of empty array with no initial value');
			}
			value = t[k++];
		}
		for(; k < len; k++)
		{
			if(k in t)
			{
				value = callback(value, t[k], k, t);
			}
		}
		return value;
	};
}


/**
 * @name reduce
 * @see Production steps of ECMA-262, Edition 5, 15.4.4.22
 * @link http://es5.github.io/#x15.4.4.22
 * ie9+
 */
if(!Array.prototype.reduceRight)
{
	Array.prototype.reduceRight = function(callback /*, initialValue*/)
	{
		'use strict';
		if(null === this || 'undefined' === typeof this)
		{
			throw new TypeError('Array.prototype.reduce called on null or undefined');
		}
		if('function' !== typeof callback)
		{
			throw new TypeError(callback + ' is not a function');
		}
		var t = Object(this), len = t.length >>> 0, k = len - 1, value;
		if(arguments.length >= 2)
		{
			value = arguments[1];
		}
		else
		{
			while(k >= 0 && !k in t)
			{
				k--;
			}
			if(k < 0)
			{
				throw new TypeError('Reduce of empty array with no initial value');
			}
			value = t[k--];
		}
		for(; k >= 0; k--)
		{
			if(k in t)
			{
				value = callback(value, t[k], k, t);
			}
		}
		return value;
	};
}



/**
 * @name slice
 * @description support for ie9- Shim for "fixing" IE's lack of support (IE < 9) for applying slice
 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
 * (technically, since host objects have been implementation-dependent,
 * at least before ES6, IE hasn't needed to work this way).
 * Also works on strings, fixes IE < 9 to allow an explicit undefined
 * for the 2nd argument (as in Firefox), and prevents errors when
 * called on other DOM objects.
 */
(function()
{
	'use strict';
	var _slice = Array.prototype.slice;

	try
	{
		// Can't be used with DOM elements in IE < 9
		_slice.call(document.documentElement);
	}
	catch(e)
	{ // Fails in IE < 9
		// This will work for genuine arrays, array-like objects,
		// NamedNodeMap (attributes, entities, notations),
		// NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
		// and will not fail on other DOM objects (as do DOM elements in IE < 9)
		Array.prototype.slice = function(begin, end)
		{
			// IE < 9 gets unhappy with an undefined end argument
			end = (typeof end !== 'undefined') ? end : this.length;

			// For native Array objects, we use the native slice function
			if(Object.prototype.toString.call(this) === '[object Array]')
			{
				return _slice.call(this, begin, end);
			}

			// For array like object we handle it ourselves.
			var i, cloned = [],
				size, len = this.length;

			// Handle negative value for "begin"
			var start = begin || 0;
			start = (start >= 0) ? start : len + start;

			// Handle negative value for "end"
			var upTo = (end) ? end : len;
			if(end < 0)
			{
				upTo = len + end;
			}

			// Actual expected size of the slice
			size = upTo - start;

			if(size > 0)
			{
				cloned = new Array(size);
				if(this.charAt)
				{
					for(i = 0; i < size; i++)
					{
						cloned[i] = this.charAt(start + i);
					}
				}
				else
				{
					for(i = 0; i < size; i++)
					{
						cloned[i] = this[start + i];
					}
				}
			}

			return cloned;
		};
	}
}());

/**
 * @name some
 */
if(!Array.prototype.some)
{
	/**
	 * @name some
	 * @see Production steps of ECMA-262, Edition 5, 15.4.4.17
	 * @link http://es5.github.io/#x15.4.4.17
	 * @param {Function} fun
	 * @returns {boolean}
	 */
	Array.prototype.some = function(fun /*, thisArg*/)
	{
		'use strict';

		if(this == null)
		{
			throw new TypeError('Array.prototype.some called on null or undefined');
		}

		if(typeof fun !== 'function')
		{
			throw new TypeError();
		}

		var t = Object(this);
		var len = t.length >>> 0;

		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for(var i = 0; i < len; i++)
		{
			if(i in t && fun.call(thisArg, t[i], i, t))
			{
				return true;
			}
		}

		return false;
	};
}


/**
 * @module Object
 * @author (port) Mient-jan stelling, Arjan van Wijk
 * @description Polyfill list of all the object functions javascript is going to support in the future.
 *
 * Methods
 * - Object.create() - ie8 - done
 * - Object.defineProperties() - ie8 - MISSING
 * - Object.defineProperty() - ie8/9 DOM - MISSING
 * - Object.getOwnPropertyNames() - ie8 - MISSING
 * - Object.getPrototypeOf() - ie8 - MISSING
 * - Object.isExtensible() - ie8 - MISSING
 * - Object.keys() - ie8 - done
 * - Object.preventExtensions() - ie8 - MISSING
 */
(function()
{
	var call = Function.prototype.call;
	var prototypeOfObject = Object.prototype;
	var owns = call.bind(prototypeOfObject.hasOwnProperty);

	// If JS engine supports accessors creating shortcuts.
	var defineGetter;
	var defineSetter;
	var lookupGetter;
	var lookupSetter;
	var supportsAccessors = owns(prototypeOfObject, '__defineGetter__');
	if (supportsAccessors)
	{
		/*eslint-disable no-underscore-dangle */
		defineGetter = call.bind(prototypeOfObject.__defineGetter__);
		defineSetter = call.bind(prototypeOfObject.__defineSetter__);
		lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
		lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
		/*eslint-enable no-underscore-dangle */
	}

	/**
	 * @name defineProperty
	 * @see ES5 15.2.3.6
	 * @link http://es5.github.com/#x15.2.3.6
	 *
	 * Patch for WebKit and IE8 standard mode
	 * Designed by hax <hax.github.com>
	 * related issue: https://github.com/es-shims/es5-shim/issues#issue/5
	 * IE8 Reference:
	 *  http://msdn.microsoft.com/en-us/library/dd282900.aspx
	 *  http://msdn.microsoft.com/en-us/library/dd229916.aspx
	 * WebKit Bugs:
	 *  https://bugs.webkit.org/show_bug.cgi?id=36423
	 */
	var doesDefinePropertyWork = function doesDefinePropertyWork(object)
	{
		try
		{
			Object.defineProperty(object, 'sentinel', {});
			return 'sentinel' in object;
		}
		catch (exception)
		{
			return false;
		}
	};

	// check whether defineProperty works if it's given. Otherwise,
	// shim partially.
	if (Object.defineProperty)
	{
		var definePropertyWorksOnObject = doesDefinePropertyWork({});
		var definePropertyWorksOnDom = typeof document === 'undefined' ||
			doesDefinePropertyWork(document.createElement('div'));
		if (!definePropertyWorksOnObject || !definePropertyWorksOnDom)
		{
			var definePropertyFallback = Object.defineProperty,
				definePropertiesFallback = Object.defineProperties;
		}
	}

	if (!Object.defineProperty || definePropertyFallback)
	{
		var ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ';
		var ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ';
		var ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined on this javascript engine';

		Object.defineProperty = function defineProperty(object, property, descriptor)
		{
			if ((typeof object !== 'object' && typeof object !== 'function') || object === null)
			{
				throw new TypeError(ERR_NON_OBJECT_TARGET + object);
			}
			if ((typeof descriptor !== 'object' && typeof descriptor !== 'function') || descriptor === null)
			{
				throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
			}
			// make a valiant attempt to use the real defineProperty
			// for I8's DOM elements.
			if (definePropertyFallback)
			{
				try
				{
					return definePropertyFallback.call(Object, object, property, descriptor);
				}
				catch (exception)
				{
					// try the shim if the real one doesn't work
				}
			}

			// If it's a data property.
			if ('value' in descriptor)
			{
				// fail silently if 'writable', 'enumerable', or 'configurable'
				// are requested but not supported
				/*
				 // alternate approach:
				 if ( // can't implement these features; allow false but not true
				 ('writable' in descriptor && !descriptor.writable) ||
				 ('enumerable' in descriptor && !descriptor.enumerable) ||
				 ('configurable' in descriptor && !descriptor.configurable)
				 ))
				 throw new RangeError(
				 'This implementation of Object.defineProperty does not support configurable, enumerable, or writable.'
				 );
				 */

				if (supportsAccessors && (lookupGetter(object, property) || lookupSetter(object, property)))
				{
					// As accessors are supported only on engines implementing
					// `__proto__` we can safely override `__proto__` while defining
					// a property to make sure that we don't hit an inherited
					// accessor.
					/*eslint-disable no-proto */
					var prototype = object.__proto__;
					object.__proto__ = prototypeOfObject;
					// Deleting a property anyway since getter / setter may be
					// defined on object itself.
					delete object[property];
					object[property] = descriptor.value;
					// Setting original `__proto__` back now.
					object.__proto__ = prototype;
					/*eslint-enable no-proto */
				}
				else
				{
					object[property] = descriptor.value;
				}
			}
			else
			{
				if (!supportsAccessors)
				{
					throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
				}
				// If we got that far then getters and setters can be defined !!
				if ('get' in descriptor)
				{
					defineGetter(object, property, descriptor.get);
				}
				if ('set' in descriptor)
				{
					defineSetter(object, property, descriptor.set);
				}
			}
			return object;
		};
	}

	/**
	 * @name defineProperties
	 * @see ES5 15.2.3.7
	 * @link http://es5.github.com/#x15.2.3.7
	 */
	if (!Object.defineProperties || definePropertiesFallback)
	{
		Object.defineProperties = function defineProperties(object, properties)
		{
			// make a valiant attempt to use the real defineProperties
			if (definePropertiesFallback)
			{
				try
				{
					return definePropertiesFallback.call(Object, object, properties);
				}
				catch (exception)
				{
					// try the shim if the real one doesn't work
				}
			}

			Object.keys(properties).forEach(function (property)
			{
				if (property !== '__proto__')
				{
					Object.defineProperty(object, property, properties[property]);
				}
			});
			return object;
		};
	}


	/**
	 * @name create
	 * ie9+, safari5+
	 */
	if (typeof Object.create != 'function')
	{
		Object.create = (function ()
		{
			var Object = function ()
			{
			};
			return function (prototype)
			{
				if (arguments.length > 1)
				{
					throw Error('Second argument not supported');
				}
				if (typeof prototype != 'object')
				{
					throw TypeError('Argument must be an object');
				}
				Object.prototype = prototype;
				var result = new Object();
				Object.prototype = null;
				return result;
			};
		})();
	}


	/**
	 * @name keys
	 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	 * ie9+,safari5+
	 */
	if (!Object.keys)
	{
		Object.keys = (function ()
		{
			'use strict';
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
				dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				dontEnumsLength = dontEnums.length;

			return function (obj)
			{
				if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null))
				{
					throw new TypeError('Object.keys called on non-object');
				}

				var result = [], prop, i;

				for (prop in obj)
				{
					if (hasOwnProperty.call(obj, prop))
					{
						result.push(prop);
					}
				}

				if (hasDontEnumBug)
				{
					for (i = 0; i < dontEnumsLength; i++)
					{
						if (hasOwnProperty.call(obj, dontEnums[i]))
						{
							result.push(dontEnums[i]);
						}
					}
				}
				return result;
			};
		}());
	}
})();
/**
 * @module Date
 * @author (port Mient-jan Stelling, Arjan van Wijk
 */

/**
 * @name now
 * ie9+
 */
if (!Date.now) {
	Date.now = function now() {
		return new Date().getTime();
	};
}
