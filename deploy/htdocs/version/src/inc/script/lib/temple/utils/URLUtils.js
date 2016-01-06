define(["require", "exports", "lib/temple/utils/types/StringUtils"], function (require, exports, StringUtils_1) {
    /**
     * This class contains some functions for URLs.
     *
     * @module Temple
     * @namespace temple.utils
     * @class URLUtils
     * @author Thijs Broerse
     */
    var URLUtils = (function () {
        function URLUtils() {
        }
        /**
         * Provides the value of a specific query parameter.
         *
         * @method getParameter
         * @static
         * @param {string} url The url to get the parameter from.
         * @param {string} param Parameter name.
         * @return {string}
         */
        URLUtils.getParameter = function (url, param) {
            var index = url.indexOf('?');
            if (index != -1) {
                url = url.substr(index + 1);
                var params = url.split('&');
                var p;
                var i = params.length;
                while (i--) {
                    p = params[i].split('=');
                    if (p[0] == param) {
                        return decodeURIComponent(p[1]);
                    }
                }
            }
            return '';
        };
        /**
         * Checks if the URL contains a specific parameter
         *
         * @method hasParameter
         * @static
         * @param {string} url The url to check for the parameter.
         * @param {string} param Parameter name.
         * @return {boolean}
         */
        URLUtils.hasParameter = function (url, param) {
            return url.indexOf(param + '=') != -1;
        };
        /**
         * Add a parameter to the url
         *
         * @method addParameter
         * @static
         * @param {string} url The url to add the parameter to.
         * @param {string} param Parameter name.
         * @return {boolean}
         */
        URLUtils.addParameter = function (url, param, value) {
            return url + (url.indexOf('?') == -1 ? '?' : '&') + param + '=' + value;
        };
        /**
         * Set a parameter in the URL
         *
         * @method setParameter
         * @static
         * @param {string} url The url to add the parameter to.
         * @param {string} param The parameter to set.
         * @param {string} value The value of the parameter to set.
         * @return {string}
         */
        URLUtils.setParameter = function (url, param, value) {
            if (URLUtils.hasParameter(url, param)) {
                return url.replace(new RegExp('(' + param + '=)([^&]+)', 'g'), '$1' + value);
            }
            else {
                return URLUtils.addParameter(url, param, value);
            }
        };
        /**
         * Get the file extension of an URL
         *
         * @method getFileExtension
         * @static
         * @param {string} url The url to get the file extension from.
         * @return {string}
         */
        URLUtils.getFileExtension = function (url) {
            if (url == null) {
                return null;
            }
            if (url.indexOf('?') != -1) {
                url = StringUtils_1.default.beforeFirst(url, '?');
            }
            return StringUtils_1.default.afterLast(url, '.');
        };
        /**
         * Checks if a url is absolute (true) or relative (false)
         *
         * @method isAbsolute
         * @static
         * @param {string} url The url to get the file extension from.
         * @return {boolean}
         */
        URLUtils.isAbsolute = function (url) {
            return /^[\w-\.]*:/.test(url);
        };
        return URLUtils;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = URLUtils;
});
