define(["require", "exports"], function (require, exports) {
    /**
     * @module Temple
     * @namespace temple.locale.formatter
     * @class UpperCaseFormatter
     */
    var UpperCaseFormatter = (function () {
        function UpperCaseFormatter() {
            this._replaceMap = {
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
        }
        /**
         * @public
         * @method format
         * @param {string} text
         * @returns {string}
         */
        UpperCaseFormatter.prototype.format = function (text) {
            // replace special uppercases
            for (var i in this._replaceMap) {
                text = text.replace(new RegExp(i, 'g'), this._replaceMap[i]);
            }
            return text.toUpperCase();
        };
        return UpperCaseFormatter;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UpperCaseFormatter;
});
