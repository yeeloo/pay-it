define(["require", "exports"], function (require, exports) {
    /**
     * @module Temple
     * @namespace temple.locale.formatter
     * @class MaxCharsFormatter
     */
    var MaxCharsFormatter = (function () {
        function MaxCharsFormatter(maxChars, readMoreChars, splitOnWord) {
            if (readMoreChars === void 0) { readMoreChars = '...'; }
            if (splitOnWord === void 0) { splitOnWord = false; }
            this.maxChars = maxChars;
            this.readMoreChars = readMoreChars;
            this.splitOnWord = splitOnWord;
        }
        /**
         * @public
         * @method format
         * @param {string} text
         * @returns {string}
         */
        MaxCharsFormatter.prototype.format = function (text) {
            return text.length < this.maxChars ? text : text.substr(0, this.splitOnWord ? text.lastIndexOf(' ', this.maxChars) : this.maxChars) + this.readMoreChars;
        };
        return MaxCharsFormatter;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MaxCharsFormatter;
});
