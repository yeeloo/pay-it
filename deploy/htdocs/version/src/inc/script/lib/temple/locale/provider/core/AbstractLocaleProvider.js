var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/core/Destructible", "../../../utils/Log"], function (require, exports, Destructible_1, Log_1) {
    /**
     * @module Temple
     * @namespace temple.locale.provider.core
     * @extend temple.core.Destructible
     * @class AbstractLocaleProvider
     */
    var AbstractLocaleProvider = (function (_super) {
        __extends(AbstractLocaleProvider, _super);
        function AbstractLocaleProvider(localeManager) {
            _super.call(this);
            this.localeManager = localeManager;
            this.localeManager.addLocaleProvider(this);
        }
        /**
         * @public
         * @method provider
         * @param {string} locale
         */
        AbstractLocaleProvider.prototype.provide = function (locale) {
            Log_1.default.error('Temple.Locale.Provider.AbstractLocaleProvider', 'Abstract class, please extend and override this method');
        };
        /**
         * @public
         * @method hasProvided
         * @param {string}locale
         * @returns {boolean}
         */
        AbstractLocaleProvider.prototype.hasProvided = function (locale) {
            return false;
        };
        /**
         * @public
         * @method hasLocale
         * @param {string} locale
         * @returns {boolean}
         */
        AbstractLocaleProvider.prototype.hasLocale = function (locale) {
            return false;
        };
        /**
         * @public
         * @method getLocales
         * @returns {any[]}
         */
        AbstractLocaleProvider.prototype.getLocales = function () {
            return null;
        };
        /**
         * @public
         * @method destruct
         */
        AbstractLocaleProvider.prototype.destruct = function () {
            this.localeManager = null;
            _super.prototype.destruct.call(this);
        };
        return AbstractLocaleProvider;
    })(Destructible_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractLocaleProvider;
});
