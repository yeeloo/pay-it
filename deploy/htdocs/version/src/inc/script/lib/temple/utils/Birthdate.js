define(["require", "exports"], function (require, exports) {
    /**
     * @class Birthdate
     * @namespace temple.utils
     */
    var Birthdate = (function () {
        function Birthdate(yearValueTimestampOrDate, month, day) {
            if (!isNaN(month) && !isNaN(day)) {
                this.year = yearValueTimestampOrDate;
                this.month = month + 1;
                this.day = day;
            }
            else {
                this.parse(yearValueTimestampOrDate);
            }
        }
        /**
         * Parse value to birthdate.
         *
         * @method parse
         * @param {any} value The value to parse.
         * @return {void}
         **/
        Birthdate.prototype.parse = function (value) {
            this.fromDate(value instanceof Date ? value : new Date(value));
        };
        /**
         * Convert Birthday to Date.
         *
         * @method toDate
         * @return {Date}
         **/
        Birthdate.prototype.toDate = function () {
            return new Date(this.year, this.month - 1, this.day);
        };
        /**
         * Convert Date to Birthdate.
         *
         * @method fromDate
         * @param {Date} date The date to convert.
         * @return {void}
         **/
        Birthdate.prototype.fromDate = function (date) {
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
            this.day = date.getDate();
        };
        /**
         * Convert Birthdate to JSON.
         *
         * @method toJSON
         * @return {string}
         **/
        Birthdate.prototype.toJSON = function () {
            return this.toString();
        };
        /**
         * Convert Birthdate to string.
         *
         * @method toString
         * @return {string}
         **/
        Birthdate.prototype.toString = function () {
            return (this.year < 100 ? "19" : "") + (this.year < 10 ? "0" : "") + this.year + "-" + (this.month < 10 ? "0" : "") + this.month + "-" + (this.day < 10 ? "0" : "") + this.day;
        };
        return Birthdate;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Birthdate;
});
