define(["require", "exports"], function (require, exports) {
    /**
     * @module Temple
     * @namespace temple.locale.formatter
     * @class MultiFormatter
     */
    var MultiFormatter = (function () {
        function MultiFormatter(formatters) {
            this.formatters = formatters;
        }
        /**
         * @public
         * @method format
         * @param {string} text
         * @returns {string}
         */
        MultiFormatter.prototype.format = function (text) {
            for (var i = 0; i < this.formatters.length; i++) {
                text = this.formatters[i].format(text);
            }
            return text;
        };
        return MultiFormatter;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MultiFormatter;
});
