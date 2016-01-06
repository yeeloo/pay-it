define(["require", "exports"], function (require, exports) {
    /**
     * Formats the data according to the MediaMonks REST API spec, where the action is appended to the base-url.
     *
     * @class RESTOutputHandler
     */
    var RESTOutputHandler = (function () {
        function RESTOutputHandler() {
        }
        /**
         * @method format
         * @param {string} action
         * @param {any} data
         * @param {IGatewayOptions} options
         * @returns {any} data
         */
        RESTOutputHandler.prototype.format = function (action, data, options) {
            options.url += action;
            return data;
        };
        return RESTOutputHandler;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RESTOutputHandler;
});
