import ITextFormatter from "ITextFormatter";

/**
 * @module Temple
 * @namespace temple.locale.formatter
 * @class CustomFormatter
 */
class CustomFormatter implements ITextFormatter
{
	constructor(public func:(text:string) => string)
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
		return this.func(text);
	}
}

export default CustomFormatter;