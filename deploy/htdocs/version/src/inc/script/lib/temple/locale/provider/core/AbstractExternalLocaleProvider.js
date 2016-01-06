var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/locale/provider/core/AbstractLocaleProvider", "lib/temple/locale/provider/core/data/LocaleData", "../../../utils/Log"], function (require, exports, AbstractLocaleProvider_1, LocaleData_1, Log_1) {
    var _log = new Log_1.default('lib.temple.locale.provider.core.AbstractExternalLocaleProvider');
    /**
     * @module Temple
     * @namespace temple.locale.provider.core
     * @extend temple.locale.provider.core.AbstractLocaleProvider
     * @class AbstractExternalLocaleProvider
     */
    var AbstractExternalLocaleProvider = (function (_super) {
        __extends(AbstractExternalLocaleProvider, _super);
        function AbstractExternalLocaleProvider(localeManager, locale, url) {
            if (locale === void 0) { locale = null; }
            if (url === void 0) { url = null; }
            _super.call(this, localeManager);
            this.files = [];
            this._preloadQueue = [];
            if (locale && url) {
                this.addLocaleFile(locale, url);
            }
        }
        /**
         * Provide the locale
         *
         * @public
         * @method provide
         * @param {string} locale
         */
        AbstractExternalLocaleProvider.prototype.provide = function (locale) {
            if (!this.files) {
                return;
            }
            for (var i = 0; i < this.files.length; i++) {
                var files = this.files[i];
                if (files.locale == locale && !files.loaded) {
                    this.loadLocaleFile(files);
                }
            }
        };
        /**
         * Checks if the locale exists and is loaded
         *
         * @public
         * @method hasProvided
         * @param {string} locale
         * @returns {boolean}
         */
        AbstractExternalLocaleProvider.prototype.hasProvided = function (locale) {
            if (!this.hasLocale(locale)) {
                return false;
            }
            for (var i = 0; i < this.files.length; i++) {
                var file = this.files[i];
                if (file.locale == locale && !file.loaded) {
                    return false;
                }
            }
            return true;
        };
        /**
         * Checks if the locale exists
         *
         * @public
         * @method hasLocale
         * @param {string} locale
         * @returns {boolean}
         */
        AbstractExternalLocaleProvider.prototype.hasLocale = function (locale) {
            if (!this.files) {
                return false;
            }
            for (var i = 0; i < this.files.length; i++) {
                var file = this.files[i];
                if (file.locale == locale) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Retuns all the locales
         *
         * @public
         * @method getLocales
         * @returns {ILocaleData[]}
         */
        AbstractExternalLocaleProvider.prototype.getLocales = function () {
            if (!this.files) {
                return [];
            }
            var list = [];
            for (var i = 0; i < this.files.length; i++) {
                var file = this.files[i];
                if (list.indexOf(file.locale) == -1) {
                    list.push(file.locale);
                }
            }
            return list;
        };
        /**
         * Add a file to the LocaleManager.
         * Before adding the file to the LocaleProvider checks if file is already added (so it won't be added twice)
         *
         * @public
         * @method addLocaleFile
         * @param {string} locale
         * @param {string} url
         * @param {boolean} preload
         */
        AbstractExternalLocaleProvider.prototype.addLocaleFile = function (locale, url, preload) {
            if (preload === void 0) { preload = false; }
            _log.log('addLocaleFile(', locale, url, preload, ')');
            if (this.findLocaleData(locale, null, url)) {
                return;
            }
            var localeData = new LocaleData_1.default(locale, null, url);
            this.files.push(localeData);
            if (locale == this.localeManager.getLocale() || preload) {
                this.loadLocaleFile(localeData);
            }
        };
        /**
         * Adds new locale objects to a preload queue
         *
         * @public
         * @method loadLocaleFile
         * @param {ILocaleData} fileData
         */
        AbstractExternalLocaleProvider.prototype.loadLocaleFile = function (fileData) {
            if (!this.checkIfLocaleAlreadyAddedToQueue(fileData.locale) && !this.hasProvided(fileData.locale)) {
                this._preloadQueue.push(fileData);
                if (this._preloadQueue.length === 1) {
                    this.loadLocaleFromQueue(fileData);
                }
            }
        };
        /**
         * Check if the locale was already added to the queue
         *
         * @public
         * @method checkIfLocaleAlreadyAddedToQueue
         * @param {string}locale
         * @returns {boolean}
         */
        AbstractExternalLocaleProvider.prototype.checkIfLocaleAlreadyAddedToQueue = function (locale) {
            for (var i = 0; i < this._preloadQueue.length; i++) {
                if (locale === this._preloadQueue[i].locale) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Should do the actual XHR Request in the parent class,
         * after completion run the super call to parse the response and load the next in queue
         *
         * @public
         * @method loadLocaleFromQueue
         * @param fileData
         */
        AbstractExternalLocaleProvider.prototype.loadLocaleFromQueue = function (fileData) {
            this.parseLocaleFile(fileData.data, fileData.locale);
            this.localeManager.update();
            // Load the next one in the queue
            this._preloadQueue.splice(0, 1);
            if (this._preloadQueue.length) {
                this.loadLocaleFromQueue(this._preloadQueue[0]);
            }
        };
        /**
         * Returns the file data
         *
         * @public
         * @method findLocaleData
         * @param {string} locale
         * @param {string} name
         * @param {string} url
         * @returns {ILocaleData}
         */
        AbstractExternalLocaleProvider.prototype.findLocaleData = function (locale, name, url) {
            _log.log('findLocaleData(', locale, name, url, ')');
            for (var i = 0; i < this.files.length; i++) {
                var file = this.files[i];
                if (file.locale == locale && file.name == name && file.url == url) {
                    return file;
                }
            }
            return null;
        };
        /**
         * Parse the File Data, should be overwritten for the xml and json providers
         *
         * @public
         * @method parseLocaleFile
         * @param {any} data
         * @param {string} locale
         * @param {string} path
         */
        AbstractExternalLocaleProvider.prototype.parseLocaleFile = function (data, locale, path) {
            if (path === void 0) { path = null; }
            _log.error('Abstract class, please extend and override this method');
        };
        /**
         * @public
         * @method destruct
         */
        AbstractExternalLocaleProvider.prototype.destruct = function () {
            this.files = null;
            this._preloadQueue = null;
            _super.prototype.destruct.call(this);
        };
        return AbstractExternalLocaleProvider;
    })(AbstractLocaleProvider_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractExternalLocaleProvider;
});
