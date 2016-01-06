var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/core/Destructible"], function (require, exports, Destructible_1) {
    /**
     * AbstractPageViewModel
     *
     * @module Gaia
     * @namespace gaia.assets
     * @class AbstractPageViewModel
     * @extends temple.core.Destructible
     */
    var AbstractPageViewModel = (function (_super) {
        __extends(AbstractPageViewModel, _super);
        function AbstractPageViewModel() {
            _super.call(this);
            this._subscriptions = [];
            this._destructibles = [];
        }
        AbstractPageViewModel.prototype.setController = function (value) {
            this.controller = value;
        };
        AbstractPageViewModel.prototype.destruct = function () {
            this.controller = null;
            if (this._subscriptions) {
                while (this._subscriptions.length) {
                    this._subscriptions.shift().dispose();
                }
                this._subscriptions = null;
            }
            if (this._destructibles) {
                while (this._destructibles.length) {
                    this._destructibles.shift().destruct();
                }
                this._destructibles = null;
            }
        };
        return AbstractPageViewModel;
    })(Destructible_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractPageViewModel;
});
