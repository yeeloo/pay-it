/**
 * This class contains some functions for Arrays.
 *
 * @module Temple
 * @namespace temple.utils.types
 * @class ArrayUtils
 * @author Arjan van Wijk, Thijs Broerse
 */
class ArrayUtils
{
	/**
	 * Sort option used in the {{#crossLink "temple.utils.types.ArrayUtils/sortOn:method"}}{{/crossLink}} function.
	 *
	 * @static
	 * @property CASEINSENSITIVE
	 * @type number
	 * @default 1
	 */
	public static CASEINSENSITIVE = 1;

	/**
	 * Sort option used in the {{#crossLink "temple.utils.types.ArrayUtils/sortOn:method"}}{{/crossLink}} function.
	 *
	 * @static
	 * @property DESCENDING
	 * @type number
	 * @default 2
	 */
	public static DESCENDING = 2;

	/**
	 * Sort option used in the {{#crossLink "temple.utils.types.ArrayUtils/sortOn:method"}}{{/crossLink}} function.
	 *
	 * @static
	 * @property UNIQUESORT
	 * @type number
	 * @default 4
	 */
	public static UNIQUESORT = 4;

	/**
	 * Sort option used in the {{#crossLink "temple.utils.types.ArrayUtils/sortOn:method"}}{{/crossLink}} function.
	 *
	 * @static
	 * @property RETURNINDEXEDARRAY
	 * @type number
	 * @default 8
	 */
	public static RETURNINDEXEDARRAY = 8;

	/**
	 * Sort option used in the {{#crossLink "temple.utils.types.ArrayUtils/sortOn:method"}}{{/crossLink}} function.
	 *
	 * @static
	 * @property NUMERIC
	 * @type number
	 * @default 16
	 */
	public static NUMERIC = 16;

	/**
	 * Checks if an array contains a specific value.
	 *
	 * @method inArray
	 * @static
	 * @param {any[]} array The array to check.
	 * @param {any} value The value to check for.
	 * @return {boolean}
	 */
	public static inArray(array:any[], value:any):boolean
	{
		return (array.indexOf(value) != -1);
	}

	/**
	 * Checks if an element in the array has a field with a specific value.
	 *
	 * @method inArrayField
	 * @static
	 * @param {any[]} array The array to check.
	 * @param {string} field The field to check for the value.
	 * @param {value} value The value to check for.
	 * @return {boolean}
	 */
	public static inArrayField(array:any[], field:string, value:any):boolean
	{
		for(var i = 0; i < array.length; i++)
		{
			if(array[i][field] == value)
			{
				return true;
			}
		}
		return false;
	}

	/**
	 * Get a random element form the array.
	 *
	 * @method randomElement
	 * @static
	 * @param {any[]} array The array to get the random element from.
	 * @return {any}
	 */
	public static randomElement(array:any[]):any
	{
		if(array.length > 0)
		{
			return array[Math.floor(Math.random() * array.length)];
		}
		return null;
	}

