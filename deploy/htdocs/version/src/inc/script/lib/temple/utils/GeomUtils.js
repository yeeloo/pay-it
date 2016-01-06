define(["require", "exports"], function (require, exports) {
    /**
     * GeomUtils
     *
     * @module Temple
     * @namespace temple.utils
     * @class GeomUtils
     * @author Thijs Broerse
     */
    var GeomUtils = (function () {
        function GeomUtils() {
        }
        /**
         * Converts an angle from radians to degrees.
         *
         * __WARNING: this is MUCH slower than the actual calculation : "radians / Math.PI * 180"__
         *
         * @static
         * @method radiansToDegrees
         * @param {number} radians The angle in radians
         * @return The angle in degrees
         */
        GeomUtils.radiansToDegrees = function (radians) {
            return radians * GeomUtils.RAD2DEG;
        };
        /**
         * Converts an angle from degrees to radians.
         *
         * __WARNING: this is MUCH slower than the actual calculation : "degrees / 180 * Math.PI"__
         *
         * @static
         * @method degreesToRadians
         * @param {number} degrees The angle in degrees
         * @return {number} The angle in radians
         */
        GeomUtils.degreesToRadians = function (degrees) {
            return degrees * GeomUtils.DEG2RAD;
        };
        /**
         * @property RAD2DEG
         * @static
         * @type number
         */
        GeomUtils.RAD2DEG = 180 / Math.PI;
        /**
         * @property DEG2RAD
         * @static
         * @type number
         */
        GeomUtils.DEG2RAD = Math.PI / 180;
        return GeomUtils;
    })();
    return GeomUtils;
});
