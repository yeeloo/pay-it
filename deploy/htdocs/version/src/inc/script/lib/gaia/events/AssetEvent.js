var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'lib/temple/events/BaseEvent'], function (require, exports, BaseEvent_1) {
    var AssetEvent = (function (_super) {
        __extends(AssetEvent, _super);
        function AssetEvent(type, asset, loaded, total, perc, bytes) {
            if (asset === void 0) { asset = null; }
            if (loaded === void 0) { loaded = 0; }
            if (total === void 0) { total = 0; }
            if (perc === void 0) { perc = 0; }
            if (bytes === void 0) { bytes = false; }
            _super.call(this, type);
            this.asset = asset;
            this.loaded = loaded;
            this.total = total;
            this.perc = perc;
            this.bytes = bytes;
        }
        AssetEvent.ASSET_COMPLETE = "AssetEvent.ASSET_COMPLETE";
        AssetEvent.ASSET_PROGRESS = "AssetEvent.ASSET_PROGRESS";
        AssetEvent.ASSET_ERROR = "AssetEvent.ASSET_ERROR";
        return AssetEvent;
    })(BaseEvent_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AssetEvent;
});
