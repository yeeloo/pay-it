/**
 * Definitions for ES6 functionality that has been polyfilled in the script/lib/polyfills/*.js files.
 * All standard ES6 functionality has been copied from the official TS repository.
 * All non-standard and ES>7 methods have been written manually based on MDN documentation.
 */

/**
 * Polyfilled string methods
 */
interface String {
	// Taken from TS repo at: https://github.com/Microsoft/TypeScript/blob/master/src/lib/es6.d.ts

	/**
	 * Returns a nonnegative integer Number less than 1114112 (0x110000) that is the code point
	 * value of the UTF-16 encoded code point starting at the string element at position pos in
	 * the String resulting from converting this object to a String.
	 * If there is no element at that position, the result is undefined.
	 * If a valid UTF-16 surrogate pair does not begin at pos, the result is the code unit at pos.
	 */
	codePointAt(pos: number): number;

	/**
	 * Returns true if searchString appears as a substring of the result of converting this
	 * object to a String, at one or more positions that are
	 * greater than or equal to position; otherwise, returns false.
	 * @param searchString search string
	 * @param position If position is undefined, 0 is assumed, so as to search all of the String.
	 */
	includes(searchString: string, position?: number): boolean;

	/**
	 * Returns true if the sequence of elements of searchString converted to a String is the
	 * same as the corresponding elements of this object (converted to a String) starting at
	 * endPosition – length(this). Otherwise returns false.
	 */
	endsWith(searchString: string, endPosition?: number): boolean;

	/**
	 * Returns a String value that is made from count copies appended together. If count is 0,
	 * T is the empty String is returned.
	 * @param count number of copies to append
	 */
	repeat(count: number): string;

	/**
	 * Returns true if the sequence of elements of searchString converted to a String is the
	 * same as the corresponding elements of this object (converted to a String) starting at
	 * position. Otherwise returns false.
	 */
	startsWith(searchString: string, position?: number): boolean;

	/**
	 * Returns an <a> HTML anchor element and sets the name attribute to the text value
	 * @param name
	 */
	anchor(name: string): string;

	/** Returns an <a> HTML element and sets the href attribute value */
	link(url: string): string;

	// Non-standard polyfilled methods

	/** The trimLeft() method removes whitespace from the left end of a string. */
	trimLeft(): string;


	/** The trimRight() method removes whitespace from the right end of a string. */
	trimRight(): string;
}

/**
 * Polyfilled static Array methods
 */
interface ArrayConstructor {
	// Taken from TS repo at: https://github.com/Microsoft/TypeScript/blob/master/src/lib/es6.d.ts
	// note: type 'Iterable' of parameter 'iterable' in from() method has been replaced with any.

	/**
	 * Creates an array from an array-like object.
	 * @param arrayLike An array-like object to convert to an array.
	 * @param mapfn A mapping function to call on every element of the array.
	 * @param thisArg Value of 'this' used to invoke the mapfn.
	 */
	from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;

	/**
	 * Creates an array from an iterable object.
	 * @param iterable An iterable object to convert to an array.
	 * @param mapfn A mapping function to call on every element of the array.
	 * @param thisArg Value of 'this' used to invoke the mapfn.
	 */
	from<T, U>(iterable: any, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;

	/**
	 * Creates an array from an array-like object.
	 * @param arrayLike An array-like object to convert to an array.
	 */
	from<T>(arrayLike: ArrayLike<T>): Array<T>;

	/**
	 * Creates an array from an iterable object.
	 * @param iterable An iterable object to convert to an array.
	 */
	from<T>(iterable: any): Array<any>;

	/**
	 * Returns a new array from a set of elements.
	 * @param items A set of elements to include in the new array object.
	 */
	of<T>(...items: T[]): Array<T>;
}

/**
 * Polyfilled instance array methods
 */
interface Array<T> {
	// Taken from TS repo at: https://github.com/Microsoft/TypeScript/blob/master/src/lib/es6.d.ts

	/**
	 * Returns the value of the first element in the array where predicate is true, and undefined
	 * otherwise.
	 * @param predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find
	 * immediately returns that element value. Otherwise, find returns undefined.
	 * @param thisArg If provided, it will be used as the this value for each invocation of
	 * predicate. If it is not provided, undefined is used instead.
	 */
	find(predicate: (value: T, index: number, obj: Array<T>) => boolean, thisArg?: any): T;

	/**
	 * Returns the index of the first element in the array where predicate is true, and undefined
	 * otherwise.
	 * @param predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find
	 * immediately returns that element value. Otherwise, find returns undefined.
	 * @param thisArg If provided, it will be used as the this value for each invocation of
	 * predicate. If it is not provided, undefined is used instead.
	 */
	findIndex(predicate: (value: T) => boolean, thisArg?: any): number;

	/**
	 * Returns the this object after filling the section identified by start and end with value
	 * @param value value to fill array section with
	 * @param start index to start filling the array at. If start is negative, it is treated as
	 * length+start where length is the length of the array.
	 * @param end index to stop filling the array at. If end is negative, it is treated as
	 * length+end.
	 */
	fill(value: T, start?: number, end?: number): T[];

