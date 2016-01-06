var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './MediaElement'], function (require, exports, MediaElement_1) {
    /**
     * Base VideoElement to use as the base class for all videoElement related stuff
     *
     * @namespace temple.utils
     * @class VideoElement
     * @extends temple.utils.MediaElement
     * @author Mient-jan Stelling
     */
    var VideoElement = (function (_super) {
        __extends(VideoElement, _super);
        /**
         * Base VideoElement to use as the base class for all videoElement related stuff
         *
         * @class VideoElement
         * @constructor
         * @param element [HTMLVideoElement]
         */
        function VideoElement(element) {
            if (element === void 0) { element = null; }
            if (element == null) {
                // should be replaced with a more abstract version of the video Element.
                element = document.createElement('video');
            }
            _super.call(this, element);
        }
        /**
         * Is a DOMString that reflects the width HTML attribute, which specifies the width of the display area, in CSS pixels.
         *
         * @method getWidth
         * @return number
         */
        VideoElement.prototype.getWidth = function () {
            return this.element.width;
        };
        Object.defineProperty(VideoElement.prototype, "width", {
            /**
             *
             * @property width {number}
             */
            get: function () {
                return this.getWidth();
            },
            /**
             * @property width {number}
             */
            set: function (value) {
                this.setWidth(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Is a DOMString that reflects the width HTML attribute, which specifies the width of the display area, in CSS pixels.
         *
         * @method setWidth
         * @param width {number}
         * @return void
         */
        VideoElement.prototype.setWidth = function (value) {
            this.element.width = value;
        };
        /**
         * Is a DOMString that reflects the height HTML attribute, which specifies the height of the display area, in CSS pixels.
         *
         * @method getHeight
         * @return number
         */
        VideoElement.prototype.getHeight = function () {
            return this.element.height;
        };
        Object.defineProperty(VideoElement.prototype, "height", {
            /**
             * @property height {number}
             */
            get: function () {
                return this.getHeight();
            },
            set: function (value) {
                this.setHeight(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Is a DOMString that reflects the height HTML attribute, which specifies the height of the display area, in CSS pixels.
         *
         * @method setHeight
         * @param value {number}
         * @return void
         */
        VideoElement.prototype.setHeight = function (value) {
            this.element.height = value;
        };
        /**
         * Returns an unsigned long containing the intrinsic width of the resource in CSS pixels, taking into account the dimensions,
         * aspect ratio, clean aperture, resolution, and so forth, as defined for the format used by the resource. If the element's
         * ready state is HAVE_NOTHING, the value is 0.
         *
         * @method getVideoWidth
         * @return number
         */
        VideoElement.prototype.getVideoWidth = function () {
            return this.element.videoWidth;
        };
        Object.defineProperty(VideoElement.prototype, "videoWidth", {
            /**
             * @property videoWidth {number}
             */
            get: function () {
                return this.getVideoWidth();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns an unsigned long containing the intrinsic height of the resource in CSS pixels, taking into account the
         * dimensions, aspect ratio, clean aperture, resolution, and so forth, as defined for the format used by the resource.
         * If the element's ready state is HAVE_NOTHING, the value is 0.
         *
         * @method getVideoHeight
         * @return number
         */
        VideoElement.prototype.getVideoHeight = function () {
            return this.element.videoHeight;
        };
        Object.defineProperty(VideoElement.prototype, "videoHeight", {
            /**
             * @property videoHeight {number}
             */
            get: function () {
                return this.element.videoHeight;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Is a DOMString that reflects the poster HTML attribute, which specifies an image to show while no video data is available.
         *
         * @method getPoster
         * @return string
         */
        VideoElement.prototype.getPoster = function () {
            return this.element.poster;
        };
        Object.defineProperty(VideoElement.prototype, "poster", {
            /**
             * @property poster {string}
             */
            get: function () {
                return this.getPoster();
            },
            set: function (value) {
                this.setPoster(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Is a DOMString that reflects the poster HTML attribute, which specifies an image to show while no video data is available.
         *
         * @method setPoster
         * @param value {string}
         * @return void
         */
        VideoElement.prototype.setPoster = function (value) {
            this.element.poster = value;
        };
        /**
         * This method is experimental
         *
         * @method getVideoPlaybackQuality
         * @returns {VideoPlaybackQuality}
         */
        VideoElement.prototype.getVideoPlaybackQuality = function () {
            return this.element['getVideoPlaybackQuality']();
        };
        return VideoElement;
    })(MediaElement_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VideoElement;
});
