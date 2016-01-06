var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../DefaultPageController"], function (require, exports, DefaultPageController_1) {
    var HomePageController = (function (_super) {
        __extends(HomePageController, _super);
        function HomePageController() {
            _super.call(this);
        }
        /**
         *	After calling super.init, your pages DOM is ready
         */
        HomePageController.prototype.init = function () {
            _super.prototype.init.call(this);
        };
        HomePageController.prototype.togglePayee = function (index) {
            this.viewModel.selected(index);
        };
        HomePageController.prototype.destruct = function () {
            // Put your cleaning here
            // always call this last
            _super.prototype.destruct.call(this);
        };
        return HomePageController;
    })(DefaultPageController_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HomePageController;
});
