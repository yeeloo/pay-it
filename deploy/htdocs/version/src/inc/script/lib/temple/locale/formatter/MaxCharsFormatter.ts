import ITextFormatter from "ITextFormatter";

/**
 * @module Temple
 * @namespace temple.locale.formatter
 * @class MaxCharsFormatter
 */
class MaxCharsFormatter implements ITextFormatter
{
	constructor(public maxChars:number, public readMoreChars:string = '...', public splitOnWord:boolean = false)
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
		return text.length < this.maxChars ? text : text.substr(0, this.splitOnWord ? text.lastIndexOf(' ', this.maxChars) : this.maxChars) + this.readMoreChars;
	}
}

export default MaxCharsFormatter;