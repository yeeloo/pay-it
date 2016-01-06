define(["require", "exports"], function (require, exports) {
    /**
     * Shares an url using Facebook's (officially deprecated) sharer.php
     *
     * @author Floris Bernard
     * @class FacebookSharerShareMethod
     * @namespace temple.utils.sharing.methods.FacebookSharerShareMethod
     */
    var FacebookSharerShareMethod = (function () {
        function FacebookSharerShareMethod() {
            /**
             * Name for this sharing method
             */
            this.name = 'Facebook sharer.php';
            /**
             * Unique ID for this sharing method
             */
            this.id = 'facebook';
        }
        /**
         * Opens an window sharing a url with the facebook sharer.php api. If no URL is provided,
         * fallback to the current window.location.href.
         * @param options An object containing options for the Facebook share. See the
         * IFacebookSharerShareMethodOptions interface for detailed information on each parameter.
         * @returns {boolean} Returns true if a sharing window was opened.
         */
        FacebookSharerShareMethod.prototype.share = function (options) {
            var url = options.url || window.location.href;
            var width = options.window_width || FacebookSharerShareMethod.DEFAULT_WINDOW_WIDTH;
            var height = options.window_height || FacebookSharerShareMethod.DEFAULT_WINDOW_HEIGHT;
            window.open(FacebookSharerShareMethod.SHARER_API_URL + '?u=' + encodeURIComponent(url), 'facebook-sharer', "toolbar=0,status=0,width=" + width + ",height=" + height);
            return true;
        };
        /**
         * URL to the sharer.php api
         */
        FacebookSharerShareMethod.SHARER_API_URL = 'https://www.facebook.com/sharer/sharer.php';
        /**
         * Default height of the popup window with the share dialog.
         */
        FacebookSharerShareMethod.DEFAULT_WINDOW_HEIGHT = 450;
        /**
         * Default width of the popup window with the share dialog.
         */
        FacebookSharerShareMethod.DEFAULT_WINDOW_WIDTH = 690;
        return FacebookSharerShareMethod;
    })();
    exports.FacebookSharerShareMethod = FacebookSharerShareMethod;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FacebookSharerShareMethod;
});
