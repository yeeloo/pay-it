/**
 * This class contains some utility functions for Objects.
 *
 * @module Temple
 * @namespace temple.utils.types
 * @class ObjectUtils
 * @author Thijs Broerse
 */
class ObjectUtils
{

	/**
	 * Checks if the value is a primitive (string, number, or boolean).
	 *
	 * @method isPrimitive
	 * @static
	 * @param {any} value The value to check.
	 * @return {boolean}
	 */
	public static isPrimitive(value:any):boolean
	{
		if(typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean' || value == null)
		{
			return true;
		}
		return false;
	}

	/**
	 * Checks if the object has (one or more) values.
	 *
	 * @method hasValues
	 * @static
	 * @param {any} object The object to check.
	 * @return {boolean}
	 */
	public static hasValues(object:any):boolean
	{
		if(Array.isArray(object))
		{
			return object.length > 0;
		}

		for(var key in object)
		{
			if(object.hasOwnProperty(key))
			{
				return true
			}
		}
		return false;
	}

	/**
	 * Counts the number of elements in an Object.
	 *
	 * @method getLength
	 * @static
	 * @param {any} object The object to get the length from.
	 * @return {number}
	 */
	public static getLength(object:any):number
	{
		var count:number = 0;
		for(var key in object)
		{
			count++;
		}
		return count;
	}

	/**
	 * Get the keys of an object.
	 *
	 * @method getKeys

	 * @param {any} object The object to get the keys from.
	 * @return {string[]} An array of all the keys.
	 */
	public static getKeys(object:any):string[]
	{
		var keys:string[] = [];

		for(var key in object)
		{
			if(object.hasOwnProperty(key))
			{
				keys.push(key);
			}
		}
		return keys;
	}

	/**
	 * Get the values of an object.
	 *
	 * @method getValues
	 * @static
	 * @param {any} object The object to get the keys from.
	 * @return {any[]} An array of all the values.
	 */
	public static getValues(object:any):any[]
	{
		var values:any[] = [];
		for(var key in object)
		{
			if(object.hasOwnProperty(key))
			{
				values.push(object[key]);
			}
		}
		return values;
	}

	/**
	 * Check if there are properties defined.
	 *
	 * @method hasKeys
	 * @static
	 * @param {any} object The object to check.
	 * @return {boolean}
	 */
	public static hasKeys(object:any):boolean
	{
		for(var key in object)
		{
			if(object.hasOwnProperty(key))
			{
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns an inverted object with all values as key and keys as value.
	 *
	 * @method invert
	 * @static
	 * @param {any} object The object to invert.
	 * @return {any} The inverted object.
	 */
	public static invert(object:any):any
	{
		var inverted:any = {};
		for(var key in object)
		{
			if(object.hasOwnProperty(key))
			{
				inverted[object[key]] = key;
			}
		}
		return inverted;
	}

	/**
	 * Converts an object to an other class.
	 *
	 * @method convert
	 * @static
	 * @param {any} object The object to convert.
	 * @param {any} toClass The object to convert to.
	 * @return {void}
	 */
	public static convert(object:any, toClass:any):void
	{
		for(var property in toClass.prototype)
		{
			if(property in toClass.prototype)
			{
				object[property] = toClass.prototype[property];
			}
		}
		(<any>object).__proto__ = new (toClass)();
	}

	/**
	 * Removes all properties of an object.
	 *
	 * @method clear
	 * @static
	 * @param {any} object The object to clear.
	 * @return {void}
	 */
	public static clear(object:any):void
	{
		for(var property in object)
		{
			delete object[property];
		}
	}

	/**
	 * Call Object.freeze recursively.
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
	 *
	 * @method deepFreeze
	 * @static
	 * @param {any} object
	 * @return {void}
	 */
	public static deepFreeze(object:any):void
	{
		// first freeze the object.
		Object.freeze(object);

		// now freeze properties that are objects
		for (var propKey in object)
		{
			var prop = object[propKey];

			if (!object.hasOwnProperty(propKey) || !(typeof prop === 'object') || Object.isFrozen(prop))
			{
				// If the object is on the prototype, not an object, or is already frozen,
				// skip it. Note that this might leave an unfrozen reference somewhere in the
				// object if there is an already frozen object containing an unfrozen object.
				continue;
			}

			ObjectUtils.deepFreeze(prop); // Recursively call deepFreeze.
		}
	}
}

export default ObjectUtils;