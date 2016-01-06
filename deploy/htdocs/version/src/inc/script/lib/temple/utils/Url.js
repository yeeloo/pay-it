/**
 * @module Temple
 * @namespace temple.utils
 * @class Url
 * @author Thijs Broerse
 */
define(["require", "exports"], function (require, exports) {
    var Url = (function () {
        /**
         * Class for easy creating and manipulating Urls.
         *
         * Syntax:
         *
         * ```html
         * protocol:(//)domain(|port)/path?query#hash
         * ```
         *
         * or
         *
         * ```html
         * protocol:username:password(at)domain(|port)/path?query#hash
         * ```
         *
         * [see](http://en.wikipedia.org/wiki/Uniform_resource_locator)
         *
         * @class Url
         * @constructor
         * @param {string} [href=null] The href to convert to Url.
         */
        function Url(href) {
            if (href === void 0) { href = null; }
            if (href) {
                this.setHref(href);
            }
        }
        /**
         * The full string of the Url.
         *
         * @method getHref
         * @return {string}
         */
        Url.prototype.getHref = function () {
            if (this._protocol == Url.MAILTO) {
                return this.getScheme() + this.getEmail();
            }
            var href = this.getScheme() || "";
            var auth = this.getAuthentication();
            if (auth) {
                href += auth + "@";
            }
            if (this._domain) {
                href += this._domain;
            }
            if (this._port) {
                href += ":" + this._port;
            }
            if (this._path) {
                href += this._path;
            }
            var query = this.getQuery();
            if (query) {
                href += "?" + query;
            }
            if (this._hashList) {
                href += "#" + this.getHash();
            }
            return href;
        };
        /**
         * Set the href.
         *
         * @method setHref
         * @param {string} value The href to set.
         * @return {void}
         */
        Url.prototype.setHref = function (value) {
            this._protocol = null;
            this._domain = null;
            this._port = 0;
            this._path = null;
            this._variables = null;
            this._hashList = null;
            this._username = null;
            this._password = null;
            if (value) {
                var temp = value.split('#');
                this.setHash(temp[1]);
                temp = temp[0].toString().split('?');
                this.setQuery(temp[1]);
                var href = temp[0];
                if (href.indexOf(":") != -1) {
                    this._protocol = href.split(":")[0];
                }
                if (this._protocol) {
                    href = href.substr(this._protocol.length + 1);
                    if (href.substr(0, 2) == "//") {
                        href = href.substr(2);
                    }
                }
                if (this._protocol == Url.MAILTO) {
                    this.setEmail(href);
                }
                else if (this._protocol) {
                    var slash = href.indexOf("/");
                    if (slash != -1) {
                        this._domain = href.substr(0, slash);
                        this._path = href.substr(slash);
                    }
                    else {
                        this._domain = href;
                        this._path = null;
                    }
                    if (this._domain.indexOf("@") != -1) {
                        temp = this._domain.split("@");
                        this.setAuthentication(temp[0]);
                        this._domain = temp[1];
                    }
                    if (this._domain.indexOf(":") != -1) {
                        temp = this._domain.split(":");
                        this._domain = temp[0];
                        this._port = temp[1];
                    }
                }
                else {
                    this._domain = null;
                    this._path = href || null;
                    this._port = 0;
                }
            }
        };
        /**
         * The protocol of the Url.
         *
         * ```html
         * http
         * ftp
         * https
         * mailto
         * ```
         *
         * @method getProtocol
         * @return {string}
         */
        Url.prototype.getProtocol = function () {
            return this._protocol;
        };
        /**
         * Set protocol of the Url.
         *
         * @method setProtocol
         * @param {string} value The protocol to set.
         * @return {Url}
         */
        Url.prototype.setProtocol = function (value) {
            this._protocol = value;
            return this;
        };
        /**
         * Domain of the Url.
         *
         * @method getDomain
         * @return {string}
         */
        Url.prototype.getDomain = function () {
            return this._domain;
        };
        /**
         * Set the domain of the Url.
         *
         * @method setDomain
         * @param {string} value The domain to set.
         * @return {Url}
         */
        Url.prototype.setDomain = function (value) {
            this._domain = value;
            return this;
        };
        /**
         * The port of the Url.
         *
         * 0 means no port.
         *
         * @method getPort
         * @return {number}
         */
        Url.prototype.getPort = function () {
            return this._port;
        };
        /**
         * Set the port of the Url.
         *
         * @method setPort
         * @param {number} value The port to set.
         * @return {Url}
         * */
        Url.prototype.setPort = function (value) {
            this._port = value;
            return this;
        };
        /**
         * The path of the Url.
         *
         * @method getPath
         * @return {string}
         */
        Url.prototype.getPath = function () {
            return this._path;
        };
        /**
         *  Set the path of the Url.
         *
         * @method setPath
         * @param {string} value The path to set.
         * @return {void}
         */
        Url.prototype.setPath = function (value) {
            this._path = value;
        };
        /**
         * The variables of the Url.
         *
         * @method getVariables
         * @return {any}
         */
        Url.prototype.getVariables = function () {
            return this._variables;
        };
        /**
         * Set the variables of the Url.
         *
         * @method setVariables
         * @param {any} value The variables to set.
         * @return {any}
         */
        Url.prototype.setVariables = function (value) {
            this._variables = value;
        };
        /**
         * Checks if the Url has a variable.
         *
         * @method hasVariable
         * @param {string} name The name to check.
         * @return {boolean}
         */
        Url.prototype.hasVariable = function (name) {
            return this._variables && this._variables.hasOwnProperty(name);
        };
        /**
         * Get a variable of the Url.
         *
         * @method getVariable
         * @param {string} name The name of the variable to get.
         * @return {any}
         */
        Url.prototype.getVariable = function (name) {
            return this._variables ? this._variables[name] : null;
        };
        /**
         * Set a variable on the Url.
         *
         * @method setVariable
         * @param {string} name The name of the variable to set.
         * @param {any} value The value of the variable to set.
         * @return {Url}
         */
        Url.prototype.setVariable = function (name, value) {
            if (!this._variables) {
                this._variables = {};
            }
            this._variables[name] = value;
            return this;
        };
        /**
         * Removes a variable from the Url.
         *
         * @method deleteVariable
         * @param {string} name The name of the variable to remove.
         * @return {void}
         */
        Url.prototype.deleteVariable = function (name) {
            delete this._variables[name];
        };
        /**
         * Name/value paired string, which comes after the question sign ('?').
         *
         * ```html
         * http://www.domain.com/index.html?lorem=ipsum&amp;dolor=sit&amp;amet=consectetur
         * ```
         *
         * @method getQuery
         * @return {string}
         */
        Url.prototype.getQuery = function () {
            if (this._variables) {
                var query = '';
                for (var i in this._variables) {
                    if (this._variables.hasOwnProperty(i)) {
                        if (query.length > 0) {
                            query += '&';
                        }
                        query += i + '=' + this._variables[i];
                    }
                }
                return query;
            }
            return null;
        };
        /**
         * Set Name/value paired strings, which comes after the question sign ('?').
         *
         * ```html
         * http://www.domain.com/index.html?lorem=ipsum&amp;dolor=sit&amp;amet=consectetur
         * ```
         *
         * @method setQuery
         * @param {string} value The query to set.
         * @return {void}
         */
        Url.prototype.setQuery = function (value) {
            if (!value) {
                this._variables = null;
            }
            else {
                try {
                    this._variables = {};
                    var variables = value.split('&');
                    var variable;
                    for (var i = 0; i < variables.length; i++) {
                        variable = variables[i].split('=');
                        if (variable.length > 1) {
                            this._variables[variable[0]] = variable[1];
                        }
                        else {
                            this._variables[variable[0]] = '';
                        }
                    }
                }
                catch (error) {
                }
            }
        };
        /**
         * The value after the hash (#).
         *
         * ```html
         * #hash
         * ```
         *
         * @method getHash
         * @return {string}
         */
        Url.prototype.getHash = function () {
            var length = this._hashList ? this._hashList.length : 0;
            if (!length) {
                return null;
            }
            else if (length == 1) {
                return this._hashList[0];
            }
            else {
                var hash = '';
                for (var i = 0; i < length; i++) {
                    hash += '/' + (this._hashList[i] || '-');
                }
                return hash;
            }
        };
        /**
         * Set the hash of the Url.
         *
         * @method setHash
         * @param {string} value The hash to set.
         * @return {Url}
         */
        Url.prototype.setHash = function (value) {
            if (value) {
                if (value.charAt(0) == "/") {
                    value = value.substr(1);
                }
                this._hashList = value.split("/");
            }
            else {
                this._hashList = null;
            }
            return this;
        };
        /**
         * List of the elements of the hash (splitted by '/').
         *
         * @method getHashList
         * @return {any[]}
         */
        Url.prototype.getHashList = function () {
            return this._hashList;
        };
        /**
         * Returns a part of the hash.
         *
         * @method getHashPart
         * @param {number} value The hash part to get.
         * @return {string}
         */
        Url.prototype.getHashPart = function (index) {
            return index < this._hashList.length ? this._hashList[index] : null;
        };
        /**
         * Set one part of the hash.
         *
         * @method setHashPart
         * @param {number} value The hash part to set.
         * @param {string} value The value of the hash part to set.
         * @return {Url}
         */
        Url.prototype.setHashPart = function (index, value) {
            this._hashList = this._hashList ? this._hashList : new Array(index + 1);
            if (index >= this._hashList.length) {
                this._hashList.length = index + 1;
            }
            this._hashList[index] = value;
            return this;
        };
        /**
         * A Boolean which indicates if this is an absolute Url.
         *
         * ```html
         * http://www.domain.com/index.html
         * ```
         *
         * @method isAbsolute
         * @return {boolean}
         */
        Url.prototype.isAbsolute = function () {
            return this._protocol != null;
        };
        /**
         * A Boolean which indicates if this is a relative Url.
         *
         *```
         *  /index.html#value/1
         *```
         * @method isRelative
         * @return {boolean}
         */
        Url.prototype.isRelative = function () {
            return this._protocol == null;
        };
        /**
         * A Boolean which indicates if this is a secure Url.
         *
         * Only https and sftp are secure.
         *
         * @method isSecure
         * @return {boolean}
         */
        Url.prototype.isSecure = function () {
            return this._protocol == Url.HTTPS || this._protocol == Url.SFTP;
        };
        /**
         * The postfix for a Url, including protocol, : and (if needed) slashes.
         *
         * ```html
         * http://
         * ftp://
         * mailto:
         * ```
         *
         * @method getScheme
         * @return {string}
         */
        Url.prototype.getScheme = function () {
            switch (this._protocol) {
                case null:
                    return null;
                case Url.HTTP:
                case Url.HTTPS:
                case Url.FTP:
                case Url.SFTP:
                case Url.FILE:
                    return this._protocol + '://';
                case Url.MAILTO:
                default:
                    return this._protocol + ':';
            }
        };
        /**
         * The postfix for a Url, including protocol, : and (if needed) slashes.
         *
         * ```html
         * http://
         * ftp://
         * mailto:
         * ```
         *
         * @method setScheme
         * @param {number} value The scheme to set.
         * @return {void}
         */
        Url.prototype.setScheme = function (value) {
            this._protocol = value ? value.split(":")[0] : null;
        };
        /**
         * The username of the url.
         *
         * @method getUsername
         * @return {string}
         */
        Url.prototype.getUsername = function () {
            return this._username;
        };
        /**
         * Set the username of the url.
         *
         * @method setUsername
         * @param {string} value The username to set.
         * @return {void}
         */
        Url.prototype.setUsername = function (value) {
            this._username = value;
        };
        /**
         * The password of the url.
         *
         * @method getPassword
         * @return {string}
         */
        Url.prototype.getPassword = function () {
            return this._password;
        };
        /**
         * Set password of the url.
         *
         * @method setPassword
         * @param {string} value The password to set.
         * @return {void}
         */
        Url.prototype.setPassword = function (value) {
            this._password = value;
        };
        /**
         * Authentication for FTP as {username}:{password}.
         *
         * ```html
         * thijs:AbCdE
         * ```
         *
         * @method getAuthentication
         * @return {string}
         */
        Url.prototype.getAuthentication = function () {
            if (this._protocol != Url.MAILTO && this._username) {
                if (this._password) {
                    return this._username + ":" + this._password;
                }
                else {
                    return this._username;
                }
            }
            return null;
        };
        /**
         * Set authentication of the url.
         *
         * @method setAuthentication
         * @param {string} value The authentication to set.
         * @return {void}
         */
        Url.prototype.setAuthentication = function (value) {
            if (value) {
                var a = value.split(':');
                this._username = a[0];
                this._password = a[1];
            }
            else {
                this._username = null;
                this._password = null;
            }
        };
        /**
         * The email address of a mailto link.
         *
         * ```html
         * mailto:thijs@mediamonks.com
         * ```
         *
         * @method getEmail
         * @return {string}
         */
        Url.prototype.getEmail = function () {
            return this._protocol == Url.MAILTO && this._username && this._domain ? this._username + "@" + this._domain : null;
        };
        /**
         * Set the email address of a mailto link.
         *
         * @method setEmail
         * @param {string} value The email to set.
         * @return {string}
         */
        Url.prototype.setEmail = function (value) {
            this._protocol = Url.MAILTO;
            if (value) {
                var temp = value.split("@");
                this._username = temp[0];
                this._domain = temp[1];
            }
        };
        /**
         * Hypertext Transfer Protocol
         *
         * @property HTTP
         * @type string
         * @default 'http'
         */
        Url.HTTP = "http";
        /**
         * HTTP Secure
         *
         * @property HTTPS
         * @type string
         * @default 'https'
         */
        Url.HTTPS = "https";
        /**
         * File Transfer Protocol
         *
         * @property FTP
         * @type string
         * @default 'ftp'
         */
        Url.FTP = "ftp";
        /**
         * Secure File Transfer Protocol
         *
         * @property SFTP
         * @type string
         * @default 'sftp'
         */
        Url.SFTP = "sftp";
        /**
         * Local file
         *
         * @property FILE
         * @type string
         * @default 'file'
         */
        Url.FILE = "file";
        /**
         * Urls of this form are intended to be used to open the new message window of the user's email client when the
         * Url is activated, with the address as defined by the Url in the "To:" field.
         *
         * @property MAILTO
         * @type string
         * @default 'mailto'
         */
        Url.MAILTO = "mailto";
        return Url;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Url;
});
