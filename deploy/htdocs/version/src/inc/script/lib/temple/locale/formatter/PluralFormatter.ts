import ITextFormatter from "ITextFormatter";
import Pluralize from "./util/Pluralize";

/**
 * @module Temple
 * @namespace temple.locale.formatter
 * @class PluralFormatter
 */
class PluralFormatter implements ITextFormatter
{
	constructor(public replacements:any)
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
		for (var name in this.replacements)
		{
			if (this.replacements.hasOwnProperty(name))
			{
				text = text.replace(new RegExp('{' + name + '}', 'gi'), this.replacements[name]);

				// {enkelvound|aantal|meervoud}

				text = text.replace(new RegExp('{([^|{}]+)\\|' + name + '(?:\\|([^}]+))?}', 'gmi'), (...args) =>
				{
					return this._pluralize(args[1], this.replacements[name], args[2]);
				})
			}
		}

		return text;
	}

	/**
	 * @private
	 * @param {string} noun
	 * @param {number} count
	 * @param {string} plural
	 */
	private _pluralize(noun:string, count:number, plural:string):string;

	/**
	 * @private
	 * @param {string} noun
	 * @param {string} count
	 * @param {string} plural
	 */
	private _pluralize(noun:string, count:string, plural:string):string;

	/**
	 * @private
	 * @param {string} noun
	 * @param {any} count
	 * @param {string} plural
	 * @returns {string}
	 */
	private _pluralize(noun:string, count:any, plural:string = null):string
	{
		if (typeof count === 'string')
		{
			count = isNaN(parseInt(count)) ? (count == 'one' ? 1 : 2) : parseInt(count);
		}

		return Pluralize.pluralize(noun, count, plural);
	}
}

export default PluralFormatter;