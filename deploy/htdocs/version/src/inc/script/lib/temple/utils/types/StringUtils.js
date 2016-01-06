define(["require", "exports", "../Log"], function (require, exports, Log_1) {
    /**
     * This class contains some utility functions for strings.
     *
     * @module Temple
     * @namespace temple.utils.types
     * @class StringUtils
     * @author Arjan van Wijk, Thijs Broerse
     */
    var StringUtils = (function () {
        function StringUtils() {
        }
        /**
         * Repeats a string.
         *
         * @method repeat
         * @static
         * @param {string} value The string to repeat.
         * @param {number} amount How many times the string should be repeated.
         * @returns {string}
         */
        StringUtils.repeat = function (value, amount) {
            var ret = '';
            for (var i = 0; i < amount; i++) {
                ret += value;
            }
            return ret;
        };
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
        StringUtils.padLeft = function (value, length, fillChar) {
            if (fillChar === void 0) { fillChar = ' '; }
            if (fillChar == null || fillChar.length == 0) {
                throw 'invalid value for fillChar: "' + fillChar + '"';
            }
            if (value.length < length) {
                var lim = length - value.length;
                for (var i = 0; i < lim; i++) {
                    value = fillChar + value;
                }
            }
            return value;
        };
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
        StringUtils.padRight = function (value, length, fillChar) {
            if (fillChar === void 0) { fillChar = ' '; }
            if (fillChar == null || fillChar.length == 0) {
                throw 'invalid value for fillChar: "' + fillChar + '"';
            }
            if (value.length < length) {
                var lim = length - value.length;
                for (var i = 0; i < lim; i++) {
                    value += fillChar;
                }
            }
            return value;
        };
        /**
         * Replaces all tabs, newlines spaces to just one space
         * Works the same as ignore whitespace for XML
         *
         * @method ignoreWhiteSpace
         * @static
         * @param {string} value The original string.
         * @return {string}
         */
        StringUtils.ignoreWhiteSpace = function (value) {
            return value.replace(/[\t\r\n]|\s\s/g, '');
        };
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
        StringUtils.stringsAreEqual = function (value1, value2, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            if (caseSensitive) {
                return (value1 == value2);
            }
            else {
                return (value1.toUpperCase() == value2.toUpperCase());
            }
        };
        /**
         * Camelcases a string, e.g. my-awesome-string will turn into MyAwesomeString
         *
         * @method camelCase
         * @static
         * @param {string} value The original string.
         * @param {boolean} [camelCaseFirst=true] A boolean value indicating whether the first character needs to be camelcased too.
         * @return {string}
         */
        StringUtils.camelCase = function (value, camelCaseFirst) {
            if (camelCaseFirst === void 0) { camelCaseFirst = true; }
            return value.replace(/(^[a-z]|\-[a-z])/g, function (match, submatch, offset) {
                if (camelCaseFirst == false && offset == 0) {
                    return match.replace(/-/, '').toLowerCase();
                }
                else {
                    return match.replace(/-/, '').toUpperCase();
                }
            });
        };
        /**
         * Removes whitespace from the front and the end of the specified string.
         *
         * @method trim
         * @static
         * @param {string} value The string whose beginning and ending whitespace will be removed.
         * @return {string} A string with whitespace removed from the beginning and the end.
         */
        StringUtils.trim = function (value) {
            return StringUtils.trimLeft(StringUtils.trimRight(value));
        };
        /**
         * Removes whitespace from the front of the specified string.
         *
         * @method trimLeft
         * @static
         * @param {string} value The string whose beginning whitespace will be removed.
         * @return {string} A string with whitespace removed from the beginning.
         */
        StringUtils.trimLeft = function (value) {
            var size = value.length;
            for (var i = 0; i < size; i++) {
                if (value.charCodeAt(i) > 32) {
                    return value.substring(i);
                }
            }
            return '';
        };
        /**
         * Removes whitespace from the end of the specified string.
         *
         * @method trimRight
         * @static
         * @param {string} value The String whose ending whitespace will be removed.
         * @return {string} A string with whitespace removed from the end
         */
        StringUtils.trimRight = function (value) {
            var size = value.length;
            for (var i = size; i > 0; i--) {
                if (value.charCodeAt(i - 1) > 32) {
                    return value.substring(0, i);
                }
            }
            return '';
        };
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
        StringUtils.startsWith = function (value, prefix, position) {
            if (position === void 0) { position = 0; }
            return (prefix == value.substring(position, prefix.length));
        };
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
        StringUtils.endsWith = function (value, suffix, position) {
            if (position === void 0) { position = undefined; }
            if (position === undefined || position > value.length) {
                position = value.length;
            }
            position -= suffix.length;
            var lastIndex = value.indexOf(suffix, position);
            return lastIndex !== -1 && lastIndex === position;
        };
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
        StringUtils.remove = function (value, remove, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            if (value == null) {
                return '';
            }
            var rem = StringUtils.escapePattern(remove);
            var flags = (!caseSensitive) ? 'ig' : 'g';
            return value.replace(new RegExp(rem, flags), '');
        };
        StringUtils.escapePattern = function (pattern) {
            return pattern.replace(/(\]|\[|\{|\}|\(|\)|\*|\+|\?|\.|\\)/g, '\\$1');
        };
        /**
         * Escapes a UTF-8 string to unicode; e.g. "é" -> "\u00e9".
         *
         * @method escapeToUnicode
         * @static
         * @param {string} input The string to be escaped.
         * @return {string} An escaped UTF-8 String.
         */
        StringUtils.escapeToUnicode = function (value) {
            var inputCopy = value;
            var escapedInput = '';
            for (var i = 0; i < inputCopy.length; i++) {
                escapedInput += StringUtils.escapeToUnicodeChar(inputCopy.substr(i, 1));
            }
            return escapedInput;
        };
        /**
         * Escapes a UTF-8 character to unicode; e.g. "é" -> "\u00e9".
         *
         * @method escapeToUnicodeChar
         * @static
         * @param {string} inputChar The character to be escaped.
         * @return {string} An escaped UTF-8 String.
         */
        StringUtils.escapeToUnicodeChar = function (inputChar) {
            if (inputChar < ' ' || inputChar > '}') {
                // get the hex digit(s) of the character (either 1 or 2 digits)
                var hexCode = inputChar.charCodeAt(0).toString(16);
                // ensure that there are 4 digits by adjusting
                // the # of zeros accordingly.
                while (hexCode.length < 4) {
                    hexCode = '0' + hexCode;
                }
                // create the unicode escape sequence with 4 hex digits
                return '\\u' + hexCode;
            }
            else {
                return inputChar;
            }
        };
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
        StringUtils.replace = function (value, replace, replaceWith) {
            var sb = '';
            var found = false;
            var sLen = value.length;
            var rLen = replace.length;
            for (var i = 0; i < sLen; i++) {
                if (value.charAt(i) == replace.charAt(0)) {
                    found = true;
                    for (var j = 0; j < rLen; j++) {
                        if (!(value.charAt(i + j) == replace.charAt(j))) {
                            found = false;
                            break;
                        }
                    }
                    if (found) {
                        sb += replaceWith;
                        i = i + (rLen - 1);
                        continue;
                    }
                }
                sb += value.charAt(i);
            }
            return sb;
        };
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
        StringUtils.replaceVars = function (value, object, keepIrreplaceableVars, debug) {
            if (keepIrreplaceableVars === void 0) { keepIrreplaceableVars = true; }
            if (debug === void 0) { debug = false; }
            if (value == null) {
                throw 'String can not be null';
            }
            if (object == null) {
                throw 'Object can not be null';
            }
            return value.replace(/\$?\{([@#$%&\w]*)(\((.*?)\))?\}/gi, function () {
                var prop = arguments[1];
                if (object != null && prop in object) {
                    if (typeof object[prop] == 'function' && arguments[2]) {
                        if (arguments[3]) {
                            var args = arguments[3].split(',');
                            for (var i = 0, leni = args.length; i < leni; i++) {
                                args[i] = StringUtils.replaceVars(args[i], object);
                            }
                        }
                        var argsss = arguments;
                        if (debug) {
                            return (object[prop]).apply(null, args);
                        }
                        else {
                            try {
                                return (object[prop]).apply(null, args);
                            }
                            catch (error) {
                                Log_1.default.log('Temple.Utils.Types.StringUtils', 'Unable to replace var ' + argsss[0] + ': ' + error.message);
                            }
                        }
                    }
                    else {
                        return object[prop];
                    }
                }
                if (keepIrreplaceableVars) {
                    return '{' + prop + '}';
                }
                if (debug) {
                    return '*VALUE \'' + prop + '\' NOT FOUND*';
                }
                return '';
            });
        };
        /**
         * Returns everything after the first occurrence of the provided character in the string.
         *
         * @method afterFirst
         * @static
         * @param {string} value The string to search in for the character.
         * @param {string} character The character to search for.
         * @returns {string}
         */
        StringUtils.afterFirst = function (value, character) {
            if (value == null) {
                return '';
            }
            var idx = value.indexOf(character);
            if (idx == -1) {
                return '';
            }
            idx += character.length;
            return value.substr(idx);
        };
        /**
         * Returns everything after the last occurence of the provided character in the string.
         *
         * @method afterLast
         * @static
         * @param {string} value The string to search in for the character.
         * @param {string} character The character to search for.
         * @returns {string}
         */
        StringUtils.afterLast = function (value, character) {
            if (value == null) {
                return '';
            }
            var idx = value.lastIndexOf(character);
            if (idx == -1) {
                return '';
            }
            idx += character.length;
            return value.substr(idx);
        };
        /**
         * Returns everything before the first occurrence of the provided character in the string.
         *
         * @method beforeFirst
         * @static
         * @param {string} value The string to search in for the character.
         * @param {string} character The character to search for.
         * @returns {string}
         */
        StringUtils.beforeFirst = function (value, character) {
            if (value == null) {
                return '';
            }
            var characterIndex = value.indexOf(character);
            if (characterIndex == -1) {
                return '';
            }
            return value.substr(0, characterIndex);
        };
        /**
         * Returns everything before the last occurrence of the provided character in the string.
         *
         * @method beforeLast
         * @static
         * @param {string} value The string to search in for the character.
         * @param {string} character The character to search for.
         * @returns {string}
         */
        StringUtils.beforeLast = function (value, character) {
            if (value == null) {
                return '';
            }
            var characterIndex = value.lastIndexOf(character);
            if (characterIndex == -1) {
                return '';
            }
            return value.substr(0, characterIndex);
        };
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
        StringUtils.between = function (value, start, end) {
            var str = '';
            if (value == null) {
                return str;
            }
            var startIdx = value.indexOf(start);
            if (startIdx != -1) {
                startIdx += start.length;
                var endIdx = value.indexOf(end, startIdx);
                if (endIdx != -1) {
                    str = value.substr(startIdx, endIdx - startIdx);
                }
            }
            return str;
        };
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
        StringUtils.includes = function (source, char, position) {
            if (position === void 0) { position = 0; }
            return source ? source.indexOf(char, position) != -1 : false;
        };
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
        StringUtils.truncate = function (value, length, suffix) {
            if (suffix === void 0) { suffix = '...'; }
            if (value == null) {
                return '';
            }
            length -= suffix.length;
            var trunc = value;
            if (trunc.length > length) {
                trunc = trunc.substr(0, length);
                if (/[^\s]/.test(value.charAt(length))) {
                    trunc = StringUtils.trimRight(trunc.replace(/\w+$|\s+$/, ''));
                }
                trunc += suffix;
            }
            return trunc;
        };
        /**
         * Returns a string with the first character of source capitalized, if that character is alphabetic.
         *
         * @method upperCaseFirst
         * @static
         * @param {string} value The original string.
         * @returns {string}
         */
        StringUtils.upperCaseFirst = function (value) {
            return value ? value.substr(0, 1).toUpperCase() + value.substr(1) : value;
        };
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
        StringUtils.countOf = function (value, char, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            if (value == null) {
                return 0;
            }
            char = StringUtils.escapePattern(char);
            var flags = (!caseSensitive) ? 'ig' : 'g';
            return value.match(new RegExp(char, flags)).length;
        };
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
        StringUtils.countWords = function (value) {
            if (value == null) {
                return 0;
            }
            return value.match(/\b\w+\b/g).length;
        };
        /**
         * Levenshtein distance (editDistance) is a measure of the similarity between two strings. The distance is the number of deletions, insertions, or substitutions required to transform source into target.
         *
         * @method editDistance
         * @static
         * @param {string} value The string to start with.
         * @param {string} target The string to end with.
         * @returns {number}
         */
        StringUtils.editDistance = function (value, target) {
            var i;
            if (value == null) {
                value = '';
            }
            if (target == null) {
                target = '';
            }
            if (value == target) {
                return 0;
            }
            var d = [];
            var cost;
            var n = value.length;
            var m = target.length;
            var j;
            if (n == 0) {
                return m;
            }
            if (m == 0) {
                return n;
            }
            for (i = 0; i <= n; i++) {
                d[i] = [];
            }
            for (i = 0; i <= n; i++) {
                d[i][0] = i;
            }
            for (j = 0; j <= m; j++) {
                d[0][j] = j;
            }
            for (i = 1; i <= n; i++) {
                var s_i = value.charAt(i - 1);
                for (j = 1; j <= m; j++) {
                    var t_j = target.charAt(j - 1);
                    if (s_i == t_j) {
                        cost = 0;
                    }
                    else {
                        cost = 1;
                    }
                    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
                }
            }
            return d[n][m];
        };
        /**
         * Determines whether the specified string contains text.
         *
         * @method hasText
         * @static
         * @param {string} value The string to check.
         * @returns {boolean}
         */
        StringUtils.hasText = function (value) {
            return value && StringUtils.removeExtraWhitespace(value).length > 0;
        };
        /**
         * Removes extraneous whitespace (extra spaces, tabs, line breaks, etc) from the specified string.
         *
         * @method removeExtraWhitespace
         * @static
         * @param {string} value The string to remove the extra whitespace from.
         * @returns {string}
         */
        StringUtils.removeExtraWhitespace = function (value) {
            if (value == null) {
                return '';
            }
            var str = StringUtils.trim(value);
            return str.replace(/\s+/g, ' ');
        };
        /**
         * Determines whether the specified string contains any characters.
         *
         * @method isEmpty
         * @static
         * @param {string} value The string to check.
         * @returns {boolean}
         */
        StringUtils.isEmpty = function (value) {
            return !value;
        };
        /**
         * Determines whether the specified string is numeric.
         *
         * @method isNumeric
         * @static
         * @param {string} value The string to check.
         * @returns {boolean}
         */
        StringUtils.isNumeric = function (value) {
            if (value == null) {
                return false;
            }
            var regx = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
            return regx.test(value);
        };
        /**
         * Escapes all of the characters in a string to create a friendly "quotable" sting
         *
         * @method quote
         * @static
         * @param {string} value The string to quote.
         * @returns {string}
         */
        StringUtils.quote = function (value) {
            var regx = /[\\"\r\n]/g;
            return '"' + value.replace(regx, StringUtils._quote) + '"'; //"
        };
        StringUtils._quote = function (source) {
            switch (source) {
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
        };
        /**
         * Returns the specified string in reverse character order.
         *
         * @method reverse
         * @static
         * @param {string} value The string to reverse.
         * @returns {string}
         */
        StringUtils.reverse = function (value) {
            if (value == null) {
                return '';
            }
            return value.split('').reverse().join('');
        };
        /**
         * Returns the specified string in reverse word order.
         *
         * @method reverseWords
         * @static
         * @param {string} value The string whose words to reverse.
         * @returns {string}
         */
        StringUtils.reverseWords = function (value) {
            if (value == null) {
                return '';
            }
            return value.split(/\s+/).reverse().join(' ');
        };
        /**
         * Determines the percentage of similarity, based on editDistance
         *
         * @method similarity
         * @static
         * @param {string} value The string to start with.
         * @param {string} target The string to end with.
         * @returns {number}
         */
        StringUtils.similarity = function (value, target) {
            var ed = StringUtils.editDistance(value, target);
            var maxLen = Math.max(value.length, target.length);
            if (maxLen == 0) {
                return 100;
            }
            else {
                return (1 - ed / maxLen) * 100;
            }
        };
        /**
         * Removes all &lt; and &gt; based tags from a string
         *
         * @method stripTags
         * @static
         * @param {string} value The string to remove the tags of.
         * @returns {string}
         */
        StringUtils.stripTags = function (value) {
            if (value == null) {
                return '';
            }
            return value.replace(/<\/?[^>]+>/igm, '');
        };
        /**
         * Swaps the casing of a string.
         *
         * @method swapCase
         * @static
         * @param {string} value The string to swap the case of.
         * @returns {string}
         */
        StringUtils.swapCase = function (value) {
            if (value == null) {
                return '';
            }
            return value.replace(/(\w)/, StringUtils._swapCase);
        };
        StringUtils._swapCase = function (char) {
            var lowChar = char.toLowerCase();
            var upChar = char.toUpperCase();
            switch (char) {
                case lowChar:
                    return upChar;
                case upChar:
                    return lowChar;
                default:
                    return char;
            }
        };
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
        StringUtils.removeWord = function (value, word, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            return value.replace(new RegExp('^' + word + '(\\W)|(\\W)' + word + '$|\\W' + word + '(?=\\W)', 'g' + (caseSensitive ? '' : 'i')), '');
        };
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
        StringUtils.removeWords = function (value, words, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            var leni = words.length;
            for (var i = 0; i < leni; i++) {
                value = StringUtils.removeWord(value, words[i], caseSensitive);
            }
            return value;
        };
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
        StringUtils.splitMultiSeperator = function (value, seperators, reappendSeperator) {
            if (reappendSeperator === void 0) { reappendSeperator = false; }
            var ret = [value];
            for (var i = 0; i < seperators.length; i++) {
                ret = StringUtils.splitElements(ret, seperators[i], reappendSeperator);
            }
            return ret;
        };
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
        StringUtils.splitElements = function (values, seperator, reappendSeperator) {
            if (reappendSeperator === void 0) { reappendSeperator = false; }
            var ret = [];
            for (var i = 0; i < values.length; i++) {
                var split = values[i].split(seperator);
                for (var j = 0; j < split.length; j++) {
                    var p = StringUtils.trim(split[j]);
                    if (p != '') {
                        ret.push(reappendSeperator && j < split.length - 1 ? p + seperator : p);
                    }
                }
            }
            return ret;
        };
        /**
         * Trim all elements in an Array (in place).
         *
         * @method trimAll
         * @static
         * @param {string[]} values Array with the strings to trim.
         * @return {string[]} An array with the trimmed strings.
         */
        StringUtils.trimAll = function (values) {
            for (var i = 0; i < values.length; i++) {
                values[i] = StringUtils.trimLeft(StringUtils.trimRight(values[i]));
            }
            return values;
        };
        /**
         * Trim all elements in an Array, and after trimming remove any empty (== '') elements.
         *
         * @method trimAllFilter
         * @static
         * @param {string[]} values Array with the strings to trim.
         * @return {string[]} An array with the trimmed and filtered strings.
         */
        StringUtils.trimAllFilter = function (values) {
            var ret = [];
            for (var i = 0; i < values.length; i++) {
                var tmp = StringUtils.trimLeft(StringUtils.trimRight(values[i]));
                if (tmp != '') {
                    ret.push(tmp);
                }
            }
            return ret;
        };
        /**
         * Clean all the special chars in a string and convert them to regular a-z characters. For example 'éèáć' becomes 'eeac'.
         *
         * @method cleanSpecialChars
         * @static
         * @param {string[]} values The string to clean.
         * @return {string} An array with the trimmed and filtered strings.
         */
        StringUtils.cleanSpecialChars = function (value) {
            var validString = '';
            var len = value.length;
            //
            for (var i = 0; i < len; i++) {
                var charCode = value.charCodeAt(i);
                if ((charCode < 47) || (charCode > 57 && charCode < 65) || charCode == 95) {
                    validString += '-';
                }
                else if ((charCode > 90 && charCode < 97) || (charCode > 122 && charCode < 128)) {
                    validString += '-';
                }
                else if (charCode > 127) {
                    if ((charCode > 130 && charCode < 135) || charCode == 142 || charCode == 143 || charCode == 145 || charCode == 146 || charCode == 160 || charCode == 193 || charCode == 225) {
                        validString += 'a';
                    }
                    else if (charCode == 128 || charCode == 135) {
                        validString += 'c';
                    }
                    else if (charCode == 130 || (charCode > 135 && charCode < 139) || charCode == 144 || charCode == 201 || charCode == 233) {
                        validString += 'e';
                    }
                    else if ((charCode > 138 && charCode < 142) || charCode == 161 || charCode == 205 || charCode == 237) {
                        validString += 'i';
                    }
                    else if (charCode == 164 || charCode == 165) {
                        validString += 'n';
                    }
                    else if ((charCode > 146 && charCode < 150) || charCode == 153 || charCode == 162 || charCode == 211 || charCode == 214 || charCode == 243 || charCode == 246 || charCode == 336 || charCode == 337) {
                        validString += 'o';
                    }
                    else if (charCode == 129 || charCode == 150 || charCode == 151 || charCode == 154 || charCode == 163 || charCode == 218 || charCode == 220 || charCode == 250 || charCode == 252 || charCode == 368 || charCode == 369) {
                        validString += 'u';
                    }
                }
                else {
                    validString += value.charAt(i);
                }
            }
            validString = validString.replace(/\-+/g, '-').replace(/\-*$/, '');
            return validString.toLowerCase();
        };
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
        StringUtils.makeMultiline = function (value, lineLength, splitOn, replaceSplit) {
            if (splitOn === void 0) { splitOn = ' '; }
            if (replaceSplit === void 0) { replaceSplit = '\n'; }
            var strArr = value.split(splitOn);
            var _l = 0;
            var resultStr = '';
            for (var i = 0; i < strArr.length; i++) {
                if ((_l + strArr[i].length + splitOn.length) > lineLength) {
                    if (resultStr.length == 0) {
                        resultStr = strArr[i];
                    }
                    else {
                        resultStr += replaceSplit + strArr[i];
                    }
                    _l = 0;
                }
                else {
                    if (resultStr.length == 0) {
                        resultStr = strArr[i];
                    }
                    else {
                        resultStr += splitOn + strArr[i];
                    }
                }
            }
            return StringUtils.trimLeft(StringUtils.trimRight(resultStr));
        };
        /**
         * Creates an unique ID
         *
         * @method trimAll
         * @static
         * @return {string} An unique ID.
         */
        StringUtils.uniqueID = function () {
            return (StringUtils._UID++).toString(36);
        };
        StringUtils._UID = Date.now();
        return StringUtils;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = StringUtils;
});