	/**
	 * Returns the this object after copying a section of the array identified by start and end
	 * to the same array starting at position target
	 * @param target If target is negative, it is treated as length+target where length is the
	 * length of the array.
	 * @param start If start is negative, it is treated as length+start. If end is negative, it
	 * is treated as length+end.
	 * @param end If not specified, length of the this object is used as its default value.
	 */
	copyWithin(target: number, start: number, end?: number): T[];

	// Polyfilled ES7 methods
	
	/**
	 * The includes() method determines whether an array includes a certain element, returning true or false as appropriate.
	 * @param searchElement The element to search for.
	 * @param fromIndex Optional. The position in this array at which to begin searching for searchElement.
	 * A negative value searches from the end of the array. Defaults to 0.
	 */
	includes(searchElement:any, fromIndex?:number):boolean;
}

/**
 * Polyfilled static Object methods
 */
interface ObjectConstructor {
	// Taken from TS repo at: https://github.com/Microsoft/TypeScript/blob/master/src/lib/es6.d.ts

	/**
	 * Copy the values of all of the enumerable own properties from one or more source objects to a
	 * target object. Returns the target object.
	 * @param target The target object to copy to.
	 * @param source The source object from which to copy properties.
	 */
	assign<T, U>(target: T, source: U): T & U;

	/**
	 * Copy the values of all of the enumerable own properties from one or more source objects to a
	 * target object. Returns the target object.
	 * @param target The target object to copy to.
	 * @param source1 The first source object from which to copy properties.
	 * @param source2 The second source object from which to copy properties.
	 */
	assign<T, U, V>(target: T, source1: U, source2: V): T & U & V;

	/**
	 * Copy the values of all of the enumerable own properties from one or more source objects to a
	 * target object. Returns the target object.
	 * @param target The target object to copy to.
	 * @param source1 The first source object from which to copy properties.
	 * @param source2 The second source object from which to copy properties.
	 * @param source3 The third source object from which to copy properties.
	 */
	assign<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;

	/**
	 * Copy the values of all of the enumerable own properties from one or more source objects to a
	 * target object. Returns the target object.
	 * @param target The target object to copy to.
	 * @param sources One or more source objects from which to copy properties
	 */
	assign(target: any, ...sources: any[]): any;

	/**
	 * Returns an array of all symbol properties found directly on object o.
	 * @param o Object to retrieve the symbols from.
	 */
	getOwnPropertySymbols(o: any): symbol[];

	/**
	 * Returns true if the values are the same value, false otherwise.
	 * @param value1 The first value.
	 * @param value2 The second value.
	 */
	is(value1: any, value2: any): boolean;

	/**
	 * Sets the prototype of a specified object o to  object proto or null. Returns the object o.
	 * @param o The object to change its prototype.
	 * @param proto The value of the new prototype or null.
	 */
	setPrototypeOf(o: any, proto: any): any;
}

/**
 * Polyfilled static number methods and constants
 */
interface NumberConstructor {
	// Taken from TS repo at: https://github.com/Microsoft/TypeScript/blob/master/src/lib/es6.d.ts

	/**
	 * The value of Number.EPSILON is the difference between 1 and the smallest value greater than 1
	 * that is representable as a Number value, which is approximately:
	 * 2.2204460492503130808472633361816 x 10‍−‍16.
	 */
	EPSILON: number;

	/**
	 * Returns true if passed value is finite.
	 * Unlike the global isFininte, Number.isFinite doesn't forcibly convert the parameter to a
	 * number. Only finite values of the type number, result in true.
	 * @param number A numeric value.
	 */
	isFinite(number: number): boolean;

	/**
	 * Returns true if the value passed is an integer, false otherwise.
	 * @param number A numeric value.
	 */
	isInteger(number: number): boolean;

	/**
	 * Returns a Boolean value that indicates whether a value is the reserved value NaN (not a
	 * number). Unlike the global isNaN(), Number.isNaN() doesn't forcefully convert the parameter
	 * to a number. Only values of the type number, that are also NaN, result in true.
	 * @param number A numeric value.
	 */
	isNaN(number: number): boolean;

	/**
	 * Returns true if the value passed is a safe integer.
	 * @param number A numeric value.
	 */
	isSafeInteger(number: number): boolean;

	/**
	 * The value of the largest integer n such that n and n + 1 are both exactly representable as
	 * a Number value.
	 * The value of Number.MIN_SAFE_INTEGER is 9007199254740991 2^53 − 1.
	 */
	MAX_SAFE_INTEGER: number;

	/**
	 * The value of the smallest integer n such that n and n − 1 are both exactly representable as
	 * a Number value.
	 * The value of Number.MIN_SAFE_INTEGER is −9007199254740991 (−(2^53 − 1)).
	 */
	MIN_SAFE_INTEGER: number;


	/**
	 * Converts a string to a floating-point number.
	 * @param string A string that contains a floating-point number.
	 */
	parseFloat(string: string): number;

	/**
	 * Converts A string to an integer.
	 * @param s A string to convert into a number.
	 * @param radix A value between 2 and 36 that specifies the base of the number in numString.
	 * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
	 * All other strings are considered decimal.
	 */
	parseInt(string: string, radix?: number): number;
}

/**
 * Polyfilled static Function methods
 */
interface Function {
	// Taken from TS repo at: https://github.com/Microsoft/TypeScript/blob/master/src/lib/es6.d.ts

	/**
	 * Returns the name of the function. Function names are read-only and can not be changed.
	 */
	name: string;
}