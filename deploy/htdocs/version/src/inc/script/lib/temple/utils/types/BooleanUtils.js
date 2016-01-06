define(["require", "exports"], function (require, exports) {
    /**
     * This class contains some utility functions for booleans.
     *
     * @module Temple
     * @namespace temple.utils.types
     * @class BooleanUtils
     * @author Thijs Broerse
     */
    var BooleanUtils = (function () {
        function BooleanUtils() {
        }
        /**
         * Attempts to convert an object to a native boolean.
         *
         * @method getBoolean
         * @static
         * @param {any} value The value to convert.
         * @returns {boolean}
         */
        BooleanUtils.getBoolean = function (value) {
            if (!value) {
                return false;
            }
            if (typeof value === 'object') {
                value = String(value);
            }
            if (typeof value === 'string') {
                value.toString().toLowerCase();
            }
            switch (value) {
                case true:
                case 'on':
                case 'true':
                case 'yes':
                case '1':
                case 1:
                    {
                        return true;
                    }
            }
            return false;
        };
        return BooleanUtils;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BooleanUtils;
});
