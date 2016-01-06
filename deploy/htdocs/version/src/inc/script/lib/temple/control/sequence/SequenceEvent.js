var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/events/BaseEvent"], function (require, exports, BaseEvent_1) {
    /**
     * SequenceEvent is an event that will be dispatched by a Sequence.
     * Since a sequence holds tasks to be executed, it has a reference to the task that is responsible for generating the event.
     *
     * @author Rolf Vreijdenberger
     */
    var SequenceEvent = (function (_super) {
        __extends(SequenceEvent, _super);
        /**
         * @param type the type of the event
         * @param task the task that is relevant for the context of the event.
         * @param message an optional message, mainly used with error event types.
         */
        function SequenceEvent(type, task, message) {
            if (message === void 0) { message = null; }
            _super.call(this, type);
            this.task = task;
            this.message = message;
        }
        /**
         * sequence error, abort sequence
         */
        SequenceEvent.ERROR = "SequenceEvent.error";
        /**
         * task error, do not abort sequence
         */
        SequenceEvent.ERROR_NON_BLOCKING = "SequenceEvent.errorNonBlocking";
        /**
         * sequence is done
         */
        SequenceEvent.DONE = "SequenceEvent.done";
        /**
         * ready for the next task in sequence
         */
        SequenceEvent.NEXT = "SequenceEvent.next";
        /**
         * sequence started
         */
        SequenceEvent.START = "SequenceEvent.start";
        SequenceEvent.UPDATE = "SequenceEvent.update";
        return SequenceEvent;
    })(BaseEvent_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SequenceEvent;
});
