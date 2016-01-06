define(["require", "exports"], function (require, exports) {
    /**
     * Sharing method to create a Pinterest 'pin' for a url, description or image.
     *
     * @author Floris Bernard
     * @class PinterestShareMethod
     * @namespace temple.utils.sharing.methods.PinterestShareMethod
     */
    var PinterestShareMethod = (function () {
        function PinterestShareMethod() {
            /**
             * Name for this sharing method
             */
            this.name = 'Pinterest Pin It Sharer';
            /**
             * Unique ID for this sharing method
             */
            this.id = 'pinterest';
        }
        /**
         * Opens an window for creating a new Pinterest pin. The image parameter is required.
         * @param options An object containing options for the new pin. See the
         * IPinterestShareMethodOptions interface for detailed information on each parameter.
         * @returns {boolean} Returns true if a window.open call was executed.
         */
        PinterestShareMethod.prototype.share = function (options) {
            var params = ['text', 'url', 'image'];
            var paramNames = ['description', 'url', 'media'];
            var urlParams = [];
            if (!options.image) {
                console.error('Cannot share to Pinterest. An image url is required when sharing.');
                return false;
            }
            params.forEach(function (param, index) {
                if (typeof options[param] == 'string') {
                    var paramName = paramNames[index];
                    urlParams.push(paramName + '=' + encodeURIComponent(options[param]));
                }
            });
            var width = options.window_width || PinterestShareMethod.DEFAULT_WINDOW_WIDTH;
            var height = options.window_height || PinterestShareMethod.DEFAULT_WINDOW_HEIGHT;
            window.open(PinterestShareMethod.SHARE_ENDPOINT_URL + '?' + urlParams.join('&'), 'pinterest-pin-it-sharer', "toolbar=0,status=0,width=" + width + ",height=" + height);
            return true;
        };
        /**
         * URL for the Pinterest sharing endpoint
         */
        PinterestShareMethod.SHARE_ENDPOINT_URL = 'http://pinterest.com/pin/create/link/';
        /**
         * Default width of the popup window that opens to create the pin in pixels.
         */
        PinterestShareMethod.DEFAULT_WINDOW_WIDTH = 750;
        /**
         * Default height of the popup window that opens to create the pin in pixels.
         */
        PinterestShareMethod.DEFAULT_WINDOW_HEIGHT = 500;
        return PinterestShareMethod;
    })();
    exports.PinterestShareMethod = PinterestShareMethod;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PinterestShareMethod;
});
