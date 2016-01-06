define(["require", "exports"], function (require, exports) {
    /**
     * A collection of constants for date and time units.
     *
     * @module Temple
     * @namespace temple.utils
     * @class TimeUnit
     * @author Thijs Broerse
     */
    var TimeUnit = (function () {
        function TimeUnit() {
        }
        /**
         * A constant representing the year unit in date and time values.
         *
         * @static
         * @property YEAR
         * @type string
         * @default 'year'
         */
        TimeUnit.YEAR = 'year';
        /**
         * A constant representing the month unit in date and time values.
         *
         * @static
         * @property MONTH
         * @type string
         * @default 'month'
         */
        TimeUnit.MONTH = 'month';
        /**
         * A constant representing the day unit in date and time values.
         *
         * @static
         * @property DAY
         * @type string
         * @default 'day'
         */
        TimeUnit.DAY = 'day';
        /**
         * A constant representing the hours unit in date and time values.
         *
         * @static
         * @property HOURS
         * @type string
         * @default 'hours'
         */
        TimeUnit.HOURS = 'hours';
        /**
         * A constant representing the minutes unit in date and time values.
         *
         * @static
         * @property MINUTES
         * @type string
         * @default 'minutes'
         */
        TimeUnit.MINUTES = 'minutes';
        /**
         * A constant representing the seconds unit in date and time values.
         *
         * @static
         * @property SECONDS
         * @type string
         * @default 'seconds'
         */
        TimeUnit.SECONDS = 'seconds';
        /**
         * A constant representing the milliseconds unit in date and time values.
         *
         * @static
         * @property MILLISECONDS
         * @type string
         * @default 'milliseconds'
         */
        TimeUnit.MILLISECONDS = 'milliseconds';
        return TimeUnit;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TimeUnit;
});
