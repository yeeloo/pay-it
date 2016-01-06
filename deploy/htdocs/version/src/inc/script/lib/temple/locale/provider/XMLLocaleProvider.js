var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/locale/provider/core/AbstractXMLLocaleProvider"], function (require, exports, AbstractXMLLocaleProvider_1) {
    /**
     * Locale provider for XML documents
     * The XML document should be formatted as follows:
     *
     *     <?xml version="1.0" encoding="UTF-8"?>
     *     <texts>
     *         <text id="string_id_2"><![CDATA[This is string #2]]></text>
     *         <text id="string_id_1"><![CDATA[This is string #1]]></text>
     *         <text id="string_id_3"><![CDATA[This is string #3. You can also use <strong>HTML</strong> here!]]></text>
     *     </texts>
     *
     * XMLPLocaleProvider
     *
     * @module Temple
     * @namespace temple.locale.provider
     * @extend temple.locale.provider.core.AbstractXMLLocaleProvider
     * @class XMLPLocaleProvider
     */
    var XMLLocaleProvider = (function (_super) {
        __extends(XMLLocaleProvider, _super);
        function XMLLocaleProvider(localeManager, locale, url) {
            if (locale === void 0) { locale = null; }
            if (url === void 0) { url = null; }
            _super.call(this, localeManager, locale, url);
        }
        /**
         * Does the actual XHR Request
         *
         * @pubilc
         * @method loadLocaleFromQueue
         * @param {ILocaleData} xml
         */
        XMLLocaleProvider.prototype.loadLocaleFromQueue = function (xml) {
            var _this = this;
            $.get(xml.url, function (data) {
                xml.loaded = true;
                xml.data = data;
                // Checks for next in line and recalls the function
                _super.prototype.loadLocaleFromQueue.call(_this, xml);
            });
        };
        return XMLLocaleProvider;
    })(AbstractXMLLocaleProvider_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = XMLLocaleProvider;
});
