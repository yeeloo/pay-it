define(["require", "exports"], function (require, exports) {
    /**
     * Sharing method to create a Tumblr post using the Tumblr share endpoint.
     *
     * @author Floris Bernard
     * @class TumblrShareMethod
     * @namespace temple.utils.sharing.methods.TumblrShareMethod
     */
    var TumblrShareMethod = (function () {
        function TumblrShareMethod() {
            /**
             * Name for this sharing method
             */
            this.name = 'Tumblr Post Sharer';
            /**
             * Unique ID for this sharing method
             */
            this.id = 'tumblr';
        }
        /**
         * Opens an window for creating a new Tumblr post.
         * @param options An object containing options for the new post. See the
         * ITumblrShareMethodOptions interface for detailed information on each parameter.
         * @returns {boolean} Returns true if a window.open call was executed.
         */
        TumblrShareMethod.prototype.share = function (options) {
            var params = {};
            if (options.image || options.video) {
                // Sharing type is image
                params.posttype = options.image ? 'photo' : 'video';
                params.content = encodeURIComponent(options.image);
                params.canonicalUrl = encodeURIComponent(options.canonicalUrl || options.image || options.video);
                if (options.text) {
                    params.caption = encodeURIComponent(options.text);
                }
            }
            else if (options.isQuote) {
                params.posttype = 'quote';
                params.content = encodeURIComponent(options.text);
                params.caption = encodeURIComponent(options.source);
                params.canonicalUrl = encodeURIComponent(options.canonicalUrl || window.location.href);
            }
            else if (options.isChat) {
                params.posttype = 'chat';
                params.content = encodeURIComponent(options.text);
                params.title = encodeURIComponent(options.title);
                params.canonicalUrl = encodeURIComponent(options.canonicalUrl || window.location.href);
            }
            else if (options.url) {
                params.posttype = 'link';
                params.title = encodeURIComponent(options.title);
                params.content = encodeURIComponent(options.url);
                params.caption = encodeURIComponent(options.text);
                params.canonicalUrl = encodeURIComponent(options.canonicalUrl || options.url);
            }
            else {
                params.posttype = 'text';
                params.content = encodeURIComponent(options.text);
                params.title = encodeURIComponent(options.title);
                params.canonicalUrl = encodeURIComponent(options.canonicalUrl || window.location.href);
            }
            if (options.tags) {
                params.tags = options.tags.map(function (tag) {
                    return encodeURIComponent(tag);
                }).join(',');
            }
            var width = options.window_width || TumblrShareMethod.DEFAULT_WINDOW_WIDTH;
            var height = options.window_height || TumblrShareMethod.DEFAULT_WINDOW_HEIGHT;
            var urlParams = Object.keys(params).map(function (paramName) {
                return paramName + '=' + params[paramName];
            });
            window.open(TumblrShareMethod.SHARE_ENDPOINT_URL + '?' + urlParams.join('&'), 'tumblr-post-sharer', "toolbar=0,status=0,width=" + width + ",height=" + height);
            return true;
        };
        /**
         * URL for the Tumblr sharing endpoint
         */
        TumblrShareMethod.SHARE_ENDPOINT_URL = 'https://www.tumblr.com/widgets/share/tool';
        /**
         * Default width of the popup window that opens to create the post in pixels.
         */
        TumblrShareMethod.DEFAULT_WINDOW_WIDTH = 540;
        /**
         * Default height of the popup window that opens to create the post in pixels.
         */
        TumblrShareMethod.DEFAULT_WINDOW_HEIGHT = 600;
        return TumblrShareMethod;
    })();
    exports.TumblrShareMethod = TumblrShareMethod;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TumblrShareMethod;
});
