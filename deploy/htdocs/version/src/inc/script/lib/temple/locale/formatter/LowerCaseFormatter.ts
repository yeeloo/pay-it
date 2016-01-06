import ITextFormatter from "ITextFormatter";

/**
 * @module Temple
 * @namespace temple.locale.formatter
 * @class LowerCaseFormatter
 */
class LowerCaseFormatter implements ITextFormatter
{
	// todo, reverse special chars?

	/**
	 * @public
	 * @method format
	 * @param {string} text
	 * @returns {string}
	 */
	public format(text:string):string
	{
		return text.toLowerCase();
	}
}

export default LowerCaseFormatter;