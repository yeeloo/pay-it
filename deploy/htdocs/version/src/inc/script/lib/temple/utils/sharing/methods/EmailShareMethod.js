define(["require", "exports", '../../Browser'], function (require, exports, Browser_1) {
    /**
     * Sharing method to share a message via email. Will open a mailto: link to trigger
     * an email client.
     *
     * @author Floris Bernard
     * @class EmailShareMethod
     * @namespace temple.utils.sharing.methods.EmailShareMethod
     */
    var EmailShareMethod = (function () {
        function EmailShareMethod() {
            /**
             * Name for this sharing method
             */
            this.name = 'Email';
            /**
             * Unique ID for this sharing method
             */
            this.id = 'email';
        }
        /**
         * Sets window.location.href to a mailto: link to trigger the email client.
         * @param options An object containing options for the mailto link. See the
         * IEmailShareMethodOptions interface for detailed information on each parameter.
         * @returns {boolean} Returns true if a window.open call was executed.
         */
        EmailShareMethod.prototype.share = function (options) {
            var queryParamOptions = ['bcc', 'cc', 'text', 'title'];
            var queryParamKeys = ['bcc', 'cc', 'body', 'subject'];
            if (options['subject']) {
                queryParamOptions[3] = 'subject';
            }
            var queryString = '?' + queryParamOptions.
                map(function (option, index) {
                return options[option] == void (0) ?
                    null : queryParamKeys[index] + '=' + encodeURIComponent(options[option]);
            }).
                filter(function (queryParam) {
                return queryParam !== null;
            }).
                join('&');
            var mailTo = 'mailto:' + (options.to ? options.to : '') + queryString;
            if (Browser_1.default.platform == "ios" || true) {
                // iOS does not support window.open for mailto. Use a redirect
                window.location.href = mailTo;
            }
            else {
                // On other browsers, use window.open. This is to prevent a web mail client
                // (like gmail) replacing the current page instead of opening a new window.
                window.open(mailTo, '_blank', 'toolbar=0,status=0');
            }
            return true;
        };
        return EmailShareMethod;
    })();
    exports.EmailShareMethod = EmailShareMethod;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EmailShareMethod;
});