	/**
	 * Shuffles an array (sort random).
	 *
	 * @method shuffle
	 * @static
	 * @param {any[]} array The array to shuffle.
	 * @return {void}
	 */
	public static shuffle(array:any[]):void
	{
		var i:number = array.length;
		if(i == 0)
		{
			return;
		}
		var j:number;
		var temp:any;
		while(--i)
		{
			j = Math.floor(Math.random() * (i + 1));
			temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	}

	/**
	 * Copies the source array to the target array, without removing the reference.
	 *
	 * @method copy
	 * @static
	 * @param {any[]} array The array to copy from.
	 * @param {any[]} target The array to copy to.
	 * @return {void}
	 */
	public static copy(array:any[], target:any[]):void
	{
		var leni:number = target.length = array.length;
		for(var i:number = 0; i < leni; i++)
		{
			target[i] = array[i];
		}
	}

	/**
	 * Recursively clone an Array and it's sub-Array's (doesn't clone content objects).
	 *
	 * @method deepArrayClone
	 * @static
	 * @param {any[]} array The array to clone.
	 * @return {any[]}
	 */
	public static deepArrayClone(array:any[]):any[]
	{
		var ret:any[] = array.concat();
		var iLim:number = ret.length;
		var i:number;
		for(i = 0; i < iLim; i++)
		{
			if(Array.isArray(ret[i]))
			{
				ret[i] = ArrayUtils.deepArrayClone(ret[i]);
			}
		}
		return ret;
	}

	/**
	 * Calculates the average value of all elements in an array.
	 * Works only for array's with numeric values.
	 *
	 * @method average
	 * @static
	 * @param {any[]} array The array to calculate the average of.
	 * @return {number}
	 */
	public static average(array:any[]):number
	{
		if(array == null || array.length == 0)
		{
			return NaN;
		}
		var total:number = 0;
		for(var i = 0; i < array.length; i++)
		{
			total += array[i];
		}
		return total / array.length;
	}

	/**
	 * Remove all instances of the specified value from the array.
	 *
	 * @method removeValueFromArray
	 * @static
	 * @param {any[]} array The array from which the value will be removed.
	 * @param {any} value The item that will be removed from the array.
	 * @return {number} The number of removed items.
	 */
	public static removeValueFromArray(array:any[], value:any):number
	{
		var total:number = 0;
		for(var i:number = array.length - 1; i > -1; i--)
		{
			if(array[i] === value)
			{
				array.splice(i, 1);
				total++;
			}
		}
		return total;
	}

	/**
	 * Removes a single (first occurring) value from an array.
	 *
	 * @method removeValueFromArrayOnce
	 * @static
	 * @param {any[]} array The array from which the value will be removed.
	 * @param {any} value The item that will be removed from the array.
	 * @return {boolean} A boolean which indicates if a value is removed.
	 */
	public static removeValueFromArrayOnce(array:any[], value:any):boolean
	{
		var len:number = array.length;

		for(var i:number = len; i > -1; i--)
		{
			if(array[i] === value)
			{
				array.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	/**
	 * Create a new array that only contains unique instances of objects
	 * in the specified array.
	 *
	 * Basically, this can be used to remove duplication object instances
	 * from an array.
	 *
	 * @method createUniqueCopy
	 * @static
	 * @param {any[]} array The array which contains the values that will be used to create the new array that contains no duplicate values.
	 * @return {any[]} A new array which only contains unique items from the specified array.
	 */
	public static createUniqueCopy(array:any[]):any[]
	{
		var newArray:any[] = [];

		var len:number = array.length;
		var item:any;

		for(var i:number = 0; i < len; ++i)
		{
			item = array[i];

			if(ArrayUtils.inArray(newArray, item))
			{
				continue;
			}

			newArray.push(item);
		}
		return newArray;
	}

	/**
	 * Creates a copy of the specified array.
	 *
	 * __Note that the array returned is a new array but the items within the
	 * array are not copies of the items in the original array (but rather
	 * references to the same items).__
	 *
	 * @method clone
	 * @static
	 * @param array The array that will be cloned.
	 * @return A new array which contains the same items as the array passed in.
	 */
	public static clone(array:any[]):any[]
	{
		return array.slice(0, array.length);
	}

	/**
	 * Compares two arrays and returns a boolean indicating whether the arrays
	 * contain the same values at the same indexes.
	 *
	 * @method areEqual
	 * @static
	 * @param {any[]} array1 The first array that will be compared to the second.
	 * @param {any[]} array2 The second array that will be compared to the first.
	 * @return {boolean} True if the arrays contains the same values at the same indexes. False if they do not.
	 */
	public static areEqual(array1:any[], array2:any[]):boolean
	{
		if(array1 == array2)
		{
			return true;
		}
		if(array1.length != array2.length)
		{
			return false;
		}
		for(var i:number = array1.length - 1; i >= 0; --i)
		{
			if(array1[i] != array2[i])
			{
				return false;
			}
		}
		return true;
	}

	/**
	 * Returns the amount of (not empty) items in an array.
	 *
	 * @method filledLength
	 * @static
	 * @param {any[]} array The array to get the amount of filled items from.
	 * @return {number}
	 */
	public static filledLength(array:any[]):number
	{
		var length:number = 0;

		var leni:number = array.length;
		for(var i:number = 0; i < leni; i++)
		{
			if(array[i] != undefined)
			{
				length++;
			}
		}
		return length;
	}

	/**
	 * Returns the items that are unique in the first array.
	 *
	 * @method getUniqueFirst
	 * @static
	 * @param {any[]} array1 The first array to find the unique items in.
	 * @param {any[]} array2 The second array to check if items are unique.
	 * @return {any[]}
	 */
	public static getUniqueFirst(array1:any[], array2:any[]):any[]
	{
		var ret:any[] = [];

		for(var i:number = 0; i < array1.length; i++)
		{
			if(array2.indexOf(array1[i]) == -1)
			{
				ret.push(array1[i]);
			}
		}

		return ret;
	}

	/**
	 * Returs the items that are in both arrays.
	 *
	 * @method intersect
	 * @static
	 * @param {any[]} array1 The first array to find items in that are also in the second array.
	 * @param {any[]} array2 The second array to find items in that are also in the first array.
	 * @return {any[]}
	 */
	public static intersect(array1:any[], array2:any[]):any[]
	{
		var ret:any[] = [];
		var i:number;

		for(i = 0; i < array1.length; i++)
		{
			if(array2.indexOf(array1[i]) != -1)
			{
				ret.push(array1[i]);
			}
		}
		for(i = 0; i < array2.length; i++)
		{
			if(array1.indexOf(array2[i]) != -1)
			{
				ret.push(array2[i]);
			}
		}

		ret = ArrayUtils.createUniqueCopy(ret);

		return ret;
	}

	/**
	 * Adds an element to an array.
	 *
	 * @method addElements
	 * @static
	 * @param {any} element The element to add.
	 * @param {number} amount Number of times the element must be added.
	 * @param {any[]} [array=null] The array where the element is added to. If null, a new Array is created.
	 * @return {any[]} The array or the newly created array, with the element.
	 */
	public static addElements(element:any, amount:number, array:any[] = null):any[]
	{
		if(!array)
		{
			array = [];
		}
		for(var i:number = 0; i < amount; i++)
		{
			array.push(element);
		}
		return array;
	}

	/**
	 * Simple joins a array to a String.
	 *
	 * @method simpleJoin
	 * @static
	 * @param {any[]} array The array to join.
	 * @param {boolean} [sort=true] Determines if it will be sorted before it is joined.
	 * @param {string} [pre=' - '] Prefix for each item in the array.
	 * @param {string} [post='\n'] Postfix for each item in the array.
	 * @param {string} [empty='(empty)'] Will be returned when the array is empty.
	 * @return {string}
	 */
	public static simpleJoin(array:any[], sort:boolean = true, pre:string = ' - ', post:string = '\n', empty:string = '(empty)'):string
	{
		if(!array)
		{
			return '(null array)';
		}
		if(array.length == 0)
		{
			return empty;
		}
		if(sort)
		{
			array = array.concat().sort();
		}
		return pre + array.join(post + pre) + post;
	}

	/**
	 * Returns a new Array from an Array without the empty (null, '' or undefined) elements.
	 *
	 * @method removeEmptyElements
	 * @static
	 * @param {any[]} array The array to remove the empty elements from.
	 * @return {any[]} The array without empty elements.
	 */
	public static removeEmptyElements(array:any[]):any[]
	{
		var results:any[] = [];
		for(var i:number = 0; i < array.length; ++i)
		{
			if(array[i] != '' && array[i] != null && array[i] != undefined)
			{
				results.push(array[i]);
			}
		}

		return results;
	}

	/**
	 * Adds Array.sortOn function and related constants that works like in ActionScript for sorting arrays of objects (applying all same strict rules).
	 *
	 * [More info](https://github.com/gonchuki/mootools-Array.sortOn)
	 *
	 * Simple array used in all examples:
	 * ```
	 *var data = [
	 * 	{name:'john', city:'omaha', zip:68144},
	 * 	{name:'john', city:'kansas city', zip:72345},
	 * 	{name:'bob', city:'omaha', zip:94010},
	 * 	{name:'Frank', city:'omaha', zip:9210}
	 * ]
	 * ```
	 * Simple Ascending sort on the name
	 * ```
	 * ArrayUtils.sortOn(data, "name");
	 *
	 * //result
	 *[
	 *  {name:'Frank', city:'omaha', zip:9210},
	 *  {name:'bob', city:'omaha', zip:94010},
	 *  {name:'john', city:'omaha', zip:68144},
	 *  {name:'john', city:'kansas city', zip:72345}
	 *]
	 * ```
	 *
	 * Sort case-insensitive and reversing order:
	 *
	 * ```
	 * ArrayUtils.sortOn(data, 'name', ArrayUtils.CASEINSENSITIVE | ArrayUtils.DESCENDING);
	 *
	 * //result
	 *[
	 *  {name:'john', city:'omaha', zip:68144},
	 *  {name:'john', city:'kansas city', zip:72345},
	 *  {name:'Frank', city:'omaha', zip: 9210},
	 *  {name: 'bob', city:'omaha', zip:94010}
	 *]
	 * ```
	 *
	 * You can also sort by multiple keys by providing an array as the keys parameter. When using this approach, the options array must have the same length as the keys array or options are ignored altogether. You can use null to avoid passing options for some keys.
	 * Sorting is done from "left to right": the first key is the primary sort key, and comparisons that determine two items are equal are defined by using the next sort key.
	 *
	 * ```
	 *ArrayUtils.sortOn(data, ['name', 'city'], [Array.CASEINSENSITIVE, null]);
	 *
	 * //result
	 *[
	 *  {name:'bob', city:'omaha', zip:94010},
	 *  {name:'Frank', city:'omaha', zip:9210},
	 *  {name:'john', city:'kansas city',zip:72345},
	 *  {name:'john', city:'omaha', zip:68144}
	 *]
	 * ```
	 *
	 * Sort keys can also be part of a nested object, so with input data like:
	 *
	 * ```
	 *var data = [
	 *  { name: { first: 'Josh', last: 'Jones' }, age:30 },
	 *  { name: { first: 'Carlos', last: 'Jacques' }, age:19 },
	 *  { name: { first: 'Carlos', last: 'Dante' }, age:23 },
	 *  { name: { first: 'Tim', last: 'Marley' }, age:9 },
	 *  { name: { first: 'Courtney', last: 'Smith' }, age:27 },
	 *  { name: { first: 'Bob', last: 'Smith' }, age:30 }
	 *]
	 *
	 * ArrayUtils.sortOn(data, ['name.first', 'name.last']);
	 *
	 * //result
	 *[
	 *  {name:  {first:'Bob',last:'Smith'}, age:30},
	 *  {name:  {first:'Carlos',last:'Dante'}, age:23},
	 *  {name:  {first:'Carlos',last:'Jacques'}, age:19},
	 *  {name:  {first:'Courtney',last:'Smith'}, age:27},
	 *  {name:  {first:'Josh',last:'Jones'}, age:30},
	 *  {name:  {first:'Tim',last:'Marley'}, age:9}
	 *]
	 * ```
	 * @method sortOn
	 * @static
	 * @param {any[]} value The array to sort.
	 * @param {string[]|string} fields The field(s) to sort on.
	 * @param {any} [options] The options for the sort. Options are:
	 *
	 * - __ArrayUtils.CASEINSENSITIVE__ Do not perform case-sensitive comparisons (a precedes Z).
	 * - __ArrayUtils.NUMERIC__ Comparisons are done alphabetically by default (11 precedes 2), use this flag to perform numerical comparisons on the selected keys.
	 * - __ArrayUtils.DESCENDING__ Invert the sorting order.
	 * - __ArrayUtils.UNIQUESORT__ Do not sort the array if there are 2 or more items with the same value in a sort key. Must be in the first options entry if sorting by multiple keys.
	 * - __ArrayUtils.RETURNINDEXEDARRAY__ Do not modify the array, return a copy with the sorted data. Must be in the first options entry if sorting by multiple keys.
	 *
	 * @return {boolean}
	 */
	public static sortOn(array:any[], fields:any, options?:any):any
	{
		var dup_fn = function(field, field_options) {
			var filtered = (field_options & ArrayUtils.NUMERIC)
				? this.map(function(item) {return item[field].toFloat(); })
				: (field_options & ArrayUtils.CASEINSENSITIVE)
				? this.map(function(item) {return item[field].toLowerCase(); })
				: this.map(function(item) {return item[field]; });
			return filtered.length !== []['combine'](filtered).length;
		};

		var sort_fn = function(item_a, item_b, fields, options) {
			return (function sort_by(fields, options) {
				var ret, a, b,
					opts = options[0],
					sub_fields = fields[0].match(/[^.]+/g);

				(function get_values(s_fields, s_a, s_b) {
					var field = s_fields[0];
					if (s_fields.length > 1) {
						get_values(s_fields.slice(1), s_a[field], s_b[field]);
					} else {
						a = s_a[field].toString();
						b = s_b[field].toString();
					}
				})(sub_fields, item_a, item_b);

				if (opts & ArrayUtils.NUMERIC) {
					ret = (a.toFloat() - b.toFloat());
				} else {
					if (opts & ArrayUtils.CASEINSENSITIVE) { a = a.toLowerCase(); b = b.toLowerCase(); }

					ret = (a > b) ? 1 : (a < b) ? -1 : 0;
				}

				if ((ret === 0) && (fields.length > 1)) {
					ret = sort_by(fields.slice(1), options.slice(1));
				} else if (opts & ArrayUtils.DESCENDING) {
					ret *= -1;
				}

				return ret;
			})(fields, options);
		};

		fields = Array['from'](fields);
		options = Array['from'](options);

		if (options.length !== fields.length) options = [];

		if ((options[0] & ArrayUtils.UNIQUESORT) && (fields.some(function(field, i){return dup_fn(field, options[i]);}))) return 0;

		var curry_sort = function(item_a, item_b) {
			return sort_fn(item_a, item_b, fields, options);
		};

		if (options[0] & ArrayUtils.RETURNINDEXEDARRAY)
		{
			return array.concat().sort(curry_sort);
		}
		else
		{
			return array.sort(curry_sort);
		}
	}

	/**
	 * Converts a 2 dimensional Array to a 1 dimensional Array.
	 *
	 * @param array
	 * @returns {Array}
	 */
	public static concatAll<T>(array:Array<Array<T>>):Array<T>
	{
		var results = [];

		array.forEach(subArray => subArray.forEach(item => results.push(item)));

		return results;
	}
}

export default ArrayUtils;
