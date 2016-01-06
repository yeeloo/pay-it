var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./HTMLElementManager", 'knockout'], function (require, exports, HTMLElementManager_1, ko) {
    /**
     * @module Temple
     * @namespace temple.locale.element
     * @extend temple.locale.element.AbstractElementManager
     * @class KOElementManager
     */
    var KOElementManager = (function (_super) {
        __extends(KOElementManager, _super);
        function KOElementManager() {
            _super.call(this);
        }
        /**
         * @public
         * @static
         * @method getInstance
         * @returns {KOElementManager}
         */
        KOElementManager.getInstance = function () {
            if (typeof KOElementManager._instance === 'undefined') {
                KOElementManager._instance = new KOElementManager();
            }
            return KOElementManager._instance;
        };
        /**
         * @public
         * @method setText
         * @param {any} data
         * @param {string} text
         */
        KOElementManager.prototype.setText = function (data, text) {
            switch (data.attr) {
                case 'text':
                    {
                        ko.utils.setTextContent(data.element, text);
                        break;
                    }
                case 'html':
                    {
                        ko.utils.setHtml(data.element, text);
                        break;
                    }
                default:
                    {
                        _super.prototype.setText.call(this, data, text);
                        break;
                    }
            }
        };
        return KOElementManager;
    })(HTMLElementManager_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KOElementManager;
});
