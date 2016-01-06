var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/gaia/assets/AbstractPageViewModel"], function (require, exports, AbstractPageViewModel_1) {
    /**
     * DefaultPageViewModel
     *
     * @class DefaultPageViewModel
     * @extend gaia.assets.AbstractPageViewModel
     */
    var DefaultPageViewModel = (function (_super) {
        __extends(DefaultPageViewModel, _super);
        function DefaultPageViewModel() {
            _super.call(this);
        }
        return DefaultPageViewModel;
    })(AbstractPageViewModel_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DefaultPageViewModel;
});
