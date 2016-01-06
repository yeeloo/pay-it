define(["require", "exports"], function (require, exports) {
    /**
     * The NativeEventListener is a wrapper around the native addEventListener method of an HTML element and makes it easier
     * to remove the handlers. By destructing this object, the listener is removed from the HTML element.
     *
     * @example
     * ```
     * // Add a resize listener on the window
     * var resizeListener:NativeEventListener = new NativeEventListener(window, "resize", this.handleResize);
     *
     * // remove the resize listener
     * resizeListener.destruct();
     * ```
     *
     * @module Temple
     * @namespace temple.events
     * @class NativeEventListener
     */
    var NativeEventListener = (function () {
        /**
         * Add an event listener on a HTML element.
         *
         * @param {NativeEventDispatcher} eventDispatcher the HTML element to listen to.
         * @param {string} type the type of event to listen to.
         * @param {EventListener} listener the method which is called when the eventDispatcher dispatches an event to the
         * specified type
         * @param {boolean} useCapture If true, useCapture indicates that the user wishes to initiate capture. After
         * initiating capture, all events of the specified type will be dispatched to the registered listener before being
         * dispatched to any EventTarget beneath it in the DOM tree. Events which are bubbling upward through the tree will
         * not trigger a listener designated to use capture.
         */
        function NativeEventListener(eventDispatcher, type, listener, useCapture) {
            this.eventDispatcher = eventDispatcher;
            this.type = type;
            this.listener = listener;
            this.useCapture = useCapture;
            this._isDestructed = false;
            eventDispatcher.addEventListener(type, listener, useCapture);
        }
        /**
         * Indicates if the event listener is removed.
         * @returns {boolean}
         */
        NativeEventListener.prototype.isDestructed = function () {
            return this._isDestructed;
        };
        /**
         * Removes the event listener on the HTML element
         */
        NativeEventListener.prototype.destruct = function () {
            if (this.eventDispatcher && this.type && this.listener) {
                this.eventDispatcher.removeEventListener(this.type, this.listener, this.useCapture);
            }
            this.eventDispatcher = null;
            this.type = null;
            this.listener = null;
            this._isDestructed = true;
        };
        return NativeEventListener;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NativeEventListener;
});
