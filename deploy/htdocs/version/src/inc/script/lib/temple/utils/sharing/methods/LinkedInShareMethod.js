define(["require", "exports"], function (require, exports) {
    /**
     * Sharing method to share an 'article' to LinkedIn
     *
     * @author Floris Bernard
     * @class LinkedInShareMethod
     * @namespace temple.utils.sharing.methods.LinkedInShareMethod
     */
    var LinkedInShareMethod = (function () {
        function LinkedInShareMethod() {
            /**
             * Name for this sharing method
             */
            this.name = 'LinkedIn Article Sharer';
            /**
             * Unique ID for this sharing method
             */
            this.id = 'linkedin';
        }
        /**
         * Opens an window for creating a new LinkedIn article.
         * @param options An object containing options for the new article. See the
         * ILinkedInShareMethodOptions interface for detailed information on each parameter.
         * @returns {boolean} Returns true if a window.open call was executed.
         */
        LinkedInShareMethod.prototype.share = function (options) {
            var url = options.url || window.location.href;
            var params = ['text', 'title', 'source'];
            var paramNames = ['summary', 'title', 'source'];
            var urlParams = ['mini=true', 'url=' + encodeURIComponent(url)];
            params.forEach(function (param, index) {
                if (typeof options[param] == 'string') {
                    var paramName = paramNames[index];
                    urlParams.push(paramName + '=' + encodeURIComponent(options[param]));
                }
            });
            var width = options.window_width || LinkedInShareMethod.DEFAULT_WINDOW_WIDTH;
            var height = options.window_height || LinkedInShareMethod.DEFAULT_WINDOW_HEIGHT;
            window.open(LinkedInShareMethod.SHARE_ENDPOINT_URL + '?' + urlParams.join('&'), 'linkedin-article-sharer', "toolbar=0,status=0,width=" + width + ",height=" + height);
            return true;
        };
        /**
         * URL for the LinkedIn sharing endpoint
         */
        LinkedInShareMethod.SHARE_ENDPOINT_URL = 'https://www.linkedin.com/shareArticle';
        /**
         * Default width of the popup window that opens to create the article in pixels.
         */
        LinkedInShareMethod.DEFAULT_WINDOW_WIDTH = 520;
        /**
         * Default height of the popup window that opens to create the article in pixels.
         */
        LinkedInShareMethod.DEFAULT_WINDOW_HEIGHT = 570;
        return LinkedInShareMethod;
    })();
    exports.LinkedInShareMethod = LinkedInShareMethod;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LinkedInShareMethod;
});
