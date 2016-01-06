define(["require", "exports"], function (require, exports) {
    /**
     * @namespace gaia.router
     * @class GaiaRouteStringifier
     */
    var GaiaRouteStringifier = (function () {
        /**
         * @class GaiaRouteStringifier
         * @constructor
         * @param {string} name
         * @param {Function} callback
         */
        function GaiaRouteStringifier(name, callback) {
            this.name = name;
            this.callback = callback;
        }
        return GaiaRouteStringifier;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GaiaRouteStringifier;
});
