define(["require", "exports"], function (require, exports) {
    /**
     * @module Temple
     * @namespace temple.locale.formatter
     * @class LowerCaseFormatter
     */
    var LowerCaseFormatter = (function () {
        function LowerCaseFormatter() {
        }
        // todo, reverse special chars?
        /**
         * @public
         * @method format
         * @param {string} text
         * @returns {string}
         */
        LowerCaseFormatter.prototype.format = function (text) {
            return text.toLowerCase();
        };
        return LowerCaseFormatter;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LowerCaseFormatter;
});
