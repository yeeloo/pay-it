define(["require", "exports"], function (require, exports) {
    var PointUtils = (function () {
        function PointUtils() {
        }
        /**
         * Returns the distance between p1 and p2.
         *
         * @method distance
         * @param {IPoint} pt1
         * @param {IPoint} pt2
         * @returns {number}
         */
        PointUtils.distance = function (p1, p2) {
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        };
        /**
         * Returns a new point between p1 and p2, based on a factor. When the factor is 0 the returning point will be the
         * same as p1. If the factor is 1 the returning point will be the same as p2. If the factor is 0.5, the returning
         * point will be in the middle of p1 and p2.
         *
         * @method interpolate
         * @param {IPoint} pt1
         * @param {IPoint} pt2
         * @param {number} factor
         * @returns {IPoint}
         */
        PointUtils.interpolate = function (p1, p2, factor) {
            return {
                x: p1.x + factor * (p2.x - p1.x),
                y: p1.y + factor * (p2.y - p1.y)
            };
        };
        return PointUtils;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PointUtils;
});
