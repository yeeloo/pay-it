var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./BaseEvent"], function (require, exports, BaseEvent_1) {
    var DataEvent = (function (_super) {
        __extends(DataEvent, _super);
        function DataEvent(type, data) {
            _super.call(this, type);
            this.data = data;
        }
        return DataEvent;
    })(BaseEvent_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DataEvent;
});
