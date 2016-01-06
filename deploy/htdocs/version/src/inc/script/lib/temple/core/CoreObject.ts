import objectToString from "./objectToString";

/**
 * An object which uses the objectToString method when converted to a string.
 *
 * @module Temple
 * @namespace temple.core
 * @class CoreObject
 */
class CoreObject
{
	/**
	 * A list of properties that must be included in the returning string when converted to string.
	 *
	 * @property toStringProps
	 * @type Array<string>
	 */
	public toStringProps:Array<string>;

	/**
	 * Convert the object to a string.
	 *
	 * @method toString
	 * @returns {string}
	 */
	public toString():string
	{
		return objectToString(this, this.toStringProps);
	}
}

export default CoreObject;