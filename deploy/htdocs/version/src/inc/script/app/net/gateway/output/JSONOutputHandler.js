define(["require", "exports"], function (require, exports) {
    /**
     * Formats the request according to the Flash Gateway 'multipart/json' spec, where each key is a JSON formatted string.
     *
     * @class JSONOutputHandler
     */
    var JSONOutputHandler = (function () {
        function JSONOutputHandler() {
        }
        /**
         * @method format
         * @param {string} action
         * @param {any} data
         * @param {IGatewayOptions} options
         * @returns {any} data
         */
        JSONOutputHandler.prototype.format = function (action, data, options) {
            for (var key in data) {
                if (data.hasOwnProperty(key) && (typeof data[key] === 'object' || typeof data[key] === 'array')) {
                    data[key] = JSON.stringify(data[key]);
                }
            }
            options.url += (options.url.indexOf('?') != -1 ? '&' : '?') + 'action=' + action;
            return data;
        };
        return JSONOutputHandler;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = JSONOutputHandler;
});
