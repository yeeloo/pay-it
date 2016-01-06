var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'app/page/DefaultPageViewModel'], function (require, exports, DefaultPageViewModel_1) {
    var IndexPageViewModel = (function (_super) {
        __extends(IndexPageViewModel, _super);
        // declare observables/computed
        function IndexPageViewModel() {
            _super.call(this);
            // initiate observables
            // initiate computed
        }
        /**
         *	Destruct your data objects here
         *	- set your observables to null
         */
        IndexPageViewModel.prototype.destruct = function () {
            // Put your cleaning here
            _super.prototype.destruct.call(this);
        };
        return IndexPageViewModel;
    })(DefaultPageViewModel_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = IndexPageViewModel;
});
