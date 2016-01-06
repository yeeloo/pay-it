define(["require", "exports"], function (require, exports) {
    /**
     * @author Arjan van Wijk (arjan [at] mediamonks [dot] com)
     * @namespace temple.motiontracking.trackingdata
     * @class TrackingDataInfo
     */
    var TrackingDataInfo = (function () {
        /**
         * TrackingDataInfo
         *
         * @class TrackingDataInfo
         * @constructor
         * @param {string} id
         * @param {number} firstFrame
         */
        function TrackingDataInfo(id, firstFrame) {
            this.id = id;
            this.firstFrame = firstFrame;
        }
        return TrackingDataInfo;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TrackingDataInfo;
});
