define(["require", "exports"], function (require, exports) {
    /**
     * Converts an object to a readable string with the following format:
     *
     * [Class property="value" property=numberValue]
     *
     * @module Temple
     * @namespace temple.core
     * @method objectToString
     * @param {any} object the object that must be turned into a string
     * @param {Array<string>} props a list of properties on the object that must be included in the returning string.
     * @returns {string}
     */
    function objectToString(object, props) {
        if (props === void 0) { props = null; }
        var MAX_VALUE_LENGTH = 80;
        if (object === void 0 || object === null)
            return object;
        var str = object.constructor.name;
        if (props && props.length) {
            str += " (";
            var sep = "", value;
            for (var i = 0, leni = props.length; i < leni; i++) {
                var prop = props[i];
                if (object[prop] !== void 0) {
                    value = object[prop];
                    str += sep + prop + "=";
                    if (typeof value == "string" && value !== null) {
                        // remove new lines
                        var s = value.split("\r").join(" ").split("\n").join(" ");
                        // limit length
                        if (s.length > MAX_VALUE_LENGTH)
                            s = s.substr(0, MAX_VALUE_LENGTH) + "[...]";
                        str += "\"" + s + "\"";
                    }
                    else {
                        str += value;
                    }
                    sep = " ";
                }
            }
            str += ")";
        }
        return "[" + str + "]";
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = objectToString;
});
