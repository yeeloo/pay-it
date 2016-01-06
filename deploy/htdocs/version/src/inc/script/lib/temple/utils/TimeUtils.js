define(["require", "exports", "lib/temple/utils/types/StringUtils"], function (require, exports, StringUtils_1) {
    /**
     * This class contains some functions for Time.
     *
     * @module Temple
     * @namespace temple.utils
     * @class TimeUtils
     * @author Thijs Broerse
     */
    var TimeUtils = (function () {
        function TimeUtils() {
        }
        /**
         * Convert a string to seconds, with these formats supported:
         * 00:03:00.1 / 03:00.1 / 180.1s / 3.2m / 3.2h / 00:01:53,800
         *
         * @method stringToSeconds
         * @static
         * @param {string} value The value to convert.
         * @param {string} [delimiter=':'] The delimiter to split the value on.
         * @return {number}
         **/
        TimeUtils.stringToSeconds = function (value, delimiter) {
            if (delimiter === void 0) { delimiter = ':'; }
            var arr = value.split(delimiter);
            var sec = 0;
            if (value.substr(-1) == 's') {
                sec = parseFloat(value.substr(0, value.length - 1));
            }
            else if (value.substr(-1) == 'm') {
                sec = parseFloat(value.substr(0, value.length - 1)) * 60;
            }
            else if (value.substr(-1) == 'h') {
                sec = parseFloat(value.substr(0, value.length - 1)) * 3600;
            }
            else if (arr.length > 1) {
                if (arr[2] && arr[2].toString().indexOf(',') != -1) {
                    arr[2] = arr[2].toString().replace(/\,/, '.');
                }
                sec = parseFloat(arr[arr.length - 1]);
                sec += parseFloat(arr[arr.length - 2]) * 60;
                if (arr.length == 3) {
                    sec += parseFloat(arr[arr.length - 3]) * 3600;
                }
            }
            else {
                sec = parseFloat(value);
            }
            return sec;
        };
        /**
         * Convert number to MIN:SS string.
         *
         * @method secondsToString
         * @static
         * @param {number} seconds The seconds to convert.
         * @param {string} [delimiter=':'] The delimiter to use.
         * @return {string}
         */
        TimeUtils.secondsToString = function (seconds, delimiter) {
            if (delimiter === void 0) { delimiter = ':'; }
            return StringUtils_1.default.padLeft(Math.floor(seconds / 60).toString(), 2, '0') + delimiter + StringUtils_1.default.padLeft(Math.floor(seconds % 60).toString(), 2, '0');
        };
        /**
         * Format milliseconds as mm:ss.mmm.
         *
         * @method formatTime
         * @static
         * @param {number} milliseconds The milliseconds to format.
         * @param {string} [delimiter=':'] The delimiter to use.
         * @return {string}
         */
        TimeUtils.formatTime = function (milliseconds, delimiter) {
            if (delimiter === void 0) { delimiter = ':'; }
            return StringUtils_1.default.padLeft(Math.floor(milliseconds / 60000).toString(), 2, '0') + delimiter + StringUtils_1.default.padLeft((Math.floor(milliseconds * .001) % 60).toString(), 2, '0') + '.' + StringUtils_1.default.padLeft((Math.round(Math.floor(milliseconds % 1000))).toString(), 3, '0');
        };
        /**
         * Format milliseconds as dd:hh:mm:ss.mmm.
         *
         * @method formatTime2
         * @static
         * @param {number} milliseconds The milliseconds to format.
         * @param {string} [delimiter=':'] The delimiter to use.
         * @return {string}
         */
        TimeUtils.formatTime2 = function (milliseconds, delimiter) {
            if (delimiter === void 0) { delimiter = ':'; }
            return StringUtils_1.default.padLeft((Math.floor(milliseconds / 86400000)).toString(), 2, '0') +
                delimiter + StringUtils_1.default.padLeft((Math.floor(milliseconds / 3600000) % 24).toString(), 2, '0') +
                delimiter + StringUtils_1.default.padLeft((Math.floor(milliseconds / 60000) % 60).toString(), 2, '0') +
                delimiter + StringUtils_1.default.padLeft((Math.floor(milliseconds * .001) % 60).toString(), 2, '0') +
                '.' + StringUtils_1.default.padLeft((Math.round(Math.floor(milliseconds % 1000))).toString(), 3, '0');
        };
        /**
         * Format milliseconds as mm:ss.
         *
         * @method formatMinutesSeconds
         * @static
         * @param {number} milliseconds The milliseconds to format.
         * @param {string} [delimiter=':'] The delimiter to use.
         * @return {string}
         */
        TimeUtils.formatMinutesSeconds = function (milliseconds, delimiter) {
            if (delimiter === void 0) { delimiter = ':'; }
            return StringUtils_1.default.padLeft(Math.floor(milliseconds / (60000)).toString(), 2, '0') + delimiter + StringUtils_1.default.padLeft((Math.floor(milliseconds / 1000) % 60).toString(), 2, '0');
        };
        /**
         * Format milliseconds as m:ss
         *
         * @method formatMinutesSecondsAlt
         * @static
         * @param {number} milliseconds The milliseconds to format.
         * @param {string} [delimiter=':'] The delimiter to use.
         * @return {string}
         */
        TimeUtils.formatMinutesSecondsAlt = function (milliseconds, delimiter) {
            if (delimiter === void 0) { delimiter = ':'; }
            return (Math.floor(milliseconds / 60000)).toString() + delimiter + StringUtils_1.default.padLeft((Math.floor(milliseconds / 1000) % 60).toString(), 2, '0');
        };
        return TimeUtils;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TimeUtils;
});
