var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/locale/provider/core/AbstractXMLLocaleProvider", "lib/temple/utils/Browser"], function (require, exports, AbstractXMLLocaleProvider_1, Browser_1) {
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
     * Run the grunt create-xmlp task to generate the XMLP file
     *
     * XMLLocaleProvider
     *
     * @module Temple
     * @namespace temple.locale.provider
     * @extend temple.locale.provider.core.AbstractXMLLocaleProvider
     * @class XMLLocaleProvider
     */
    var XMLPLocaleProvider = (function (_super) {
        __extends(XMLPLocaleProvider, _super);
        function XMLPLocaleProvider(localeManager, locale, url) {
            if (locale === void 0) { locale = null; }
            if (url === void 0) { url = null; }
            _super.call(this, localeManager, locale, url);
        }
        /**
         * Does the actual XHR Request
         *
         * @public
         * @method loadLocaleFromQueue
         * @param {ILocaleData} xml
         */
        XMLPLocaleProvider.prototype.loadLocaleFromQueue = function (xml) {
            var _this = this;
            $.ajax({
                url: xml.url,
                jsonpCallback: xml.locale,
                crossDomain: true,
                dataType: "jsonp",
                success: function (data) {
                    xml.loaded = true;
                    xml.data = _this.parseResponseText(data);
                    _this.parseLocaleFile(xml.data, xml.locale);
                    // Checks for next in line and recalls the function
                    _super.prototype.loadLocaleFromQueue.call(_this, xml);
                }
            });
        };
        /**
         * IE8 does not support the DOM Parser so added a fix, might not be needed
         * because of the dropped IE8 support
         */
        XMLPLocaleProvider.prototype.parseResponseText = function (data) {
            var parsedResponse = decodeURIComponent(data);
            var xmlData;
            if (Browser_1.default.ie && Browser_1.default.version < 9) {
                xmlData = new ActiveXObject("Microsoft.XMLDOM");
                xmlData.async = false;
                return xmlData.loadXML(parsedResponse);
            }
            else {
                var parser = new DOMParser();
                return parser.parseFromString(parsedResponse, "text/xml");
            }
        };
        return XMLPLocaleProvider;
    })(AbstractXMLLocaleProvider_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = XMLPLocaleProvider;
});
