define(["require", "exports"], function (require, exports) {
    /**
     * @author Arjan van Wijk (arjan [at] mediamonks [dot] com)
     * @namespace temple.motiontracking.trackingdata
     * @class Frame
     */
    var Frame = (function () {
        /**
         * Frame
         *
         * @class Frame
         * @constructor
         * @param {number} frame
         * @param {number} x
         * @param {number} y
         * @param {number} z
         */
        function Frame(frame, x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.frame = frame;
            this.x = x;
            this.y = y;
            this.z = z;
        }
        /**
         * @method toString
         * @returns {string}
         */
        Frame.prototype.toString = function () {
            return "[Frame (frame=" + this.frame + ", x=" + this.x + ", y=" + this.y + ", z=" + this.z + ")]";
        };
        return Frame;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Frame;
});
