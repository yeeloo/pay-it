var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'lib/temple/events/BaseEvent'], function (require, exports, BaseEvent_1) {
    var GaiaEvent = (function (_super) {
        __extends(GaiaEvent, _super);
        function GaiaEvent(type, routeResult, external, src, flow, window, queryString, replace) {
            if (flow === void 0) { flow = null; }
            if (window === void 0) { window = "_self"; }
            if (queryString === void 0) { queryString = null; }
            if (replace === void 0) { replace = false; }
            _super.call(this, type);
            this.routeResult = routeResult;
            this.external = external;
            this.src = src;
            this.flow = flow;
            this.window = window;
            this.queryString = queryString;
            this.replace = replace;
        }
        GaiaEvent.GOTO = "goto";
        GaiaEvent.BEFORE_GOTO = "beforeGoto";
        GaiaEvent.AFTER_GOTO = "afterGoto";
        GaiaEvent.BEFORE_TRANSITION_OUT = "beforeTransitionOut";
        GaiaEvent.AFTER_TRANSITION_OUT = "afterTransitionOut";
        GaiaEvent.BEFORE_PRELOAD = "beforePreload";
        GaiaEvent.AFTER_PRELOAD = "afterPreload";
        GaiaEvent.BEFORE_TRANSITION = "beforeTransition";
        GaiaEvent.AFTER_TRANSITION = "afterTransition";
        GaiaEvent.BEFORE_TRANSITION_IN = "beforeTransitionIn";
        GaiaEvent.AFTER_TRANSITION_IN = "afterTransitionIn";
        GaiaEvent.AFTER_COMPLETE = "afterComplete";
        return GaiaEvent;
    })(BaseEvent_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GaiaEvent;
});
