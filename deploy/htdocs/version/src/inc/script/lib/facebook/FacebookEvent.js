var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/events/BaseEvent"], function (require, exports, BaseEvent_1) {
    var FacebookEvent = (function (_super) {
        __extends(FacebookEvent, _super);
        function FacebookEvent(type) {
            _super.call(this, type);
        }
        FacebookEvent.LOGIN = "FacebookEvent.login";
        FacebookEvent.LOGOUT = "FacebookEvent.logout";
        return FacebookEvent;
    })(BaseEvent_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FacebookEvent;
});
