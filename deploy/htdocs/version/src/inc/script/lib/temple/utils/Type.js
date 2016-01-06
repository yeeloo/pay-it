define(["require", "exports"], function (require, exports) {
    /**
     * Type will return the following strings
     *
     *  - Type.STRING
     *  - Type.NAN
     *  - Type.NULL
     *  - Type.UNDEFINED
     *  - Type.NUMBER
     *  - Type.ARRAY
     *  - Type.ARGUMENTS
     *  - Type.ELEMENT
     *  - Type.TEXTNODE
     *  - Type.WHITESPACE
     *  - Type.FUNCTION
     *  - Type.BOOLEAN
     *  - Type.OBJECT
     *
     * @module Temple
     * @class Type
     * @namespace temple.utils
     * @param {any} item
     * @returns {string}
     * @constructor
     */
    var Type = function (value) {
        return Type.getType(value);
    };
    /**
     * @static
     * @property STRING
     * @type string
     * @default 'string'
     */
    Type.STRING = 'string';
    /**
     * @static
     * @property ARRAY
     * @type string
     * @default 'array'
     */
    Type.ARRAY = 'array';
    /**
     * @static
     * @property FUNCTION
     * @type string
     * @default 'function'
     */
    Type.FUNCTION = 'function';
    /**
     * @static
     * @property INTEGER
     * @type string
     * @default 'integer'
     */
    Type.INTEGER = 'integer';
    /**
     * @static
     * @property FLOAT
     * @type string
     * @default 'float'
     */
    Type.FLOAT = 'float';
    /**
     * @static
     * @property DATE
     * @type string
     * @default 'date'
     */
    Type.DATE = 'date';
    /**
     * @static
     * @property BOOLEAN
     * @type string
     * @default 'boolean'
     */
    Type.BOOLEAN = 'boolean';
    /**
     * @static
     * @property NAN
     * @type string
     * @default 'NaN'
     */
    Type.NAN = 'NaN';
    /**
     * @static
     * @property NULL
     * @type string
     * @default 'null'
     */
    Type.NULL = 'null';
    /**
     * @static
     * @property UNDEFINED
     * @type string
     * @default 'undefined'
     */
    Type.UNDEFINED = 'undefined';
    /**
     * @static
     * @property NUMBER
     * @type string
     * @default 'number'
     */
    Type.NUMBER = 'number';
    /**
     * @static
     * @property ARGUMENTS
     * @type string
     * @default 'arguments'
     */
    Type.ARGUMENTS = 'arguments';
    /**
     * @static
     * @property ELEMENT
     * @type string
     * @default 'element'
     */
    Type.ELEMENT = 'element';
    /**
     * @static
     * @property ARGUMENTS
     * @type TEXTNODE
     * @default 'textnode'
     */
    Type.TEXTNODE = 'textnode';
    /**
     * @static
     * @property WHITESPACE
     * @type string
     * @default 'whitespace'
     */
    Type.WHITESPACE = 'whitespace';
    /**
     * @static
     * @property OBJECT
     * @type string
     * @default 'object'
     */
    Type.OBJECT = 'object';
    Type.getType = function (value) {
        var valueTypeOf = typeof (value);
        if (valueTypeOf == 'string') {
            return Type.STRING;
        }
        if (valueTypeOf == 'boolean') {
            return Type.BOOLEAN;
        }
        if (Type.isNULL(value)) {
            return Type.NULL;
        }
        if (Type.isNaN(value)) {
            return Type.NAN;
        }
        if (valueTypeOf == 'number') {
            return Type.NUMBER;
        }
        if (valueTypeOf == void 0) {
            return Type.UNDEFINED;
        }
        if (typeof value.length == 'number') {
            if (Type.isArguments(value)) {
                return Type.ARGUMENTS;
            }
            if (Type.isArray(value)) {
                return Type.ARRAY;
            }
        }
        if (value.nodeName) {
            if (value.nodeType == 1) {
                return Type.ELEMENT;
            }
            if (value.nodeType == 3) {
                return (/\S/).test(value.nodeValue) ? Type.TEXTNODE : Type.WHITESPACE;
            }
        }
        if (Type.isFunction(value)) {
            return Type.FUNCTION;
        }
        if (Type.isDate(value)) {
            return Type.DATE;
        }
        if (Type.isObject(value)) {
            return Type.OBJECT;
        }
        throw new Error('unknown type ' + valueTypeOf);
    };
    /**
     * @method isString
     * @param {*} value
     * @returns {boolean}
     */
    Type.isString = function (value) {
        return typeof (value) == Type.STRING;
    };
    /**
     * Explicit checks if the value is NaN
     *
     * @method isNaN
     * @param value
     * @returns {boolean}
     */
    Type.isNaN = function (value) {
        return isNaN(value) && value != value;
    };
    /**
     * Checks if the value is a number
     *
     * @method isNumber
     * @param value
     * @returns {boolean}
     */
    Type.isNumber = function (value) {
        return !isNaN(value);
    };
    /**
     * Checks if the value is not a number
     *
     * @method isNotANumber
     * @param value
     * @returns {boolean}
     */
    Type.isNotANumber = function (value) {
        return isNaN(value);
    };
    /**
     * @method isElement
     * @param value
     * @returns {boolean}
     */
    Type.isElement = function (value) {
        return value.nodeType == 1;
    };
    /**
     * @method isTextNode
     * @param value
     * @returns {boolean}
     */
    Type.isTextNode = function (value) {
        return (value.nodeType == 3 && (/\S/).test(value.nodeValue));
    };
    /**
     * @method isWhiteSpace
     * @param value
     * @returns {boolean}
     */
    Type.isWhiteSpace = function (value) {
        return (value.nodeType == 3 && !(/\S/).test(value.nodeValue));
    };
    /**
     * @method isUndefined
     * @param value
     * @returns {boolean}
     */
    Type.isUndefined = function (value) {
        return value === void 0;
    };
    /**
     * @method isDefined
     * @param value
     * @returns {boolean}
     */
    Type.isDefined = function (value) {
        return value !== void 0;
    };
    /**
     * @method isArray
     * @param value
     * @returns {boolean}
     */
    Type.isArray = function (value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    };
    /**
     * @method isFunction
     * @param value
     * @returns {boolean}
     */
    Type.isFunction = function (value) {
        return value && {}.toString.call(value) === '[object Function]';
    };
    /**
     *
     * @method isBoolean
     * @param value
     * @returns {boolean}
     */
    Type.isBoolean = function (value) {
        return typeof value == Type.BOOLEAN;
    };
    /**
     *
     * @method isInteger
     * @param value
     * @returns {boolean}
     */
    Type.isInteger = function (value) {
        return parseInt(value) === value;
    };
    /**
     * Can check floating points 1.0 but have to do it with string
     * @method isFloat
     * @param value
     * @returns {boolean}
     */
    Type.isFloat = function (value) {
        if (Number(value) !== value) {
            return false;
        }
        return (String(value).indexOf('.') > -1);
    };
    /**
     *
     * @method isObject
     * @param value
     * @returns {boolean}
     */
    Type.isObject = function (value) {
        return typeof value == Type.OBJECT;
    };
    /**
     *
     * @method isPrimitive
     * @param value
     * @returns {boolean}
     */
    Type.isPrimitive = function (value) {
        switch (typeof value) {
            case Type.STRING:
            case Type.NUMBER:
            case Type.BOOLEAN:
                {
                    return true;
                }
            default:
                {
                    return false;
                }
        }
    };
    /**
     * @method isDate
     * @param value
     * @returns {boolean}
     */
    Type.isDate = function (value) {
        return !Type.isUndefined(value) && typeof value.getMonth === 'function';
    };
    /**
     * @method isArguments
     * @param value
     * @returns {boolean}
     */
    Type.isArguments = function (value) {
        return 'callee' in value;
    };
    /**
     * @method isNULL
     * @param value
     * @returns {boolean}
     */
    Type.isNULL = function (value) {
        return value === null;
    };
    /**
     * @method isNULL
     * @param value
     * @returns {boolean}
     */
    Type.is = function (value, type) {
        return value instanceof type;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Type;
});
