import ITextFormatter from "ITextFormatter";

/**
 * @module Temple
 * @namespace temple.locale.formatter
 * @class UpperCaseFormatter
 */
class UpperCaseFormatter implements ITextFormatter
{
	private _replaceMap:any = {

		// greek
		'ά': 'Α',
		'έ': 'Ε',
		'ή': 'Η',
		'ί': 'Ι',
		'ΐ': 'Ϊ',
		'ό': 'Ο',
		'ύ': 'Υ',
		'ΰ': 'Ϋ',
		'ώ': 'Ω',

		// german
		'ö': 'Ö',
		'ß': 'SS'
	};

	/**
	 * @public
	 * @method format
	 * @param {string} text
	 * @returns {string}
	 */
	public format(text:string):string
	{
		// replace special uppercases
		for (var i in this._replaceMap)
		{
			text = text.replace(new RegExp(i, 'g'), this._replaceMap[i]);
		}

		return text.toUpperCase();
	}
}

export default UpperCaseFormatter;