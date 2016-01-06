import ITextFormatter from "ITextFormatter";

/**
 * @module Temple
 * @namespace temple.locale.formatter
 * @class ReplaceFormatter
 */
class ReplaceFormatter implements ITextFormatter
{
	constructor(public replacements:any)
	{
	}

	/**
	 * @public
	 * @method format
	 * @param {string} +text
	 * @returns {string}
	 */
	public format(text:string):string
	{
		for (var name in this.replacements)
		{
			text = text.replace(new RegExp('{' + name + '}', 'g'), this.replacements[name]);
		}

		return text;
	}
}


export default ReplaceFormatter;