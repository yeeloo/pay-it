import refdef from "def/ReferenceDefinitions";

/**
 * Class for CSS utility function
 *
 * @class CSSUtils
 * @author Thijs Broerse
 */
class CSSUtils
{
	private static _PREFIXES:Array<string> = ['webkit', 'Moz', 'O',	'ms'];
	private static _PROPERTIES:{[property:string]:string} = {};
	private static _DIV = document.createElement('div');

	/**
	 * Get the CSS Vendor prefixed property name for a specific property
	 *
	 * @param property the name of the un-prefixed property
	 * @returns {string} the prefixed property name
	 */
	public static prefix(property:string):string
	{
		if (CSSUtils._PROPERTIES[property] !== void 0)
		{
			return CSSUtils._PROPERTIES[property]
		}
		else if (CSSUtils._DIV.style[property] !== void 0)
		{
			return CSSUtils._PROPERTIES[property] = property;
		}
		else
		{
			for (var i = 0; i < CSSUtils._PREFIXES.length; i++)
			{
				var prefixed:string = CSSUtils._PREFIXES[i] + property.charAt(0).toUpperCase() + property.substr(1);

				if (CSSUtils._DIV.style[prefixed] !== void 0)
				{
					return CSSUtils._PROPERTIES[property] = property = prefixed;
				}
			}
		}
		if (DEBUG)
		{
			throw new Error("Property '" + property + "' not found");
		}

		return property;
	}

	/**
	 * Set a specific CSS property on an element. It will prefix the property automatically if the property needs a vendor prefix.
	 *
	 * @param element
	 * @param property
	 * @param value
	 */
	public static set(element:HTMLElement, property:string, value:any):void
	{
		element.style[CSSUtils.prefix(property)] = value;
	}
}

export default CSSUtils;