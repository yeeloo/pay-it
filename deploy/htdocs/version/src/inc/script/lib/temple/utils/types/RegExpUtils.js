define(["require", "exports"], function (require, exports) {
    /**
     * This class contains some utility functions for Regular Expressions.
     *
     * @module Temple
     * @namespace temple.utils.types
     * @class RegExpUtils
     * @author Arjan van Wijk
     */
    var RegExpUtils = (function () {
        function RegExpUtils() {
        }
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
        RegExpUtils.pregMatchAll = function (regExp, content) {
            var resultList = [];
            var result = regExp.exec(content);
            var index = -1;
            while (result != null && index != result.index) {
                for (var i = 0; i < result.length; ++i) {
                    if (true) {
                        if (resultList[i] == null) {
                            resultList[i] = [];
                        }
                        resultList[i].push(result[i] != undefined ? result[i] : '');
                    }
                    else {
                    }
                }
                index = result.index;
                result = regExp.exec(content);
            }
            return resultList;
        };
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
        RegExpUtils.pregMatch = function (regExp, content) {
            var resultList = [];
            var result = regExp.exec(content);
            if (result != null) {
                for (var i = 0; i < result.length; ++i) {
                    resultList.push(result[i] != undefined ? result[i] : '');
                }
            }
            return resultList;
        };
        /**
         * Parses a glob pattern string and transforms it to a RegExp
         * See https://github.com/fitzgen/glob-to-regexp
         *
         * @param {string} glob
         * @param {object} opts
         * @returns {RegExp}
         */
        RegExpUtils.globToRegExp = function (glob, opts) {
            if (opts === void 0) { opts = {
                extended: false,
                flags: []
            }; }
            if (glob == null) {
                return null;
            }
            var str = String(glob);
            // The regexp we are building, as a string.
            var reStr = "";
            // Whether we are matching so called "extended" globs (like bash) and should
            // support single character matching, matching ranges of characters, group
            // matching, etc.
            var extended = opts ? !!opts.extended : false;
            // If we are doing extended matching, this boolean is true when we are inside
            // a group (eg {*.html,*.js}), and false otherwise.
            var inGroup = false;
            var flags = opts.flags;
            var c;
            for (var i = 0, len = str.length; i < len; i++) {
                c = str[i];
                switch (c) {
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
                        if (extended) {
                            reStr += ".";
                            break;
                        }
                    case "[":
                    case "]":
                        if (extended) {
                            reStr += c;
                            break;
                        }
                    case "{":
                        if (extended) {
                            inGroup = true;
                            reStr += "(";
                            break;
                        }
                    case "}":
                        if (extended) {
                            inGroup = false;
                            reStr += ")";
                            break;
                        }
                    case ",":
                        if (inGroup) {
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
            if (!flags || !~flags.indexOf('g')) {
                reStr = "^" + reStr + "$";
            }
            return new RegExp(reStr, flags.join(''));
        };
        return RegExpUtils;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RegExpUtils;
});
