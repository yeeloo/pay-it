define(["require", "exports"], function (require, exports) {
    /**
     * Compresses a number to a tiny string and back.
     *
     * Uses the same principle as the toString(base) of a number, accept that you can define your own base.
     *
     * NumberCompressor.compress(myNumber, "0123456789abcdef") will give the same output as myNumber.toString(16).
     *
     * When using a many characters in the base, you can convert a number to a small string:
     *
     * NumberCompressor.compress(myNumber, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._~:[]@!$&'()*+,;=");
     *
     * @class NumberCompressor
     */
    var NumberCompressor = (function () {
        /**
         * Creates an instance of the NumberCompressor with a specific base
         * @param {string} base the base which is used to compress the number
         */
        function NumberCompressor(base) {
            this.base = base;
        }
        /**
         * Compresses a number to a string using the base of this object
         *
         * @method compress
         * @param {number} d the number to compress
         * @returns {string} the compressed number
         */
        NumberCompressor.prototype.compress = function (d) {
            return NumberCompressor.compress(d, this.base);
        };
        /**
         * Converts the compressed number to the original number using the base of this object
         *
         * @method uncompress
         * @param {string} compressed
         * @returns {number}
         */
        NumberCompressor.prototype.uncompress = function (compressed) {
            return NumberCompressor.uncompress(compressed, this.base);
        };
        /**
         * Compresses a number to a string using the specified base
         *
         * @method compress
         * @param {number} d the number to compress
         * @param {string} base the base which is used to compress the number
         * @returns {string} the compressed number
         *
         * @static
         */
        NumberCompressor.compress = function (d, base) {
            var b = base.length;
            var r = d % b;
            if (d - r == 0) {
                return base.charAt(r);
            }
            else {
                return NumberCompressor.compress((d - r) / b, base) + base.charAt(r);
            }
        };
        /**
         * Converts a compressed number to the original number using the specified base
         *
         * @method uncompress
         * @param {string} compressed number
         * @param {string} base the base which is used to compress the number
         * @returns {number} the original number
         *
         * @static
         */
        NumberCompressor.uncompress = function (compressed, base) {
            var n = 0, b = base.length;
            for (var i = 0, l = compressed.length; i < l; i++) {
                n += base.indexOf(compressed[i]) * Math.pow(b, l - i - 1);
            }
            return n;
        };
        return NumberCompressor;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NumberCompressor;
});
