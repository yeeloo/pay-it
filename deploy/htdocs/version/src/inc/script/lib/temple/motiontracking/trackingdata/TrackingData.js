define(["require", "exports", "./Frame", "../../utils/types/RegExpUtils"], function (require, exports, Frame_1, RegExpUtils_1) {
    /**
     *
     * After Effects tracking data example:
     *
     * -------------------------------------
     * Adobe After Effects 8.0 Keyframe Data
     *
     * Units Per Second	25
     * Source Width	100
     * Source Height	100
     * Source Pixel Aspect Ratio	1
     * Comp Pixel Aspect Ratio	1
     *
     * Transform	Position
     *      Frame	X pixels	Y pixels	Z pixels
     *      0	662	233	0
     *      1	660.504	230.727	0
     *      2	660.211	229.105	0
     *      3	663.305	224.5	0
     *
     * End of Keyframe Data
     *
     * Transform	Position
     *      Frame	X pixels	Y pixels	Z pixels
     *      0	662	233	0
     *      1	660.504	230.727	0
     *      2	660.211	229.105	0
     *      3	663.305	224.5	0
     *
     * End of Keyframe Data
     * -------------------------------------
     *
     * Nuke tracking data example:
     *
     * @author Arjan van Wijk (arjan [at] mediamonks [dot] com)
     * @namespace temple.motiontracking.trackingdata
     * @class TrackingData
     *
     */
    var TrackingData = (function () {
        /**
         * Creates a new TrackingData instance and parses the data.
         * The data gets scaled and offsetted based on the sourceSize and destinationSize.
         *
         * @class TrackingData
         * @constructor
         *
         * @param {string} data trackingdata file contents (either AfterEffects or Nuke format)
         * @param {Rectangle} sourceSize Source dimentions for tracking data
         * @param {Rectangle} destinationSize Destination dimensions for tracking data
         */
        function TrackingData(data, sourceSize, destinationSize) {
            this._rawData = data;
            this._sourceSize = sourceSize;
            this._destinationSize = destinationSize;
            this.parse();
        }
        TrackingData.prototype.parse = function () {
            if (this._rawData.indexOf('{curve') != -1) {
                this.parseNuke();
            }
            else {
                this.parseAfterEffects();
            }
        };
        TrackingData.prototype.parseAfterEffects = function () {
            var regexp = /^\s(Frame)|(\d+?)\t(-?[\d\.]+?)\t(-?[\d\.]+?)(?:\t(-?[\d\.]+?))?\s?$/gim;
            // find all frames
            var results = RegExpUtils_1.default.pregMatchAll(regexp, this._rawData);
            this._pins = [];
            var pin;
            var len = results[0].length;
            for (var i = 0; i < len; i++) {
                // if we find a 'line' that starts with "Frame" we know this is a new pin
                if (results[1][i] == 'Frame') {
                    // create new pin
                    pin = [];
                    this._pins.push(pin);
                }
                else {
                    var frame = new Frame_1.default(results[2][i]);
                    frame.x = results[3][i] / this._sourceSize.width * this._destinationSize.width + this._destinationSize.x;
                    frame.y = results[4][i] / this._sourceSize.height * this._destinationSize.height + this._destinationSize.y;
                    frame.z = results[5][i] * 1;
                    // add frame for this pin
                    pin.length = frame.frame;
                    pin[results[2][i]] = frame;
                }
            }
        };
        TrackingData.prototype.parseNuke = function () {
            var regexp = /(curve)|(?:x(\d+))|\s(-?[\d\.]+)/gim;
            // find all frames
            var results = RegExpUtils_1.default.pregMatchAll(regexp, this._rawData);
            this._pins = [];
            var pin;
            var len = results[0].length;
            var keyframe = 0;
            var numCurves = -1;
            for (var i = 0; i < len; i++) {
                // if we find a 'curve' a new x/y pin is found
                if (results[1][i] == 'curve') {
                    ++numCurves;
                    if (numCurves % 2 == 0) {
                        // create new pin
                        pin = [];
                        this._pins.push(pin);
                    }
                    keyframe = 0;
                }
                else if (results[2][i]) {
                    keyframe = results[2][i];
                }
                else {
                    if (numCurves % 2 == 0) {
                        var frame = new Frame_1.default(keyframe);
                        frame.x = results[3][i] / this._sourceSize.width * this._destinationSize.width + this._destinationSize.x;
                        // add frame for this pin
                        pin.length = frame.frame;
                        pin[keyframe] = frame;
                    }
                    else {
                        frame = pin[keyframe];
                        frame.y = results[3][i] / this._sourceSize.height * this._destinationSize.height;
                        // flip nuke coordinates
                        frame.y = -frame.y + this._destinationSize.height + this._destinationSize.y;
                    }
                    ++keyframe;
                }
            }
        };
        /**
         * Gets the number of pins
         *
         * @method getNumPins
         * @returns {number}
         */
        TrackingData.prototype.getNumPins = function () {
            return this._pins.length;
        };
        /**
         * Gets the (max) number of frames
         *
         * @method getNumFrames
         * @returns {number}
         */
        TrackingData.prototype.getNumFrames = function () {
            var max = 0;
            for (var i = 0; i < this._pins.length; ++i) {
                max = Math.max(max, this._pins[i].length);
            }
            return max;
        };
        /**
         * Gets framenumber of the first frame in the trackingdata
         *
         * @method getStartFrame
         * @returns {number}
         */
        TrackingData.prototype.getStartFrame = function () {
            var start = 0;
            for (var i = 0; i < this._pins[0].length; ++i) {
                if (!this._pins[0][i]) {
                    start = i + 1;
                }
                else {
                    break;
                }
            }
            return start;
        };
        /**
         * Gets the frame data for a given frame from a given pin.
         *
         * @method getFrameForPin
         * @param pinIndex {number} The pin
         * @param frameIndex {number} The frame number for the pin
         * @returns {number}
         */
        TrackingData.prototype.getFrameForPin = function (pinIndex, frameIndex) {
            if (frameIndex < 0)
                frameIndex = 0;
            var pin = this._pins[pinIndex];
            if (frameIndex in pin)
                return pin[frameIndex];
            return this.findFrame(pin, frameIndex);
        };
        /**
         * Fills in framedata for empty frames.
         *
         * @method fixEmptyFrames
         */
        TrackingData.prototype.fixEmptyFrames = function () {
            for (var i = 0; i < this._pins.length; i++) {
                for (var j = 0; j < this._pins[i].length; j++) {
                    var pin = this._pins[i];
                    if (!(j in pin) || !pin[j]) {
                        pin[j] = this.findFrame(pin, j);
                        console.info('fix: ' + [i, j]);
                    }
                }
            }
        };
        TrackingData.prototype.findFrame = function (pin, frameIndex) {
            // if there is no frame at this point look for previous frames
            while ((!(frameIndex in pin) || !pin[frameIndex]) && frameIndex > 0) {
                --frameIndex;
            }
            // if we have no previous frames, look for next frames
            if (frameIndex == 0 && (!(frameIndex in pin) || !pin[frameIndex])) {
                while ((!(frameIndex in pin) || !pin[frameIndex]) && frameIndex < pin.length - 1) {
                    ++frameIndex;
                }
            }
            // if we didn't find any frame in this pin (should never happen)
            if (!(frameIndex in pin)) {
                return null;
            }
            return pin[frameIndex];
        };
        return TrackingData;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TrackingData;
});
