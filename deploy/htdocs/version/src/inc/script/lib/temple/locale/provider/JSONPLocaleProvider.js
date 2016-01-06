var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/locale/provider/core/AbstractJSONLocaleProvider"], function (require, exports, AbstractJSONLocaleProvider_1) {
    /**
     * ##Locale provider for JSON documents
     * The JSON object should be as follows:
     *
     *     {
     *         'string_id': 'value',
     *         'other_string_id': 'other value',
     *         'nested_object': {
     *             'nested_string_id': 'this string is nested',
     *             'nested_string_id_2': 'this string is also nested',
     *             'nested_object_2': {
     *                 'nested_string_id': 'this string is nested',
     *                 'nested_string_id_2': 'this string is also nested',
     *              }
     *          }
     *     }
     *
     *  Nested strings should be fetched by their path, separated by a dot ('.'), e.g.:
     *  nested_object.nested_object_2.nested_string_id
     *
     *  Run the grunt create-jsonp task to generate the JSONP file
     *
     * @module Temple
     * @namespace temple.locale.provider
     * @extend temple.locale.provider.core.AbstractJSONLocaleProvider
     * @class JSONPLocaleProvider
     */
    var JSONPLocaleProvider = (function (_super) {
        __extends(JSONPLocaleProvider, _super);
        function JSONPLocaleProvider(localeManager, locale, url) {
            if (locale === void 0) { locale = null; }
            if (url === void 0) { url = null; }
            _super.call(this, localeManager, locale, url);
        }
        /**
         * @public
         * @method loadLocalesFromQueue
         * @param {ILocaleData} json
         */
        JSONPLocaleProvider.prototype.loadLocaleFromQueue = function (json) {
            var _this = this;
            $.ajax({
                url: json.url,
                jsonpCallback: json.locale,
                crossDomain: true,
                dataType: "jsonp",
                success: function (data) {
                    json.loaded = true;
                    json.data = data;
                    _this.parseLocaleFile(data, json.locale);
                    // Checks for next in line and recalls the function
                    _super.prototype.loadLocaleFromQueue.call(_this, json);
                }
            });
        };
        return JSONPLocaleProvider;
    })(AbstractJSONLocaleProvider_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = JSONPLocaleProvider;
});
