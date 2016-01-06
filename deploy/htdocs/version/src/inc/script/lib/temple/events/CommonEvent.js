var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/events/BaseEvent"], function (require, exports, BaseEvent_1) {
    /**
     * @module Temple
     * @namespace temple.events
     * @class CommonEvent
     * @extend temple.events.BaseEvent
     */
    var CommonEvent = (function (_super) {
        __extends(CommonEvent, _super);
        function CommonEvent(type) {
            _super.call(this, type);
        }
        CommonEvent.COMPLETE = "complete";
        CommonEvent.UPDATE = "update";
        CommonEvent.INIT = "init";
        CommonEvent.CHANGE = "change";
        CommonEvent.OPEN = "open";
        CommonEvent.CLOSE = "close";
        return CommonEvent;
    })(BaseEvent_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CommonEvent;
});
