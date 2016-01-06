/**
 * Converts an object to a readable string with the following format:
 *
 * [Class property="value" property=numberValue]
 *
 * @module Temple
 * @namespace temple.core
 * @method objectToString
 * @param {any} object the object that must be turned into a string
 * @param {Array<string>} props a list of properties on the object that must be included in the returning string.
 * @returns {string}
 */
function objectToString(object:any, props:Array<string> = null):string
{
	var MAX_VALUE_LENGTH:number = 80;

	if (object === void 0 || object === null) return object;

	var str:string = object.constructor.name;

	if (props && props.length)
	{
		str += " (";
		var sep:string = "", value:any;

		for (var i = 0, leni = props.length; i < leni; i++)
		{
			var prop:string = props[i];
			if (object[prop] !== void 0)
			{
				value = object[prop];
				str += sep + prop + "=";

				if (typeof value == "string" && value !== null)
				{
					// remove new lines
					var s:string = (<string>value).split("\r").join(" ").split("\n").join(" ");
					// limit length
					if (s.length > MAX_VALUE_LENGTH) s = s.substr(0, MAX_VALUE_LENGTH) + "[...]";
					str += "\"" + s + "\"";
				}
				else
				{
					str += value;
				}
				sep = " ";
			}
		}
		str += ")";
	}
	return "[" + str + "]";
}

export default objectToString;