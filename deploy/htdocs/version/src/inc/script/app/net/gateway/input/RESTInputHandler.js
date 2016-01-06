define(["require", "exports"], function (require, exports) {
    /**
     * @class RESTInputHandler
     */
    var RESTInputHandler = (function () {
        function RESTInputHandler() {
        }
        /**
         * The RestInputHandler follows the spec, so no formatting is needed.
         *
         * @method format
         * @param {any} data
         * @returns {any} data
         */
        RESTInputHandler.prototype.format = function (data) {
            return data;
        };
        return RESTInputHandler;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RESTInputHandler;
});
