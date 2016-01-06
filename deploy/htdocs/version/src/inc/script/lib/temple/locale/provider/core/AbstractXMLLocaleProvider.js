var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/locale/provider/core/AbstractExternalLocaleProvider"], function (require, exports, AbstractExternalLocaleProvider_1) {
    /**
     * @module Temple
     * @namespace temple.locale.provider.core
     * @extend temple.locale.provider.core.AbstractExternalLocaleProvider
     * @class AbstractXMLLocaleProvider
     */
    var AbstractXMLLocaleProvider = (function (_super) {
        __extends(AbstractXMLLocaleProvider, _super);
        function AbstractXMLLocaleProvider(localeManager, locale, url) {
            if (locale === void 0) { locale = null; }
            if (url === void 0) { url = null; }
            _super.call(this, localeManager, locale, url);
        }
        /**
         * Parse the XML Data
         *
         * @public
         * @method parseLocaleFile
         * @param {any} data
         * @param {string} locale
         * @param {string} path
         */
        AbstractXMLLocaleProvider.prototype.parseLocaleFile = function (data, locale, path) {
            var _this = this;
            if (path === void 0) { path = null; }
            $(data).find('text').each(function (i, e) {
                _this.localeManager.setString(locale, $(e).attr('id'), $(e).text());
            });
        };
        return AbstractXMLLocaleProvider;
    })(AbstractExternalLocaleProvider_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractXMLLocaleProvider;
});
