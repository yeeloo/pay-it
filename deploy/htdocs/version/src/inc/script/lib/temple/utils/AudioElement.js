var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './MediaElement'], function (require, exports, MediaElement_1) {
    /**
     * Base AudioElement to use as the base class for all audioElement related stuff
     *
     * @author Mient-jan Stelling
     *
     * @namespace temple.utils
     * @class AudioElement
     * @extends temple.utils.MediaElement
     */
    var AudioElement = (function (_super) {
        __extends(AudioElement, _super);
        /**
         * Base audioElement to use as the base class for all audioElement related stuff
         *
         * @class AudioElement
         * @constructor
         * @param element [AudioElement]
         */
        function AudioElement(element) {
            if (element === void 0) { element = null; }
            if (element == null) {
                // should be replaced with a more abstract version of the video Element.
                element = document.createElement('audio');
            }
            _super.call(this, element);
        }
        return AudioElement;
    })(MediaElement_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AudioElement;
});
