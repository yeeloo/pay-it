var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/core/Destructible"], function (require, exports, Destructible_1) {
    var AbstractComponentViewModel = (function (_super) {
        __extends(AbstractComponentViewModel, _super);
        function AbstractComponentViewModel() {
            _super.call(this);
            this._subscriptions = [];
        }
        AbstractComponentViewModel.prototype.setController = function (controller) {
            this.controller = controller;
        };
        AbstractComponentViewModel.prototype.destruct = function () {
            this.controller = null;
            if (this._subscriptions) {
                for (var i = 0; i < this._subscriptions.length; i++) {
                    this._subscriptions[i].dispose();
                }
                this._subscriptions = null;
            }
            _super.prototype.destruct.call(this);
        };
        return AbstractComponentViewModel;
    })(Destructible_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractComponentViewModel;
});
