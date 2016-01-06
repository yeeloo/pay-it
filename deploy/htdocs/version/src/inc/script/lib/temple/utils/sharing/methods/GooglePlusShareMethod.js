define(["require", "exports"], function (require, exports) {
    /**
     * Shares an url using the Google+ share endpoint
     *
     * @author Floris Bernard
     * @class GooglePlusShareMethod
     * @namespace temple.utils.sharing.methods.GooglePlusShareMethod
     */
    var GooglePlusShareMethod = (function () {
        function GooglePlusShareMethod() {
            /**
             * Name for this sharing method
             */
            this.name = 'Google+ share endpoint';
            /**
             * Unique ID for this sharing method
             */
            this.id = 'google-plus';
        }
        /**
         * Opens an window sharing a url using the Google+ share endpoint. If no URL is provided,
         * fallback to the current window.location.href.
         * @param options An object containing options for the Google Plus share. See the
         * IGooglePlusShareMethodOptions interface for detailed information on each parameter.
         * @returns {boolean} Returns true if a sharing window was opened.
         */
        GooglePlusShareMethod.prototype.share = function (options) {
            var url = options.url || window.location.href;
            var width = options.window_width || GooglePlusShareMethod.DEFAULT_WINDOW_WIDTH;
            var height = options.window_height || GooglePlusShareMethod.DEFAULT_WINDOW_HEIGHT;
            var shareUrl = GooglePlusShareMethod.SHARER_ENDPOINT_URL + '?url=' + encodeURIComponent(url);
            if (options.lang) {
                shareUrl += '&hl=' + options.lang;
            }
            window.open(shareUrl, 'google-plus-sharer', "toolbar=0,status=0,width=" + width + ",height=" + height);
            return true;
        };
        /**
         * URL to the share endpoint
         */
        GooglePlusShareMethod.SHARER_ENDPOINT_URL = 'https://plus.google.com/share';
        /**
         * Default height of the popup window with the share dialog.
         */
        GooglePlusShareMethod.DEFAULT_WINDOW_HEIGHT = 600;
        /**
         * Default width of the popup window with the share dialog.
         */
        GooglePlusShareMethod.DEFAULT_WINDOW_WIDTH = 600;
        return GooglePlusShareMethod;
    })();
    exports.GooglePlusShareMethod = GooglePlusShareMethod;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GooglePlusShareMethod;
});
