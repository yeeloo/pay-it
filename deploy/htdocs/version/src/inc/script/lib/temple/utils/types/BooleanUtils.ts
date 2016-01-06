/**
 * This class contains some utility functions for booleans.
 *
 * @module Temple
 * @namespace temple.utils.types
 * @class BooleanUtils
 * @author Thijs Broerse
 */
class BooleanUtils
{
	/**
	 * Attempts to convert an object to a native boolean.
	 *
	 * @method getBoolean
	 * @static
	 * @param {any} value The value to convert.
	 * @returns {boolean}
	 */
	public static getBoolean(value:any):boolean
	{
		if(!value)
		{
			return false;
		}
		if(typeof value === 'object')
		{
			value = String(value);
		}
		if(typeof value === 'string')
		{
			value.toString().toLowerCase();
		}
		switch(value)
		{
			case true :
			case 'on' :
			case 'true' :
			case 'yes' :
			case '1' :
			case 1 :
			{
				return true;
			}
		}
		return false;
	}
}

export default BooleanUtils;