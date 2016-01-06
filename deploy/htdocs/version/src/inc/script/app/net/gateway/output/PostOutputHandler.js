define(["require", "exports"], function (require, exports) {
    /**
     * Formats the data according to the application/x-www-form-urlencoded spec, and the 'action' field is put in the request body.
     *
     * @class PostOutputHandler
     */
    var PostOutputHandler = (function () {
        function PostOutputHandler() {
        }
        /**
         * @method format
         * @param {string} action
         * @param {any} data
         * @param {IGatewayOptions} options
         * @returns {any} data
         */
        PostOutputHandler.prototype.format = function (action, data, options) {
            data['action'] = action;
            return data;
        };
        return PostOutputHandler;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PostOutputHandler;
});
