define(["require", "exports", "./objectToString"], function (require, exports, objectToString_1) {
    /**
     * An object which uses the objectToString method when converted to a string.
     *
     * @module Temple
     * @namespace temple.core
     * @class CoreObject
     */
    var CoreObject = (function () {
        function CoreObject() {
        }
        /**
         * Convert the object to a string.
         *
         * @method toString
         * @returns {string}
         */
        CoreObject.prototype.toString = function () {
            return objectToString_1.default(this, this.toStringProps);
        };
        return CoreObject;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CoreObject;
});
