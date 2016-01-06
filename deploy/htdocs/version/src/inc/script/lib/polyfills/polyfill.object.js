/**
 * @module Object
 * @author (port) Mient-jan stelling, Arjan van Wijk
 * @description Polyfill list of all the object functions javascript is going to support in the future.
 *
 * Properties
 * - Object.prototype
 * - Object.prototype.__count__ - REMOVED
 * - Object.prototype.__noSuchMethod__ - REMOVED
 * - Object.prototype.__parent__ - REMOVED
 * - Object.prototype.__proto__
 * - Object.prototype.constructor
 *
 * Methods
 * - Object.assign() - es6 - done
 * - Object.create() - ie8 - done
 * - Object.defineProperties() - ie8 - done
 * - Object.defineProperty() - ie8/9 DOM / safari5 - done
 * - Object.freeze() - ie8/safari5 - done
 * - Object.getOwnPropertyDescriptor() - all
 * - Object.getOwnPropertyNames() - ie8 - MISSING
 * - Object.getOwnPropertySymbols() - es6 - done
 * - Object.getPrototypeOf() - ie8 - MISSING
 * - Object.is() - es6 - done
 * - Object.isExtensible() - ie8/safari5 - done
 * - Object.isFrozen() - ie8/safari5 - done
 * - Object.isSealed() - ie8/safari5 - done
 * - Object.keys() - ie8 - done
 * - Object.observe()
 * - Object.preventExtensions() - ie8/safari5 - done
 * - Object.prototype.__defineGetter__() - DEPRECATED - NON-STANDARDS
 * - Object.prototype.__defineSetter__() - DEPRECATED - NON-STANDARDS
 * - Object.prototype.__lookupGetter__() - DEPRECATED - NON-STANDARDS
 * - Object.prototype.__lookupSetter__() - DEPRECATED - NON-STANDARDS
 * - Object.prototype.eval() - DEPRECATED
 * - Object.prototype.hasOwnProperty() - all
 * - Object.prototype.isPrototypeOf() - all
 * - Object.prototype.propertyIsEnumerable() - all
 * - Object.prototype.toLocaleString() - all
 * - Object.prototype.toSource() - MISSING - NON-STANDARDS
 * - Object.prototype.toString() - all
 * - Object.prototype.unwatch() - DEBUG - NON-STANDARDS
 * - Object.prototype.valueOf() - all
 * - Object.prototype.watch() - DEBUG - NON-STANDARDS
 * - Object.seal() - ie8/safari5 - done
 * - Object.setPrototypeOf() - es6 - done
 */

/**
 * @name assign
 */
if (Object.defineProperty && !Object.assign) {
	Object.defineProperty(Object, "assign", {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function(target, firstSource) {
			"use strict";
			if (target === undefined || target === null)
				throw new TypeError("Cannot convert first argument to object");
			var to = Object(target);
			for (var i = 1; i < arguments.length; i++) {
				var nextSource = arguments[i];
				if (nextSource === undefined || nextSource === null) continue;
				var keysArray = Object.keys(Object(nextSource));
				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
					var nextKey = keysArray[nextIndex];
					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
				}
			}
			return to;
		}
	});
}


/**
 * @name getOwnPropertySymbols
 */
if(!Object.getOwnPropertySymbols){
	Object.getOwnPropertySymbols = function(){
		console.warn('Object.getOwnPropertySymbols is experimental');
	}
}

/**
 * @name is
 */
if (!Object.is) {
	Object.is = function(v1, v2) {
		if (v1 === 0 && v2 === 0) {
			return 1 / v1 === 1 / v2;
		}
		if (v1 !== v1) {
			return v2 !== v2;
		}
		return v1 === v2;
	};
}


/**
 * @name getOwnPropertySymbols
 * @see ES5 15.2.3.9
 * @link http://es5.github.com/#x15.2.3.9
 * ie9+, safari5.1, android/ios ??
 */
if (!Object.freeze) {
	Object.freeze = function freeze(object) {
		if (Object(object) !== object) {
			throw new TypeError('Object.freeze can only be called on Objects.');
		}
		// this is misleading and breaks feature-detection, but
		// allows "securable" code to "gracefully" degrade to working
		// but insecure code.
		return object;
	};
}

/**
 * @name getOwnPropertySymbols
 * @see ES5 15.2.3.12
 * @link http://es5.github.com/#x15.2.3.12
 * ie9+, safari5.1, android/ios ??
 */
if (!Object.isFrozen) {
	Object.isFrozen = function isFrozen(object) {
		if (Object(object) !== object) {
			throw new TypeError('Object.isFrozen can only be called on Objects.');
		}
		return false;
	};
}

// ES5 15.2.3.8
// http://es5.github.com/#x15.2.3.8
if (!Object.seal) {
	Object.seal = function seal(object) {
		if (Object(object) !== object) {
			throw new TypeError('Object.seal can only be called on Objects.');
		}
		// this is misleading and breaks feature-detection, but
		// allows "securable" code to "gracefully" degrade to working
		// but insecure code.
		return object;
	};
}


// ES5 15.2.3.11
// http://es5.github.com/#x15.2.3.11
if (!Object.isSealed) {
	Object.isSealed = function isSealed(object) {
		if (Object(object) !== object) {
			throw new TypeError('Object.isSealed can only be called on Objects.');
		}
		return false;
	};
}

// ES5 15.2.3.10
// http://es5.github.com/#x15.2.3.10
if (!Object.preventExtensions) {
	Object.preventExtensions = function preventExtensions(object) {
		if (Object(object) !== object) {
			throw new TypeError('Object.preventExtensions can only be called on Objects.');
		}
		// this is misleading and breaks feature-detection, but
		// allows "securable" code to "gracefully" degrade to working
		// but insecure code.
		return object;
	};
}

// ES5 15.2.3.13
// http://es5.github.com/#x15.2.3.13
if (!Object.isExtensible) {
	Object.isExtensible = function isExtensible(object) {
		// 1. If Type(O) is not Object throw a TypeError exception.
		if (Object(object) !== object) {
			throw new TypeError('Object.isExtensible can only be called on Objects.');
		}
		// 2. Return the Boolean value of the [[Extensible]] internal property of O.
		var name = '';
		while (owns(object, name)) {
			name += '?';
		}
		object[name] = true;
		var returnValue = owns(object, name);
		delete object[name];
		return returnValue;
	};
}

/**
 * @name setPrototypeOf
 */
if (!Object.setPrototypeOf)
{
	Object.setPrototypeOf = function(obj, proto) {
		obj.__proto__ = proto;
		return obj;
	}
}