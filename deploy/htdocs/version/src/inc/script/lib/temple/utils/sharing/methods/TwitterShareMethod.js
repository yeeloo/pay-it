define(["require", "exports"], function (require, exports) {
    /**
     * Sharing method that uses a Twitter Tweet Web Intent to create a new tweet. See the
     * [Twitter documentation](https://dev.twitter.com/web/tweet-button/web-intent "Twitter Documentation")
     * for more info.
     *
     * @author Floris Bernard
     * @class TwitterShareMethod
     * @namespace temple.utils.sharing.methods.TwitterShareMethod
     */
    var TwitterShareMethod = (function () {
        function TwitterShareMethod() {
            /**
             * Name for this sharing method
             */
            this.name = 'Twitter Tweet Intent';
            /**
             * Unique ID for this sharing method
             */
            this.id = 'twitter';
        }
        /**
         * Opens an window executing a Twitter Tweet Web Intent
         * @param options An object containing options for the tweet intent. See the
         * ITwitterShareMethodOptions interface for detailed information on each parameter.
         * @returns {boolean} Returns true if a window.open call was executed.
         */
        TwitterShareMethod.prototype.share = function (options) {
            var stringParams = ['text', 'url', 'inReplyTo', 'via', 'lang'];
            var listParams = ['hashtags', 'related'];
            var urlParams = [];
            stringParams.forEach(function (param) {
                if (typeof options[param] == 'string') {
                    var paramName = param == 'inReplyTo' ? 'in-reply-to' : param;
                    urlParams.push(paramName + '=' + encodeURIComponent(options[param]));
                }
            });
            listParams.forEach(function (param) {
                if (typeof options[param] != 'undefined') {
                    urlParams.push(param + '=' + options[param].map(function (value) {
                        return encodeURIComponent(value);
                    }).join(','));
                }
            });
            var width = options.window_width || TwitterShareMethod.DEFAULT_WINDOW_WIDTH;
            var height = options.window_height || TwitterShareMethod.DEFAULT_WINDOW_HEIGHT;
            window.open(TwitterShareMethod.WEB_INTENT_URL + '?' + urlParams.join('&'), 'twitter-tweet-intent', "toolbar=0,status=0,width=" + width + ",height=" + height);
            return true;
        };
        /**
         * URL for the Twitter Tweet Web Intent
         */
        TwitterShareMethod.WEB_INTENT_URL = 'https://twitter.com/intent/tweet';
        /**
         * Default height of the popup window that opens to create the tweet in pixels.
         */
        TwitterShareMethod.DEFAULT_WINDOW_HEIGHT = 450;
        /**
         * Default width of the popup window that opens to create the tweet in pixels.
         */
        TwitterShareMethod.DEFAULT_WINDOW_WIDTH = 690;
        return TwitterShareMethod;
    })();
    exports.TwitterShareMethod = TwitterShareMethod;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TwitterShareMethod;
});
