import Log from "../Log";
/**
 * This class contains some utility functions for strings.
 *
 * @module Temple
 * @namespace temple.utils.types
 * @class StringUtils
 * @author Arjan van Wijk, Thijs Broerse
 */
class StringUtils
{
	/**
	 * Repeats a string.
	 *
	 * @method repeat
	 * @static
	 * @param {string} value The string to repeat.
	 * @param {number} amount How many times the string should be repeated.
	 * @returns {string}
	 */
	public static repeat(value:string, amount:number):string
	{
		var ret:string = '';
		for(var i:number = 0; i < amount; i++)
		{
			ret += value;
		}
		return ret;
	}

	/**
	 * Add a character to the left of a string till it has a specified length.
	 *
	 * @method padLeft
	 * @static
	 * @param {string} value The original string.
	 * @param {number} length The length of the result string.
	 * @param {string} [fillChar=' '] The character that need the be attached to the left of string.
	 * @throws An error if the fillChar has an invalid value.
	 * @return {string}
	 */
	public static padLeft(value:string, length:number, fillChar:string = ' '):string
	{
		if(fillChar == null || fillChar.length == 0)
		{
			throw 'invalid value for fillChar: "' + fillChar + '"';
		}

		if(value.length < length)
		{
			var lim:number = length - value.length;
			for(var i:number = 0; i < lim; i++)
			{
				value = fillChar + value;
			}
		}
		return value;
	}

	/**
	 * Add a character to the right of a string till it has a specified length.
	 *
	 * @method padRight
	 * @static
	 * @param {string} value The original string.
	 * @param {number} length The length of the result string.
	 * @param {string} [fillChar=' '] The character that need the be attached to the right of string.
	 * @throws An error if the fillChar has an invalid value.
	 * @return {string}
	 */
	public static padRight(value:string, length:number, fillChar:string = ' '):string
	{
		if(fillChar == null || fillChar.length == 0)
		{
			throw 'invalid value for fillChar: "' + fillChar + '"';
		}
		if(value.length < length)
		{
			var lim:number = length - value.length;
			for(var i:number = 0; i < lim; i++)
			{
				value += fillChar;
			}
		}
		return value;
	}

	/**
	 * Replaces all tabs, newlines spaces to just one space
	 * Works the same as ignore whitespace for XML
	 *
	 * @method ignoreWhiteSpace
	 * @static
	 * @param {string} value The original string.
	 * @return {string}
	 */
	public static ignoreWhiteSpace(value:string):string
	{
		return value.replace(/[\t\r\n]|\s\s/g, '');
	}

	/**
	 * Does a case insensitive compare or two strings and returns true if they are equal.
	 *
	 * @method stringsAreEqual
	 * @static
	 * @param {string} value1 The first string to compare.
	 * @param {string} value2 The second string to compare.
	 * @param {boolean} [caseSensitive=true] An optional boolean indicating if the equal is case sensitive.
	 * @return {boolean} A boolean value indicating whether the strings' values are equal in a case sensitive compare.
	 */
	public static stringsAreEqual(value1:string, value2:string, caseSensitive:boolean = true):boolean
	{
		if(caseSensitive)
		{
			return (value1 == value2);
		}
		else
		{
			return (value1.toUpperCase() == value2.toUpperCase());
		}
	}

	/**
	 * Camelcases a string, e.g. my-awesome-string will turn into MyAwesomeString
	 *
	 * @method camelCase
	 * @static
	 * @param {string} value The original string.
	 * @param {boolean} [camelCaseFirst=true] A boolean value indicating whether the first character needs to be camelcased too.
	 * @return {string}
	 */
	public static camelCase(value:string, camelCaseFirst:boolean = true):string
	{
		return value.replace(/(^[a-z]|\-[a-z])/g, function(match, submatch, offset)
		{
			if(camelCaseFirst == false && offset == 0)
			{
				return match.replace(/-/, '').toLowerCase();
			}
			else
			{
				return match.replace(/-/, '').toUpperCase();
			}
		});
	}

	/**
	 * Removes whitespace from the front and the end of the specified string.
	 *
	 * @method trim
	 * @static
	 * @param {string} value The string whose beginning and ending whitespace will be removed.
	 * @return {string} A string with whitespace removed from the beginning and the end.
	 */
	public static trim(value:string):string
	{
		return StringUtils.trimLeft(StringUtils.trimRight(value));
	}

