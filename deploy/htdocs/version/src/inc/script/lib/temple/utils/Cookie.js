define(["require", "exports"], function (require, exports) {
    var pluses = /\+/g;
    function raw(s) {
        return s;
    }
    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }
    var defaultCookieOptions = {};
    /**
     * See https://github.com/carhartl/jquery-cookie
     *
     * @module Temple
     * @namespace temple.utils
     * @class Cookie
     */
    var Cookie = (function () {
        function Cookie() {
        }
        /**
         * Returns a string of the cookie, or object if JSON is enabled in the options
         *
         * @method get
         * @static
         * @param {string} key
         * @param {ICookieOptions} options
         * @returns {string|object}
         */
        Cookie.get = function (key, options) {
            if (options === void 0) { options = defaultCookieOptions; }
            var decode = options.raw ? raw : decoded;
            var cookies = document.cookie.split('; ');
            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split('=');
                if (decode(parts.shift()) === key) {
                    var cookie = decode(parts.join('='));
                    return options.json ? JSON.parse(cookie) : cookie;
                }
            }
        };
        Cookie.set = function (key, value, options) {
            if (options === void 0) { options = defaultCookieOptions; }
            // write
            if (value !== undefined) {
                options = $.extend({}, defaultCookieOptions, options);
                if (typeof options.expires === 'number') {
                    var days = options.expires;
                    var t = options.expires = new Date();
                    t.setDate(t.getDate() + days);
                }
                value = options.json ? JSON.stringify(value) : String(value);
                document.cookie = [
                    encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + (value == null ? -1 : options.expires.toUTCString()) : '',
                    options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''
                ].join('');
            }
        };
        Cookie.remove = function (key) {
            if (Cookie.get(key) != void 0) {
                var expires = new Date();
                expires.setFullYear(1970);
                Cookie.set(key, null, {
                    expires: expires
                });
            }
        };
        return Cookie;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Cookie;
});
