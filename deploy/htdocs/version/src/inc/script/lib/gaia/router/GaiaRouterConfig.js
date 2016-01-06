define(["require", "exports", "./GaiaRouteRequirement", "./GaiaRouteParser", "./GaiaRouteStringifier"], function (require, exports, GaiaRouteRequirement_1, GaiaRouteParser_1, GaiaRouteStringifier_1) {
    /**
     * @namespace gaia.router
     * @class GaiaRouterConfig
     */
    var GaiaRouterConfig = (function () {
        function GaiaRouterConfig() {
            this._enabled = true;
            this._includeQueryString = false;
            this._useFallback = false;
            this._removeExtraSlashes = false;
            this._requirements = [];
            this._parsers = [];
            this._stringifiers = [];
        }
        /**
         * @public
         * @method disable
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.disable = function () {
            this._enabled = false;
            return this;
        };
        /**
         * @public
         * @method enable
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.enable = function () {
            this._enabled = true;
            return this;
        };
        /**
         * @public
         * @method isEnabled
         * @returns {boolean}
         */
        GaiaRouterConfig.prototype.isEnabled = function () {
            return this._enabled;
        };
        /**
         * @public
         * @method useFallback
         * @param {boolean} value
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.useFallback = function (value) {
            if (value === void 0) { value = true; }
            this._useFallback = value;
            return this;
        };
        /**
         * @public
         * @method includeQueryString
         * @param value
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.includeQueryString = function (value) {
            if (value === void 0) { value = true; }
            this._includeQueryString = value;
            return this;
        };
        /**
         * @public
         * @method isQueryStringIncluded
         * @returns {boolean}
         */
        GaiaRouterConfig.prototype.isQueryStringIncluded = function () {
            return this._includeQueryString;
        };
        /**
         * @public
         * @method isUsingFallback
         * @returns {boolean}
         */
        GaiaRouterConfig.prototype.isUsingFallback = function () {
            return this._useFallback;
        };
        /**
         * @public
         * @method removeExtraSlashes
         * @param value
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.removeExtraSlashes = function (value) {
            if (value === void 0) { value = true; }
            this._removeExtraSlashes = value;
            return this;
        };
        GaiaRouterConfig.prototype.assert = function (name, assertion) {
            this._requirements.push(new GaiaRouteRequirement_1.default(name, assertion));
            return this;
        };
        /**
         * @public
         * @method parse
         * @param name
         * @param callback
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.parse = function (name, callback) {
            this._parsers.push(new GaiaRouteParser_1.default(name, callback));
            return this;
        };
        /**
         * @public
         * @method stringify
         * @param name
         * @param callback
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.stringify = function (name, callback) {
            this._stringifiers.push(new GaiaRouteStringifier_1.default(name, callback));
            return this;
        };
        GaiaRouterConfig.prototype.redirectOnLanding = function (route) {
            if (route === void 0) { route = '/'; }
            this._redirectOnLanding = route;
            return this;
        };
        /**
         * @public
         * @method setDefaultLocale
         * @param {string} locale
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.setDefaultLocale = function (locale) {
            this._defaultLocale = locale;
            return this;
        };
        /**
         * @public
         * @method setLocaleRegExp
         * @param {RegExp} localeRegExp
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.setLocaleRegExp = function (localeRegExp) {
            this._localeRegExp = localeRegExp;
            return this;
        };
        /**
         * @public
         * @method getDefaultLocale
         * @returns {string}
         */
        GaiaRouterConfig.prototype.getDefaultLocale = function () {
            return this._defaultLocale;
        };
        /**
         * @public
         * @method getLocaleRegExp
         * @returns {RegExp}
         */
        GaiaRouterConfig.prototype.getLocaleRegExp = function () {
            return this._localeRegExp;
        };
        /**
         * @public
         * @method setTranslator
         * @param translator
         * @param translationPath
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.setTranslator = function (translator, translationPath) {
            return this;
        };
        /**
         * @public
         * @method getRequirements
         * @returns {gaia.router.GaiaRouteRequirement[]}
         */
        GaiaRouterConfig.prototype.getRequirements = function () {
            return this._requirements;
        };
        /**
         * @public
         * @method getStringifiers
         * @returns {gaia.router.GaiaRouteStringifier[]}
         */
        GaiaRouterConfig.prototype.getStringifiers = function () {
            return this._stringifiers;
        };
        /**
         * @public
         * @method getParsers
         * @returns {gaia.router.GaiaRouteParser[]}
         */
        GaiaRouterConfig.prototype.getParsers = function () {
            return this._parsers;
        };
        /* internal */ GaiaRouterConfig.prototype.setDefaultsForRoute = function (route) {
            for (var i = 0; i < this._requirements.length; i++) {
                var requirement = this._requirements[i];
                if (route.getGroupName(requirement.name)) {
                    route.assert(requirement.name, requirement.assertion);
                }
            }
            for (var i = 0; i < this._parsers.length; i++) {
                var parser = this._parsers[i];
                if (route.getGroupName(parser.name)) {
                    route.parse(parser.name, parser.callback);
                }
            }
            for (var i = 0; i < this._stringifiers.length; i++) {
                var stringifier = this._stringifiers[i];
                if (route.getGroupName(stringifier.name)) {
                    route.stringify(stringifier.name, stringifier.callback);
                }
            }
            if (this._redirectOnLanding) {
                route.redirectOnLanding(this._redirectOnLanding);
            }
        };
        return GaiaRouterConfig;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GaiaRouterConfig;
});
