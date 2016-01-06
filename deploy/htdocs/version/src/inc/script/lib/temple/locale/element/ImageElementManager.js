var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./AbstractElementManager", "./data/ImageElementData", "../../utils/Log"], function (require, exports, AbstractElementManager_1, ImageElementData_1, Log_1) {
    var _log = new Log_1.default('lib.temple.locale.element.ImageElementManager');
    /**
     * @module Temple
     * @namespace temple.locale.element
     * @extend temple.locale.element.AbstractElementManager
     * @class ImageElementManager
     */
    var ImageElementManager = (function (_super) {
        __extends(ImageElementManager, _super);
        function ImageElementManager() {
            _super.call(this);
        }
        /**
         * @public
         * @static
         * @method getInstance
         * @returns {ImageElementManager}
         */
        ImageElementManager.getInstance = function () {
            if (typeof ImageElementManager._instance === 'undefined') {
                ImageElementManager._instance = new ImageElementManager();
            }
            return ImageElementManager._instance;
        };
        /**
         * @public
         * @method add
         * @param {HTMLElement} element
         * @param {string} url
         */
        ImageElementManager.prototype.add = function (element, url) {
            if (url === void 0) { url = null; }
            if (!element || typeof element === 'undefined') {
                _log.error('no element ', element);
                return;
            }
            if (!url) {
                var src = $(element).attr('src');
                if (src) {
                    url = src.replace(/\/([a-z]{2}_[A-Z]{2})\//gi, '/{locale}/');
                }
            }
            if (!element || typeof element === 'undefined') {
                _log.error('missing url', element);
                return;
            }
            _log.log('>>> URL: ', url);
            _super.prototype.addElement.call(this, new ImageElementData_1.default(element, url));
        };
        /**
         * @public
         * @method updateElement
         * @param {ImageElementData} data
         */
        ImageElementManager.prototype.updateElement = function (data) {
            $(data.element).attr('src', data.url.replace('{locale}', this._localeManager.getLocale()));
        };
        return ImageElementManager;
    })(AbstractElementManager_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ImageElementManager;
});