	/**
	 * Removes whitespace from the front of the specified string.
	 *
	 * @method trimLeft
	 * @static
	 * @param {string} value The string whose beginning whitespace will be removed.
	 * @return {string} A string with whitespace removed from the beginning.
	 */
	public static trimLeft(value:string):string
	{
		var size:number = value.length;
		for(var i:number = 0; i < size; i++)
		{
			if(value.charCodeAt(i) > 32)
			{
				return value.substring(i);
			}
		}
		return '';
	}

	/**
	 * Removes whitespace from the end of the specified string.
	 *
	 * @method trimRight
	 * @static
	 * @param {string} value The String whose ending whitespace will be removed.
	 * @return {string} A string with whitespace removed from the end
	 */
	public static trimRight(value:string):string
	{
		var size:number = value.length;
		for(var i:number = size; i > 0; i--)
		{
			if(value.charCodeAt(i - 1) > 32)
			{
				return value.substring(0, i);
			}
		}

		return '';
	}

	/**
	 * Determines whether the specified string starts with the specified prefix.
	 *
	 * @method startsWith
	 * @static
	 * @param {string} string The string that the prefix will be checked against.
	 * @param {string} prefix The prefix that will be tested against the string.
	 * @param {number} [position=0] The position in the string at which to begin searching.
	 * @return {boolean} If the string starts with the prefix.
	 */
	public static startsWith(value:string, prefix:string, position:number = 0):boolean
	{
		return (prefix == value.substring(position, prefix.length));
	}

	/**
	 * Determines whether the specified string ends with the spcified suffix.
	 *
	 * @method endsWith
	 * @static
	 * @param {string} value The string that the suffix will be checked against.
	 * @param {string} prefix The suffix that will be tested against the string.
	 * @param {number} [position=undefined] Search within this string as if this string were only this long.
	 * @return {boolean} If the string ends with the prefix.
	 */
	public static endsWith(value:string, suffix:string, position:number = undefined):boolean
	{
		if(position === undefined || position > value.length)
		{
			position = value.length;
		}

		position -= suffix.length;

		var lastIndex = value.indexOf(suffix, position);
		return lastIndex !== -1 && lastIndex === position;
	}

	/**
	 * Removes all instances of the remove string in the input string.
	 *
	 * @method remove
	 * @static
	 * @param {string} value The string that will be checked for instances of remove.
	 * @param {string} remove The string that will be removed from the input string.
	 * @param {boolean} [caseSensitive=true] An optional boolean indicating if the replace is case sensitive.
	 * @return {string}
	 */
	public static remove(value:string, remove:string, caseSensitive:boolean = true):string
	{
		if(value == null)
		{
			return '';
		}
		var rem:string = StringUtils.escapePattern(remove);
		var flags:string = (!caseSensitive) ? 'ig' : 'g';
		return value.replace(new RegExp(rem, flags), '');
	}

	private static escapePattern(pattern:string):string
	{
		return pattern.replace(/(\]|\[|\{|\}|\(|\)|\*|\+|\?|\.|\\)/g, '\\$1');
	}

	/**
	 * Escapes a UTF-8 string to unicode; e.g. "é" -> "\u00e9".
	 *
	 * @method escapeToUnicode
	 * @static
	 * @param {string} input The string to be escaped.
	 * @return {string} An escaped UTF-8 String.
	 */
	public static escapeToUnicode(value:string):string
	{
		var inputCopy:string = value;
		var escapedInput:string = '';
		for(var i:number = 0; i < inputCopy.length; i++)
		{
			escapedInput += StringUtils.escapeToUnicodeChar(inputCopy.substr(i, 1));
		}
		return escapedInput;
	}

	/**
	 * Escapes a UTF-8 character to unicode; e.g. "é" -> "\u00e9".
	 *
	 * @method escapeToUnicodeChar
	 * @static
	 * @param {string} inputChar The character to be escaped.
	 * @return {string} An escaped UTF-8 String.
	 */
	public static escapeToUnicodeChar(inputChar:string):string
	{
		if(inputChar < ' ' || inputChar > '}')
		{
			// get the hex digit(s) of the character (either 1 or 2 digits)
			var hexCode:String = inputChar.charCodeAt(0).toString(16);

			// ensure that there are 4 digits by adjusting
			// the # of zeros accordingly.
			while(hexCode.length < 4)
			{
				hexCode = '0' + hexCode;
			}

			// create the unicode escape sequence with 4 hex digits
			return '\\u' + hexCode;
		}
		else
		{
			return inputChar;
		}
	}

