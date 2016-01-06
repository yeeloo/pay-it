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
     * @class AbstractJSONLocaleProvider
     */
    var AbstractJSONLocaleProvider = (function (_super) {
        __extends(AbstractJSONLocaleProvider, _super);
        function AbstractJSONLocaleProvider(localeManager, locale, url) {
            if (locale === void 0) { locale = null; }
            if (url === void 0) { url = null; }
            _super.call(this, localeManager, locale, url);
        }
        /**
         * Parse the JSON data
         *
         * @public
         * @method parseLocaleFile
         * @param {any} data
         * @param {string} locale
         * @param {string} path
         */
        AbstractJSONLocaleProvider.prototype.parseLocaleFile = function (data, locale, path) {
            if (path === void 0) { path = null; }
            var separator = '.';
            for (var item in data) {
                if (data.hasOwnProperty(item)) {
                    var currentPath = (path ? path + separator + item : item);
                    if (typeof data[item] === 'string' || typeof data[item] === 'number' || typeof data[item] === 'boolean') {
                        this.localeManager.setString(locale, currentPath, data[item]);
                    }
                    else {
                        this.parseLocaleFile(data[item], locale, currentPath);
                        this.localeManager.setKeys(locale, currentPath, Object.keys(data[item]));
                    }
                }
            }
        };
        return AbstractJSONLocaleProvider;
    })(AbstractExternalLocaleProvider_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractJSONLocaleProvider;
});
