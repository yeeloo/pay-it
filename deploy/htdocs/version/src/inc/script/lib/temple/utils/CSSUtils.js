define(["require", "exports"], function (require, exports) {
    /**
     * Class for CSS utility function
     *
     * @class CSSUtils
     * @author Thijs Broerse
     */
    var CSSUtils = (function () {
        function CSSUtils() {
        }
        /**
         * Get the CSS Vendor prefixed property name for a specific property
         *
         * @param property the name of the un-prefixed property
         * @returns {string} the prefixed property name
         */
        CSSUtils.prefix = function (property) {
            if (CSSUtils._PROPERTIES[property] !== void 0) {
                return CSSUtils._PROPERTIES[property];
            }
            else if (CSSUtils._DIV.style[property] !== void 0) {
                return CSSUtils._PROPERTIES[property] = property;
            }
            else {
                for (var i = 0; i < CSSUtils._PREFIXES.length; i++) {
                    var prefixed = CSSUtils._PREFIXES[i] + property.charAt(0).toUpperCase() + property.substr(1);
                    if (CSSUtils._DIV.style[prefixed] !== void 0) {
                        return CSSUtils._PROPERTIES[property] = property = prefixed;
                    }
                }
            }
            if (DEBUG) {
                throw new Error("Property '" + property + "' not found");
            }
            return property;
        };
        /**
         * Set a specific CSS property on an element. It will prefix the property automatically if the property needs a vendor prefix.
         *
         * @param element
         * @param property
         * @param value
         */
        CSSUtils.set = function (element, property, value) {
            element.style[CSSUtils.prefix(property)] = value;
        };
        CSSUtils._PREFIXES = ['webkit', 'Moz', 'O', 'ms'];
        CSSUtils._PROPERTIES = {};
        CSSUtils._DIV = document.createElement('div');
        return CSSUtils;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CSSUtils;
});
