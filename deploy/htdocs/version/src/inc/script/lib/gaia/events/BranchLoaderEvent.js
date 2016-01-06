var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'lib/temple/events/BaseEvent'], function (require, exports, BaseEvent_1) {
    var BranchLoaderEvent = (function (_super) {
        __extends(BranchLoaderEvent, _super);
        function BranchLoaderEvent(type, asset) {
            if (asset === void 0) { asset = null; }
            _super.call(this, type);
            this.asset = asset;
        }
        BranchLoaderEvent.LOAD_PAGE = "BranchLoaderEvent.LOAD_PAGE";
        BranchLoaderEvent.LOAD_ASSET = "BranchLoaderEvent.LOAD_ASSET";
        BranchLoaderEvent.START = "BranchLoaderEvent.START";
        BranchLoaderEvent.COMPLETE = "BranchLoaderEvent.COMPLETE";
        return BranchLoaderEvent;
    })(BaseEvent_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BranchLoaderEvent;
});
