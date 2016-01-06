define(["require", "exports", "lib/temple/locale/LocaleManager", "lib/temple/events/CommonEvent"], function (require, exports, LocaleManager_1, CommonEvent_1) {
    /**
     * @module Temple
     * @namespace temple.locale.element
     * @class AbstractElementManager
     */
    var AbstractElementManager = (function () {
        function AbstractElementManager() {
            var _this = this;
            this._elements = [];
            this._localeManager = LocaleManager_1.default.getInstance();
            this._localeManager.addEventListener(CommonEvent_1.default.UPDATE, function () {
                for (var i = 0; i < _this._elements.length; i++) {
                    _this.updateElement(_this._elements[i]);
                }
            });
        }
        /**
         * @public
         * @method addElement
         * @param {AbstractElementData} data
         */
        AbstractElementManager.prototype.addElement = function (data) {
            this._elements.push(data);
            if (this._localeManager.isReady()) {
                this.updateElement(data);
            }
        };
        /**
         * @public
         * @method updateElement
         * @param {AbstractElementData} data
         */
        AbstractElementManager.prototype.updateElement = function (data) {
        };
        /**
         * @public
         * @method getDataForElement
         * @param {any} element
         * @returns {AbstractElementData}
         */
        AbstractElementManager.prototype.getDataForElement = function (element) {
            for (var i = 0; i < this._elements.length; i++) {
                if (this._elements[i].element == element) {
                    return this._elements[i];
                }
            }
            return null;
        };
        return AbstractElementManager;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractElementManager;
});
