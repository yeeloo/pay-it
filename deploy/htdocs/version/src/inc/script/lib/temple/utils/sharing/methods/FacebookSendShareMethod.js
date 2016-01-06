define(["require", "exports"], function (require, exports) {
    /**
     * Sharing method to share a link in a Facebook private message using the Send Dialog API. To use
     * this method, you will need to initialize the Facebook API with a valid app id. The user will
     * need to login to the app before being able to share.
     *
     * @author Floris Bernard
     * @class FacebookSendShareMethod
     * @namespace temple.utils.sharing.methods.FacebookSendShareMethod
     */
    var FacebookSendShareMethod = (function () {
        /**
         * Constructor for this sharing method.
         * @param api The Facebook API to use. Usually this is the 'FB' object on window.
         */
        function FacebookSendShareMethod(api) {
            this.api = api;
            /**
             * Name for this sharing method
             */
            this.name = 'Facebook Send Dialog';
            /**
             * Unique ID for this sharing method
             */
            this.id = 'facebook-send';
        }
        /**
         * Shares a url using the Facebook Send Dialog API. If no URL is provided,
         * fallback to the current window.location.href.
         * @param options An object containing options for the new post. See the
         * IFacebookSendShareMethodOptions interface for detailed information on each parameter.
         * @returns {boolean}
         */
        FacebookSendShareMethod.prototype.share = function (options) {
            var params = {
                link: options.url || window.location.href,
                method: 'send'
            };
            if (options.to) {
                params.to = options.to;
            }
            if (options.callback) {
                this.api.ui(params, options.callback);
            }
            else {
                this.api.ui(params);
            }
            return true;
        };
        return FacebookSendShareMethod;
    })();
    exports.FacebookSendShareMethod = FacebookSendShareMethod;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FacebookSendShareMethod;
});
