define(["require", "exports"], function (require, exports) {
    /**
     * @author Bart (bart[at]mediamonks.com)
     * @module Temple
     * @namespace temple.utils
     * @class MinMax
     *
     */
    var MinMax = (function () {
        /**
         * Lazy min/max number values util (easy randomizer/limiter etc).
         *
         * @class MinMax
         * @param {number} [min=0] The minimum value.
         * @param {string} [max=1] The maximum value.
         * @constructor
         */
        function MinMax(min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 1; }
            this._min = 0;
            this._max = 1;
            this._range = 1;
            this._min = min;
            this._max = max;
            this.order();
        }
        /**
         * Get a random value betweem min and max.
         *
         * @method getRandom
         * @return {number}
         **/
        MinMax.prototype.getRandom = function () {
            return this._range * Math.random() + this._min;
        };
        /**
         * Get the difference between min and max.
         *
         * @method getRange
         * @return {number}
         **/
        MinMax.prototype.getRange = function () {
            return this._range;
        };
        /**
         * Get the center value between min and max.
         *
         * @method getCenter
         * @return {number}
         **/
        MinMax.prototype.getCenter = function () {
            return this._range / 2 + this._min;
        };
        /**
         * Get the min value.
         *
         * @method getMin
         * @return {number}
         **/
        MinMax.prototype.getMin = function () {
            return this._min;
        };
        /**
         * Set the min value.
         *
         * @method setMin
         * @param {number} value The minimum value.
         * @return {void}
         **/
        MinMax.prototype.setMin = function (value) {
            this._min = value;
            this.order();
        };
        /**
         * Get the max value.
         *
         * @method getMax
         * @return {number}
         **/
        MinMax.prototype.getMax = function () {
            return this._max;
        };
        /**
         * Set the max value.
         *
         * @method setMax
         * @param {number} value The maximum value.
         * @return {void}
         **/
        MinMax.prototype.setMax = function (value) {
            this._max = value;
            this.order();
        };
        /**
         * Limit a value between min and max.
         *
         * @method limit
         * @param {number} value The value limit.
         * @return {number}
         **/
        MinMax.prototype.limit = function (value) {
            if (value < this._min) {
                value = this._min;
            }
            else if (value > this._max) {
                value = this._max;
            }
            return value;
        };
        /**
         * Check if value is between min and max.
         *
         * @method contains
         * @param {number} value The value to check.
         * @return {boolean}
         **/
        MinMax.prototype.contains = function (value) {
            if (value < this._min || value > this._max) {
                return false;
            }
            return true;
        };
        MinMax.prototype.order = function () {
            if (this._min > this._max) {
                var tmp = this._min;
                this._min = this._max;
                this._max = tmp;
            }
            this._range = this._max - this._min; //always do this
        };
        return MinMax;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MinMax;
});
