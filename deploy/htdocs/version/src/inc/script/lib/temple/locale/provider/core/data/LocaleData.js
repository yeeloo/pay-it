define(["require", "exports"], function (require, exports) {
    /**
     * @module Temple
     * @namespace temple.locale.provider.core.data
     * @class LocaleData
     */
    var LocaleData = (function () {
        function LocaleData(locale, name, url) {
            this.locale = locale;
            this.name = name;
            this.url = url;
        }
        return LocaleData;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LocaleData;
});
