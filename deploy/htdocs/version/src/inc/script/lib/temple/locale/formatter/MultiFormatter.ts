import ITextFormatter from "ITextFormatter";

/**
 * @module Temple
 * @namespace temple.locale.formatter
 * @class MultiFormatter
 */
class MultiFormatter implements ITextFormatter
{
	constructor(public formatters:ITextFormatter[])
	{

	}

	/**
	 * @public
	 * @method format
	 * @param {string} text
	 * @returns {string}
	 */
	public format(text:string):string
	{
		for (var i = 0; i < this.formatters.length; i++)
		{
			text = this.formatters[i].format(text);
		}

		return text;
	}
}

export default MultiFormatter;