define(["require", "exports"], function (require, exports) {
    /**
     * @module Temple
     * @namespace temple.locale.formatter
     * @class ReplaceFormatter
     */
    var ReplaceFormatter = (function () {
        function ReplaceFormatter(replacements) {
            this.replacements = replacements;
        }
        /**
         * @public
         * @method format
         * @param {string} +text
         * @returns {string}
         */
        ReplaceFormatter.prototype.format = function (text) {
            for (var name in this.replacements) {
                text = text.replace(new RegExp('{' + name + '}', 'g'), this.replacements[name]);
            }
            return text;
        };
        return ReplaceFormatter;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReplaceFormatter;
});
