define(["require", "exports"], function (require, exports) {
    /**
     * Sharing method to share a story to a Facebook Feed using the Feed Dialog API. To use this method, you will need
     * to initialize the Facebook API with a valid app id. The user will need to login to the app before being able
     * to share.
     *
     * @author Floris Bernard
     * @class FacebookFeedShareMethod
     * @namespace temple.utils.sharing.methods.FacebookFeedShareMethod
     */
    var FacebookFeedShareMethod = (function () {
        /**
         * Constructor for this sharing method.
         * @param api The Facebook API to use. Usually this is the 'FB' object on window.
         */
        function FacebookFeedShareMethod(api) {
            this.api = api;
            /**
             * Name for this sharing method
             */
            this.name = 'Facebook Feed Dialog';
            /**
             * Unique ID for this sharing method
             */
            this.id = 'facebook-feed';
        }
        /**
         * Shares using the Facebook Feed Dialog API.
         * @param options An object containing options for the new post. See the
         * IFacebookFeedShareMethodOptions interface for detailed information on each parameter.
         * @returns {boolean}
         */
        FacebookFeedShareMethod.prototype.share = function (options) {
            var params = {
                to: 'to',
                link: 'url',
                picture: 'image',
                source: 'media',
                name: 'name',
                caption: 'caption',
                description: 'text'
            };
            var apiParams = Object.keys(params).filter(function (key) {
                return options[params[key]] != null;
            }).reduce(function (prev, current) {
                prev[current] = options[params[current]];
                return prev;
            }, { method: 'feed' });
            if (options.callback) {
                this.api.ui(apiParams, options.callback);
            }
            else {
                this.api.ui(apiParams);
            }
            return true;
        };
        return FacebookFeedShareMethod;
    })();
    exports.FacebookFeedShareMethod = FacebookFeedShareMethod;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FacebookFeedShareMethod;
});
