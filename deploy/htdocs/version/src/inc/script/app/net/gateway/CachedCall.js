define(["require", "exports"], function (require, exports) {
    /**
     * Holds a JSON encoded version of the response, that is cached internally until it expires.
     *
     * @class CachedCall
     */
    var CachedCall = (function () {
        /**
         * @constructor
         * @class CachedCall
         * @param {string} key
         * @param {any} result
         * @param {number} maxAge In Seconds
         */
        function CachedCall(key, result, maxAge) {
            if (maxAge === void 0) { maxAge = 60; }
            this.key = key;
            this.result = result;
            this.maxAge = maxAge;
            this._createdAt = +new Date();
        }
        /**
         * The current age of the saved data
         *
         * @method getAge
         * @returns {number}
         */
        CachedCall.prototype.getAge = function () {
            return ((+new Date()) - this._createdAt) / 1000;
        };
        /**
         * Checks if the call is expired by comparing the age with the max-age of the data.
         *
         * @method isExpired
         * @returns {boolean}
         */
        CachedCall.prototype.isExpired = function () {
            return this.maxAge != Number.POSITIVE_INFINITY && this.getAge() > this.maxAge;
        };
        return CachedCall;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CachedCall;
});
