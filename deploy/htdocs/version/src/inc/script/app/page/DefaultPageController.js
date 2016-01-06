var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/gaia/assets/AbstractPageController"], function (require, exports, AbstractPageController_1) {
    /**
     * DefaultPageController
     *
     * @namespace app.page
     * @class DefaultPageController
     * @extend gaia.assets.AbstractPageController
     */
    var DefaultPageController = (function (_super) {
        __extends(DefaultPageController, _super);
        /**
         * @constructor
         */
        function DefaultPageController() {
            _super.call(this);
        }
        return DefaultPageController;
    })(AbstractPageController_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DefaultPageController;
});
