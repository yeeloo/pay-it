var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'lib/temple/events/BaseEvent'], function (require, exports, BaseEvent_1) {
    var PageEvent = (function (_super) {
        __extends(PageEvent, _super);
        function PageEvent(type, page) {
            _super.call(this, type);
            this.page = page;
        }
        PageEvent.TRANSITION_OUT = "PageEvent.TRANSITION_OUT";
        PageEvent.TRANSITION_OUT_COMPLETE = "PageEvent.TRANSITION_OUT_COMPLETE";
        PageEvent.TRANSITION_IN = "PageEvent.TRANSITION_IN";
        PageEvent.TRANSITION_IN_COMPLETE = "PageEvent.TRANSITION_IN_COMPLETE";
        PageEvent.TRANSITION = "PageEvent.TRANSITION";
        PageEvent.TRANSITION_COMPLETE = "PageEvent.TRANSITION_COMPLETE";
        PageEvent.LEVEL_CHANGE = "PageEvent.LEVEL_CHANGE";
        PageEvent.BEFORE_INIT = "PageEvent.BEFORE_INIT";
        return PageEvent;
    })(BaseEvent_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PageEvent;
});
