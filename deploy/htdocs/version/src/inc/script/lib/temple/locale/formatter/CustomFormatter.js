define(["require", "exports"], function (require, exports) {
    /**
     * @module Temple
     * @namespace temple.locale.formatter
     * @class CustomFormatter
     */
    var CustomFormatter = (function () {
        function CustomFormatter(func) {
            this.func = func;
        }
        /**
         * @public
         * @method format
         * @param {string} text
         * @returns {string}
         */
        CustomFormatter.prototype.format = function (text) {
            return this.func(text);
        };
        return CustomFormatter;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CustomFormatter;
});
