define(["require", "exports"], function (require, exports) {
    /**
     * The BaseEvent class is used as the base class for the creation of Event objects, which are passed as parameters to event listeners when an event occurs.
     * The properties of the BaseEvent class carry basic information about an event, such as the event's type or whether the event's default behavior can be canceled.
     */
    var BaseEvent = (function () {
        /**
         * Creates an Event object to pass as a parameter to event listeners.
         * @param type The type of event.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         */
        function BaseEvent(type, cancelable) {
            if (cancelable === void 0) { cancelable = false; }
            this.type = type;
            this.cancelable = cancelable;
            /**
             * The event target.
             */
            this.target = null;
            this._stopImmediatePropagation = false;
            this._isDefaultPrevented = false;
        }
        /**
         * Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
         */
        BaseEvent.prototype.stopImmediatePropagation = function () {
            this._stopImmediatePropagation = true;
        };
        /**
         * Cancels an event's default behavior if that behavior can be canceled.
         */
        BaseEvent.prototype.preventDefault = function () {
            this._isDefaultPrevented = true;
        };
        /**
         * Checks whether the preventDefault() method has been called on the event.
         */
        BaseEvent.prototype.isDefaultPrevented = function () {
            return this._isDefaultPrevented;
        };
        return BaseEvent;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BaseEvent;
});
