var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/events/EventDispatcher", "lib/temple/events/CommonEvent", "../utils/Log"], function (require, exports, EventDispatcher_1, CommonEvent_1, Log_1) {
    /**
     * @module Temple
     * @namespace temple.locale
     * @class LocaleManager
     * @extend temple.events.EventDispatcher
     */
    var LocaleManager = (function (_super) {
        __extends(LocaleManager, _super);
        function LocaleManager(locale) {
            if (locale === void 0) { locale = null; }
            _super.call(this);
            this._log = new Log_1.default('lib.temple.locale.LocaleManager');
            this._strings = {};
            this._keys = {};
            this._providers = [];
            this._aliases = {}; // { source: target }
            // this._locale = locale || (window.navigator.userLanguage || window.navigator['language']).replace('-', '_');
            window['localeManager'] = this;
        }
        LocaleManager.getInstance = function () {
            if (!LocaleManager._instance) {
                LocaleManager._instance = new LocaleManager();
            }
            return LocaleManager._instance;
        };
        /**
         * @public
         * @method getLanguage
         * @returns {string}
         */
        LocaleManager.prototype.getLanguage = function () {
            return this._locale.split('_')[0];
        };
        /**
         * @public
         * @method getCountry
         * @returns {string}
         */
        LocaleManager.prototype.getCountry = function () {
            return this._locale.split('_')[1];
        };
        /**
         * @public
         * @method getLocale
         * @returns {string}
         */
        LocaleManager.prototype.getLocale = function () {
            return this._locale;
        };
        /**
         * @public
         * @method addAlias
         * @param {string} source
         * @param {string} target
         */
        LocaleManager.prototype.addAlias = function (source, target) {
            this._aliases[source] = target;
        };
        /**
         * @public
         * @method getAlias
         * @param {string} source
         * @returns {string}
         */
        LocaleManager.prototype.getAlias = function (source) {
            return this._aliases[source];
        };
        /**
         * @public
         * @method setLocale
         * @param {string} locale
         */
        LocaleManager.prototype.setLocale = function (locale) {
            this._log.log('setLocale', locale);
            if (!locale) {
                return;
            }
            if (typeof this.getAlias(locale) != 'undefined') {
                locale = this.getAlias(locale);
            }
            if (locale != this._locale) {
                this._locale = locale;
                this.dispatchEvent(new CommonEvent_1.default(CommonEvent_1.default.CHANGE));
                this.checkProviders(this._locale);
                this.update();
            }
        };
        /**
         * @public
         * @method setFallbackLocale
         * @param {string} locale
         */
        LocaleManager.prototype.setFallbackLocale = function (locale) {
            this._fallbackLocale = locale;
        };
        /**
         * @public
         * @method getFallbackLocale
         * @returns {string}
         */
        LocaleManager.prototype.getFallbackLocale = function () {
            return this._fallbackLocale;
        };
        /**
         * @public
         * @method hasLocale
         * @param locale
         * @returns {boolean}
         */
        LocaleManager.prototype.hasLocale = function (locale) {
            return this._strings.hasOwnProperty(locale) && this._strings[locale] != null;
        };
        /**
         * @public
         * @method addLocale
         * @param {string} locale
         */
        LocaleManager.prototype.addLocale = function (locale) {
            if (!this.hasLocale(locale)) {
                this._strings[locale] = {};
                this._keys[locale] = {};
            }
        };
        /**
         * @public
         * @method getKeys
         * @param {string} path
         * @param {string} locale
         * @returns {string:[]}
         */
        LocaleManager.prototype.getKeys = function (path, locale) {
            if (locale === void 0) { locale = null; }
            if (locale == 'debug' || (!locale && this._locale == 'debug')) {
                return [];
            }
            else if (locale) {
                if (this.hasLocale(locale) && this._keys[locale][path]) {
                    return this._keys[locale][path];
                }
            }
            else {
                if (this.hasLocale(this._locale) && this._keys[this._locale][path] != undefined && this._keys[this._locale][path] != null) {
                    return this._keys[this._locale][path];
                }
                else if (this._fallbackLocale) {
                    return [this.getString(path, this._fallbackLocale)];
                }
            }
            this._log.log("getString: no text found for '" + path + "', locale '" + (locale || this._locale) + "'");
            // nothing found, return empty string.
            return [];
        };
        /**
         * @public
         * @method getString
         * @param {string}id
         * @param {string} locale
         * @returns {string}
         */
        LocaleManager.prototype.getString = function (id, locale) {
            if (locale === void 0) { locale = null; }
            if (locale == 'debug' || (!locale && this._locale == 'debug')) {
                return '__' + id + '__';
            }
            else if (locale) {
                if (this.hasLocale[locale] && this._strings[locale][id]) {
                    return this._strings[locale][id];
                }
            }
            else {
                if (this.hasLocale(this._locale) && this._strings[this._locale][id] != undefined && this._strings[this._locale][id] != null) {
                    return this._strings[this._locale][id];
                }
                else if (this._fallbackLocale) {
                    return this.getString(id, this._fallbackLocale);
                }
            }
            this._log.log("getString: no text found for '" + id + "', locale '" + (locale || this._locale) + "'");
            // nothing found, return empty string.
            return '';
        };
        /**
         * @public
         * @method setString
         * @param {string} locale
         * @param {string} id
         * @param {string} text
         */
        LocaleManager.prototype.setString = function (locale, id, text) {
            if (!this.hasLocale(locale)) {
                this.addLocale(locale);
            }
            this._strings[locale][id] = text;
        };
        /**
         * @public
         * @method setKeys
         * @param {string} locale
         * @param {string} id
         * @param {string} text
         */
        LocaleManager.prototype.setKeys = function (locale, id, text) {
            if (!this.hasLocale(locale)) {
                this.addLocale(locale);
            }
            this._keys[locale][id] = text;
        };
        /**
         * @public
         * @method hasString
         * @param {string}id
         * @param {string}locale
         * @returns {boolean}
         */
        LocaleManager.prototype.hasString = function (id, locale) {
            if (locale === void 0) { locale = null; }
            if (locale == null) {
                locale = this._locale;
            }
            return (this.hasLocale(locale) && typeof this._strings[locale][id] !== 'undefined');
        };
        /**
         * @public
         * @method getStrings
         * @returns {string[]}
         */
        LocaleManager.prototype.getStrings = function () {
            return this._strings;
        };
        /**
         * @public
         * @method addLocaleProvider
         * @param {ILocaleProvider} provider
         */
        LocaleManager.prototype.addLocaleProvider = function (provider) {
            this._log.log('addLocaleProvider', provider);
            this._providers.push(provider);
            this.checkProviders(this._locale);
        };
        /**
         * @public
         * @method checkProviders
         * @param {string} locale
         */
        LocaleManager.prototype.checkProviders = function (locale) {
            this._log.log('checkProviders', locale);
            for (var i = 0; i < this._providers.length; i++) {
                var provider = this._providers[i];
                if (provider.hasLocale(locale) && !provider.hasProvided(locale)) {
                    provider.provide(locale);
                }
            }
        };
        /**
         * @public
         * @method update
         */
        LocaleManager.prototype.update = function () {
            if (this.isReady()) {
                this.dispatchEvent(new CommonEvent_1.default(CommonEvent_1.default.UPDATE));
            }
        };
        /**
         * @public
         * @method isReady
         * @returns {boolean}
         */
        LocaleManager.prototype.isReady = function () {
            if (this._locale == 'debug') {
                return true;
            }
            for (var i = 0; i < this._providers.length; i++) {
                var provider = this._providers[i];
                if (provider.hasLocale(this._locale) && !provider.hasProvided(this._locale)) {
                    return false;
                }
            }
            return true;
        };
        return LocaleManager;
    })(EventDispatcher_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LocaleManager;
});
