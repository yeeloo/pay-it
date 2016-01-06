/**
 * @module Function
 * @author (port) Mient-jan stelling, Arjan van Wijk
 * @description Polyfill
 *
 * Properties:
 * - arguments - deprecated
 * - caller - all - NON-STANDARDS
 * - displayName - MISSING - NON-STANDARDS
 * - length - all
 * - name - es6 - done
 *
 * Prototype Methods:
 * - apply - all
 * - bind - ie8/safari5/android4 - done
 * - call - all
 * - isGenerator - es6 - MISSING - NON-STANDARDS
 * - toSource - es6 - MISSING - NON-STANDARDS
 * - toString - all
 */

/**
 * @name Function.prototype.bind
 */
if (!Function.prototype.bind) {
	(function(){
		Function.prototype.bind = function(oThis) {
			if (typeof this !== 'function') {
				// closest thing possible to the ECMAScript 5
				// internal IsCallable function
				throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}

			var aArgs   = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP    = function() {},
				fBound  = function() {
					return fToBind.apply(this instanceof fNOP && oThis
						? this
						: oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	})();
}

if(!Function.prototype.isGenerator){
	(function(){
		Function.prototype.isGenerator = function(){
			console.warn('Function.prototype.isGenerator is experimental');
			return false;
		};
	})();
}


/**
 * @name name
 * @link Source: https://github.com/JamesMGreene/Function.name/blob/master/Function.name.js
 */
(function() {

	var fnNamePrefixRegex = /^[\S\s]*?function\s*/;
	var fnNameSuffixRegex = /[\s\(\/][\S\s]+$/;

	function _name() {
		var name = "";
		if (this === Function || this === Function.prototype.constructor) {
			name = "Function";
		}
		else if (this !== Function.prototype) {
			name = ("" + this).replace(fnNamePrefixRegex, "").replace(fnNameSuffixRegex, "");
		}
		return name;
	}

	// Inspect the polyfill-ability of this browser
	var needsPolyfill = !("name" in Function.prototype && "name" in (function x() {}));
	var canDefineProp = typeof Object.defineProperty === "function" &&
		(function() {
			var result;
			try {
				Object.defineProperty(Function.prototype, "_xyz", {
					get: function() {
						return "blah";
					},
					configurable: true
				});
				result = Function.prototype._xyz === "blah";
				delete Function.prototype._xyz;
			}
			catch (e) {
				result = false;
			}
			return result;
		})();



	// Add the "private" property for testing, even if the real property can be polyfilled
	Function.prototype._name = _name;


	// Polyfill it!
	if (canDefineProp && needsPolyfill) {
		Object.defineProperty(Function.prototype, "name", {
			get: _name
		});
	}

})();