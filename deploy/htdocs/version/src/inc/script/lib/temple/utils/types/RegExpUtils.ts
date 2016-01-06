/**
 * This class contains some utility functions for Regular Expressions.
 *
 * @module Temple
 * @namespace temple.utils.types
 * @class RegExpUtils
 * @author Arjan van Wijk
 */
class RegExpUtils
{
	/**
	 * Searches text for all matches to the regular expression given in pattern and return the result.
	 * Modelled like the php [preg_match_all](http://php.net/manual/en/function.preg-match-all.php).
	 *
	 * @method pregMatchAll
	 * @static
	 * @param {RegExp} regExp The regular expression.
	 * @param {string} content The string to search for.
	 * @return {any[]}
	 */
	public static pregMatchAll(regExp:RegExp, content:string):any[]
	{
		var resultList:any[] = [];

		var result:any = regExp.exec(content);

		var index:number = -1;
		while(result != null && index != result.index)
		{
			for(var i:number = 0; i < result.length; ++i)
			{
				if(true)
				{
					if(resultList[i] == null)
					{
						resultList[i] = [];
					}
					resultList[i].push(result[i] != undefined ? result[i] : '');
				}
				else
				{
					// PREG_SET_ORDER implementatie
				}
			}
			index = result.index;
			result = regExp.exec(content);
		}
		return resultList;
	}

	/**
	 * Searches for a match to the regular expression given in pattern.
	 * Modelled like the php [preg_match](http://php.net/manual/en/function.preg-match.php).
	 *
	 * @method pregMatch
	 * @static
	 * @param {RegExp} regExp The regular expression.
	 * @param {string} content The string to search for.
	 * @return {any[]}
	 */
	public static pregMatch(regExp:RegExp, content:string):any[]
	{
		var resultList:any[] = [];

		var result:any = regExp.exec(content);
		if(result != null)
		{
			for(var i:number = 0; i < result.length; ++i)
			{
				resultList.push(result[i] != undefined ? result[i] : '');
			}
		}
		return resultList;
	}

	/**
	 * Parses a glob pattern string and transforms it to a RegExp
	 * See https://github.com/fitzgen/glob-to-regexp
	 *
	 * @param {string} glob
	 * @param {object} opts
	 * @returns {RegExp}
	 */
	public static globToRegExp(glob:string, opts:{extended:boolean;flags:Array<string>} = {
		extended: false,
		flags: []
	}):RegExp
	{
		if(glob == null)
		{
			return null;
		}

		var str = String(glob);

		// The regexp we are building, as a string.
		var reStr:string = "";

		// Whether we are matching so called "extended" globs (like bash) and should
		// support single character matching, matching ranges of characters, group
		// matching, etc.
		var extended = opts ? !!opts.extended : false;

		// If we are doing extended matching, this boolean is true when we are inside
		// a group (eg {*.html,*.js}), and false otherwise.
		var inGroup = false;
		var flags = opts.flags;
		var c;
		for(var i = 0, len = str.length; i < len; i++)
		{
			c = str[i];

			switch(c)
			{
				case "\\":
				case "/":
				case "$":
				case "^":
				case "+":
				case ".":
				case "(":
				case ")":
				case "=":
				case "!":
					reStr += "\\" + c;
					break;

				case "?":
					if(extended)
					{
						reStr += ".";
						break;
					}

				case "[":
				case "]":
					if(extended)
					{
						reStr += c;
						break;
					}

				case "{":
					if(extended)
					{
						inGroup = true;
						reStr += "(";
						break;
					}

				case "}":
					if(extended)
					{
						inGroup = false;
						reStr += ")";
						break;
					}

				case ",":
					if(inGroup)
					{
						reStr += "|";
						break;
					}
					reStr += "\\" + c;
					break;

				case "*":
					reStr += ".*";
					break;

				default:
					reStr += c;
			}
		}

		// When regexp 'g' flag is specified don't
		// constrain the regular expression with ^ & $
		if(!flags || !~flags.indexOf('g'))
		{
			reStr = "^" + reStr + "$";
		}

		return new RegExp(reStr, flags.join(''));
	}
}

export default RegExpUtils;