	/**
	 * Replaces all instances of the replace string in the input string with the replaceWith string.
	 *
	 * @method replace
	 * @static
	 * @param {string} value The string where instances of the replace string will be replaced with replaceWith string.
	 * @param {string} replace The string that will be replaced by instances of the replaceWith string.
	 * @param {string} replaceWith The string that will replace instances of replace string.
	 * @return {string} A new string where the replace string is replaced with the replaceWith string.
	 */
	public static replace(value:string, replace:string, replaceWith:string):string
	{
		var sb:string = '';
		var found:boolean = false;

		var sLen:number = value.length;
		var rLen:number = replace.length;

		for(var i:number = 0; i < sLen; i++)
		{
			if(value.charAt(i) == replace.charAt(0))
			{
				found = true;
				for(var j:number = 0; j < rLen; j++)
				{
					if(!(value.charAt(i + j) == replace.charAt(j)))
					{
						found = false;
						break;
					}
				}

				if(found)
				{
					sb += replaceWith;
					i = i + (rLen - 1);
					continue;
				}
			}
			sb += value.charAt(i);
		}
		return sb;
	}

	/**
	 * Replaces vars in a string. Vars are defined between {} like: '{var}'. The var can be prefixed with an (optional) $.
	 * Searches for a value in de object with the same name as the var.
	 *
	 * @method replaceVars
	 * @static
	 * @param {string} value The string containing variables which must be replaced.
	 * @param {any} object An object containing all the properties for the replacement (as name-value pair).
	 * @param {boolean} [keepIrreplaceableVars=true] A boolean indicating if variables which can not be replaced should be removed (false) or should be kept (true) in the string.
	 * @param {boolean} [debug=false] If set to true the replacement will not be executed in a try-catch statement.
	 * @throws An error if the input or the object is invalid.
	 * @returns {string}
	 */
	public static replaceVars(value:string, object:any, keepIrreplaceableVars:boolean = true, debug:boolean = false):string
	{
		if(value == null)
		{
			throw 'String can not be null';
		}
		if(object == null)
		{
			throw 'Object can not be null';
		}

		return value.replace(/\$?\{([@#$%&\w]*)(\((.*?)\))?\}/gi, function()
		{
			var prop:string = arguments[1];
			if(object != null && prop in object)
			{
				if(typeof object[prop] == 'function' && arguments[2])
				{
					if(arguments[3])
					{
						var args:any[] = arguments[3].split(',');
						for(var i:number = 0, leni:number = args.length; i < leni; i++)
						{
							args[i] = StringUtils.replaceVars(args[i], object);
						}
					}

					var argsss:IArguments = arguments;

					if(debug)
					{
						return (object[prop]).apply(null, args);
					}
					else
					{
						try
						{
							return (object[prop]).apply(null, args);
						}
						catch(error)
						{
							Log.log('Temple.Utils.Types.StringUtils', 'Unable to replace var ' + argsss[0] + ': ' + error.message);
						}
					}
				}
				else
				{
					return object[prop];
				}
			}
			if(keepIrreplaceableVars)
			{
				return '{' + prop + '}';
			}
			if(debug)
			{
				return '*VALUE \'' + prop + '\' NOT FOUND*';
			}
			return '';
		});
	}

	/**
	 * Returns everything after the first occurrence of the provided character in the string.
	 *
	 * @method afterFirst
	 * @static
	 * @param {string} value The string to search in for the character.
	 * @param {string} character The character to search for.
	 * @returns {string}
	 */
	public static afterFirst(value:string, character:string):string
	{
		if(value == null)
		{
			return '';
		}

		var idx:number = value.indexOf(character);
		if(idx == -1)
		{
			return '';
		}
		idx += character.length;
		return value.substr(idx);
	}

	/**
	 * Returns everything after the last occurence of the provided character in the string.
	 *
	 * @method afterLast
	 * @static
	 * @param {string} value The string to search in for the character.
	 * @param {string} character The character to search for.
	 * @returns {string}
	 */
	public static afterLast(value:string, character:string):string
	{
		if(value == null)
		{
			return '';
		}
		var idx:number = value.lastIndexOf(character);
		if(idx == -1)
		{
			return '';
		}
		idx += character.length;
		return value.substr(idx);
	}

	/**
	 * Returns everything before the first occurrence of the provided character in the string.
	 *
	 * @method beforeFirst
	 * @static
	 * @param {string} value The string to search in for the character.
	 * @param {string} character The character to search for.
	 * @returns {string}
	 */
	public static beforeFirst(value:string, character:string):string
	{
		if(value == null)
		{
			return '';
		}
		var characterIndex:number = value.indexOf(character);
		if(characterIndex == -1)
		{
			return '';
		}
		return value.substr(0, characterIndex);
	}

	/**
	 * Returns everything before the last occurrence of the provided character in the string.
	 *
	 * @method beforeLast
	 * @static
	 * @param {string} value The string to search in for the character.
	 * @param {string} character The character to search for.
	 * @returns {string}
	 */
	public static beforeLast(value:string, character:string):string
	{
		if(value == null)
		{
			return '';
		}
		var characterIndex:number = value.lastIndexOf(character);
		if(characterIndex == -1)
		{
			return '';
		}
		return value.substr(0, characterIndex);
	}

	/**
	 * Returns everything after the first occurance of the start string and before the first occurrence of the end string in the given string.
	 *
	 * @method between
	 * @static
	 * @param {string} value The original string.
	 * @param {string} start The string after which all characters are returned to the beginning of the end string.
	 * @param {string} end The string before which all characters are returned to the end of the start string.
	 * @returns {string}
	 */
	public static between(value:string, start:string, end:string):string
	{
		var str:string = '';
		if(value == null)
		{
			return str;
		}
		var startIdx:number = value.indexOf(start);
		if(startIdx != -1)
		{
			startIdx += start.length;

			var endIdx:number = value.indexOf(end, startIdx);
			if(endIdx != -1)
			{
				str = value.substr(startIdx, endIdx - startIdx);
			}
		}
		return str;
	}

	/**
	 * Determines whether the specified string includes any instances of char.
	 *
	 * @method includes
	 * @static
	 * @param {string} value The original string.
	 * @param {string} char The string to search for.
	 * @param {number} position The position to start the search.
	 * @returns {boolean}
	 */
	public static includes(source:string, char:string, position:number = 0):boolean
	{
		return source ? source.indexOf(char, position) != -1 : false;
	}

	/**
	 * Returns a string truncated to a specified length with optional suffix.
	 *
	 * @method truncate
	 * @static
	 * @param {string} value The original string.
	 * @param {number} length The length the string should be shortend to.
	 * @param {string} [suffix='...'] The string to append to the end of the truncated string.
	 * @returns {string}
	 */
	public static truncate(value:string, length:number, suffix:string = '...'):string
	{
		if(value == null)
		{
			return '';
		}
		length -= suffix.length;
		var trunc:string = value;
		if(trunc.length > length)
		{
			trunc = trunc.substr(0, length);
			if(/[^\s]/.test(value.charAt(length)))
			{
				trunc = StringUtils.trimRight(trunc.replace(/\w+$|\s+$/, ''));
			}
			trunc += suffix;
		}

		return trunc;
	}

	/**
	 * Returns a string with the first character of source capitalized, if that character is alphabetic.
	 *
	 * @method upperCaseFirst
	 * @static
	 * @param {string} value The original string.
	 * @returns {string}
	 */
	public static upperCaseFirst(value:string):string
	{
		return value ? value.substr(0, 1).toUpperCase() + value.substr(1) : value;
	}

	/**
	 * Determines the number of times a character or sub-string appears within the string.
	 *
	 * @method countOf
	 * @static
	 * @param {string} value The string.
	 * @param {string} char The character or sub-string to count.
	 * @param {boolean} [caseSensitive=true] A boolean flag to indicate if the search is case sensitive.
	 * @returns {number}
	 */
	public static countOf(value:string, char:string, caseSensitive:boolean = true):number
	{
		if(value == null)
		{
			return 0;
		}
		char = StringUtils.escapePattern(char);
		var flags:string = (!caseSensitive) ? 'ig' : 'g';
		return value.match(new RegExp(char, flags)).length;
	}

	/**
	 * Counts the total amount of words in a text
	 *
	 * __NOTE: does only work correctly for English texts__
	 *
	 * @method countWords
	 * @static
	 * @param {string} value The string to count the words of.
	 * @returns {number}
	 */
	public static countWords(value:string):number
	{
		if(value == null)
		{
			return 0;
		}
		return value.match(/\b\w+\b/g).length;
	}

	/**
	 * Levenshtein distance (editDistance) is a measure of the similarity between two strings. The distance is the number of deletions, insertions, or substitutions required to transform source into target.
	 *
	 * @method editDistance
	 * @static
	 * @param {string} value The string to start with.
	 * @param {string} target The string to end with.
	 * @returns {number}
	 */
	public static editDistance(value:String, target:String):number
	{
		var i:number;

		if(value == null)
		{
			value = '';
		}
		if(target == null)
		{
			target = '';
		}

		if(value == target)
		{
			return 0;
		}

		var d:any[] = []
		var cost:number;
		var n:number = value.length;
		var m:number = target.length;
		var j:number;

		if(n == 0)
		{
			return m;
		}
		if(m == 0)
		{
			return n;
		}

		for(i = 0; i <= n; i++)
		{
			d[i] = [];
		}
		for(i = 0; i <= n; i++)
		{
			d[i][0] = i;
		}
		for(j = 0; j <= m; j++)
		{
			d[0][j] = j;
		}

		for(i = 1; i <= n; i++)
		{
			var s_i:string = value.charAt(i - 1);
			for(j = 1; j <= m; j++)
			{

				var t_j:string = target.charAt(j - 1);

				if(s_i == t_j)
				{
					cost = 0;
				}
				else
				{
					cost = 1;
				}

				d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
			}
		}
		return d[n][m];
	}

	/**
	 * Determines whether the specified string contains text.
	 *
	 * @method hasText
	 * @static
	 * @param {string} value The string to check.
	 * @returns {boolean}
	 */
	public static hasText(value:string):boolean
	{
		return value && StringUtils.removeExtraWhitespace(value).length > 0;
	}

	/**
	 * Removes extraneous whitespace (extra spaces, tabs, line breaks, etc) from the specified string.
	 *
	 * @method removeExtraWhitespace
	 * @static
	 * @param {string} value The string to remove the extra whitespace from.
	 * @returns {string}
	 */
	public static removeExtraWhitespace(value:string):string
	{
		if(value == null)
		{
			return '';
		}
		var str:string = StringUtils.trim(value);
		return str.replace(/\s+/g, ' ');
	}

	/**
	 * Determines whether the specified string contains any characters.
	 *
	 * @method isEmpty
	 * @static
	 * @param {string} value The string to check.
	 * @returns {boolean}
	 */
	public static isEmpty(value:string):boolean
	{
		return !value;
	}

	/**
	 * Determines whether the specified string is numeric.
	 *
	 * @method isNumeric
	 * @static
	 * @param {string} value The string to check.
	 * @returns {boolean}
	 */
	public static isNumeric(value:string):boolean
	{
		if(value == null)
		{
			return false;
		}
		var regx:RegExp = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
		return regx.test(value);
	}

	/**
	 * Escapes all of the characters in a string to create a friendly "quotable" sting
	 *
	 * @method quote
	 * @static
	 * @param {string} value The string to quote.
	 * @returns {string}
	 */
	public static quote(value:string):string
	{
		var regx:RegExp = /[\\"\r\n]/g;
		return '"' + value.replace(regx, StringUtils._quote) + '"'; //"
	}

	private static _quote(source:string):string
	{
		switch(source)
		{
			case '\\':
				return '\\\\';
			case '\r':
				return '\\r';
			case '\n':
				return '\\n';
			case '"':
				return '\\"';
			default:
				return '';
		}
	}

	/**
	 * Returns the specified string in reverse character order.
	 *
	 * @method reverse
	 * @static
	 * @param {string} value The string to reverse.
	 * @returns {string}
	 */
	public static reverse(value:string):string
	{
		if(value == null)
		{
			return '';
		}
		return value.split('').reverse().join('');
	}

	/**
	 * Returns the specified string in reverse word order.
	 *
	 * @method reverseWords
	 * @static
	 * @param {string} value The string whose words to reverse.
	 * @returns {string}
	 */
	public static reverseWords(value:string):string
	{
		if(value == null)
		{
			return '';
		}
		return value.split(/\s+/).reverse().join(' ');
	}

	/**
	 * Determines the percentage of similarity, based on editDistance
	 *
	 * @method similarity
	 * @static
	 * @param {string} value The string to start with.
	 * @param {string} target The string to end with.
	 * @returns {number}
	 */
	public static similarity(value:string, target:string):number
	{
		var ed:number = StringUtils.editDistance(value, target);
		var maxLen:number = Math.max(value.length, target.length);
		if(maxLen == 0)
		{
			return 100;
		}
		else
		{
			return (1 - ed / maxLen) * 100;
		}
	}

	/**
	 * Removes all &lt; and &gt; based tags from a string
	 *
	 * @method stripTags
	 * @static
	 * @param {string} value The string to remove the tags of.
	 * @returns {string}
	 */
	public static stripTags(value:string):string
	{
		if(value == null)
		{
			return '';
		}
		return value.replace(/<\/?[^>]+>/igm, '');
	}

	/**
	 * Swaps the casing of a string.
	 *
	 * @method swapCase
	 * @static
	 * @param {string} value The string to swap the case of.
	 * @returns {string}
	 */
	public static swapCase(value:string):string
	{
		if(value == null)
		{
			return '';
		}
		return value.replace(/(\w)/, StringUtils._swapCase);
	}

	private static _swapCase(char:string):string
	{
		var lowChar:string = char.toLowerCase();
		var upChar:string = char.toUpperCase();
		switch(char)
		{
			case lowChar:
				return upChar;
			case upChar:
				return lowChar;
			default:
				return char;
		}
	}

	/**
	 * Removes all instances of word in string.
	 *
	 * @method removeWord
	 * @static
	 * @param {string} value The original string.
	 * @param {string} word The word to remove from the string.
	 * @param {boolean} [caseSensitive=true] Indicates the removing of the word is case sensative.
	 * @return {sting} The string without the word.
	 */
	public static removeWord(value:string, word:string, caseSensitive:boolean = true):string
	{
		return value.replace(new RegExp('^' + word + '(\\W)|(\\W)' + word + '$|\\W' + word + '(?=\\W)', 'g' + (caseSensitive ? '' : 'i')), '');
	}

	/**
	 * Removes all instances of all words in string
	 *
	 * @method removeWords
	 * @static
	 * @param {string} value the original string
	 * @param {string} word The word to remove from the string.
	 * @param {boolean} [caseSensitive=true] Indicates the removing of the word is case sensative.
	 * @return {sting} The string without the word.
	 */
	public static removeWords(value:string, words:string[], caseSensitive:boolean = true):string
	{
		var leni:number = words.length;
		for(var i:number = 0; i < leni; i++)
		{
			value = StringUtils.removeWord(value, words[i], caseSensitive);
		}
		return value;
	}

	/**
	 * Split a string on multiple seperators.
	 *
	 * @method splitMultiSeperator
	 * @static
	 * @param {string} value The string to split.
	 * @param {string[]} seperators Array with the seperators to split on.
	 * @param {boolean} [reappendSeperator=false] Re-append the seperator after each part.
	 * @return {string[]} A single-dimension array with the parts.
	 */
	public static splitMultiSeperator(value:string, seperators:string[], reappendSeperator:boolean = false):string[]
	{
		var ret:string[] = [value];
		for(var i = 0; i < seperators.length; i++)
		{
			ret = StringUtils.splitElements(ret, seperators[i], reappendSeperator);
		}
		return ret;
	}

	/**
	 * Split multiple strings on a seperator.
	 *
	 * @method splitElements
	 * @static
	 * @param {string[]} values Array with the strings to seperate.
	 * @param {string} seperators The seperator to split on.
	 * @param {boolean} [reappendSeperator=false] Re-append the seperator after each part.
	 * @return {string[]} A single-dimension array with the parts.
	 */
	public static splitElements(values:string[], seperator:string, reappendSeperator:boolean = false):string[]
	{
		var ret:string[] = [];
		for(var i:number = 0; i < values.length; i++)
		{
			var split:string[] = values[i].split(seperator);
			for(var j:number = 0; j < split.length; j++)
			{
				var p:string = StringUtils.trim(split[j]);
				if(p != '')
				{
					ret.push(reappendSeperator && j < split.length - 1 ? p + seperator : p);
				}
			}
		}
		return ret;
	}

	/**
	 * Trim all elements in an Array (in place).
	 *
	 * @method trimAll
	 * @static
	 * @param {string[]} values Array with the strings to trim.
	 * @return {string[]} An array with the trimmed strings.
	 */
	public static trimAll(values:string[]):string[]
	{
		for(var i:number = 0; i < values.length; i++)
		{
			values[i] = StringUtils.trimLeft(StringUtils.trimRight(values[i]));
		}
		return values;
	}

	/**
	 * Trim all elements in an Array, and after trimming remove any empty (== '') elements.
	 *
	 * @method trimAllFilter
	 * @static
	 * @param {string[]} values Array with the strings to trim.
	 * @return {string[]} An array with the trimmed and filtered strings.
	 */
	public static trimAllFilter(values:string[]):string[]
	{
		var ret:string[] = [];

		for(var i:number = 0; i < values.length; i++)
		{
			var tmp:string = StringUtils.trimLeft(StringUtils.trimRight(values[i]));
			if(tmp != '')
			{
				ret.push(tmp);
			}
		}
		return ret;
	}

	/**
	 * Clean all the special chars in a string and convert them to regular a-z characters. For example 'éèáć' becomes 'eeac'.
	 *
	 * @method cleanSpecialChars
	 * @static
	 * @param {string[]} values The string to clean.
	 * @return {string} An array with the trimmed and filtered strings.
	 */
	public static cleanSpecialChars(value:string):string
	{
		var validString:string = '';
		var len:number = value.length;
		//
		for(var i:number = 0; i < len; i++)
		{
			var charCode:number = value.charCodeAt(i);
			if((charCode < 47) || (charCode > 57 && charCode < 65) || charCode == 95)
			{
				validString += '-';
			}
			else if((charCode > 90 && charCode < 97) || (charCode > 122 && charCode < 128))
			{
				validString += '-';
			}
			else if(charCode > 127)
			{
				if((charCode > 130 && charCode < 135) || charCode == 142 || charCode == 143 || charCode == 145 || charCode == 146 || charCode == 160 || charCode == 193 || charCode == 225)
				{
					validString += 'a';
				}
				else if(charCode == 128 || charCode == 135)
				{
					validString += 'c';
				}
				else if(charCode == 130 || (charCode > 135 && charCode < 139) || charCode == 144 || charCode == 201 || charCode == 233)
				{
					validString += 'e';
				}
				else if((charCode > 138 && charCode < 142) || charCode == 161 || charCode == 205 || charCode == 237)
				{
					validString += 'i';
				}
				else if(charCode == 164 || charCode == 165)
				{
					validString += 'n';
				}
				else if((charCode > 146 && charCode < 150) || charCode == 153 || charCode == 162 || charCode == 211 || charCode == 214 || charCode == 243 || charCode == 246 || charCode == 336 || charCode == 337)
				{
					validString += 'o';
				}
				else if(charCode == 129 || charCode == 150 || charCode == 151 || charCode == 154 || charCode == 163 || charCode == 218 || charCode == 220 || charCode == 250 || charCode == 252 || charCode == 368 || charCode == 369)
				{
					validString += 'u';
				}
			}
			else
			{
				validString += value.charAt(i);
			}
		}
		validString = validString.replace(/\-+/g, '-').replace(/\-*$/, '');
		return validString.toLowerCase();
	}

	/**
	 * Make a string multiline.
	 *
	 * @method makeMultiline
	 * @static
	 * @param {string} value The string to make multiline.
	 * @param {number} lineLength The max length of a line.
	 * @param {string} [splitOn=' '] The string to split on.
	 * @param {string} [replaceSplit='\n'] The string that replaces the splitOn.
	 * @return {string}
	 */
	public static makeMultiline(value:string, lineLength:number, splitOn:string = ' ', replaceSplit:string = '\n'):string
	{
		var strArr = value.split(splitOn);

		var _l = 0;
		var resultStr = '';

		for(var i = 0; i < strArr.length; i++)
		{
			if((_l + strArr[i].length + splitOn.length) > lineLength)
			{
				if(resultStr.length == 0)
				{
					resultStr = strArr[i];
				}
				else
				{
					resultStr += replaceSplit + strArr[i];
				}

				_l = 0;
			}
			else
			{
				if(resultStr.length == 0)
				{
					resultStr = strArr[i];
				}
				else
				{
					resultStr += splitOn + strArr[i];
				}
			}
		}

		return StringUtils.trimLeft(StringUtils.trimRight(resultStr));
	}

	private static _UID = Date.now();

	/**
	 * Creates an unique ID
	 *
	 * @method trimAll
	 * @static
	 * @return {string} An unique ID.
	 */
	public static uniqueID():string
	{
		return (StringUtils._UID++).toString(36);
	}

}

export default StringUtils;