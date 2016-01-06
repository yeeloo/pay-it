var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../core/Destructible", "./BaseEvent", "./DataEvent", "../utils/Log"], function (require, exports, Destructible_1, BaseEvent_1, DataEvent_1, Log_1) {
    var _log = new Log_1.default('lib.temple.events.EventDispatcher');
    /**
     * The EventDispatcher class is the base class for all classes that dispatch events. The EventDispatcher class implements the
     * IEventDispatcher interface and is the base class for the DisplayObject class. The EventDispatcher class allows any object
     * on the display list to be an event target and as such, to use the methods of the IEventDispatcher interface.
     *
     * @module Temple
     * @namespace temple.events
     * @class EventDispatcher
     * @extends temple.core.Destructible
     */
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        /**
         * @class EventDispatcher
         * @constructor
         * @param {IEventDispatcher} target
         */
        function EventDispatcher(target) {
            if (target === void 0) { target = null; }
            _super.call(this);
            this._target = target || this;
            this._events = {};
        }
        /**
         * Dispatches an event into the event flow.
         *
         * Returns a value of true if the event was successfully dispatched. A value of false indicates failure or that preventDefault() was called on the event.
         *
         * @method dispatchEvent
         * @param {IEvent} event
         */
        EventDispatcher.prototype.dispatchEvent = function (event) {
            if (this._events) {
                event.target = this._target;
                // reset events properties, so events can be reused
                event._stopImmediatePropagation = false;
                event._isDefaultPrevented = false;
                if (this._events[event.type]) {
                    // create a queue for the handlers, so we know that it can't be manipulated during the loop
                    var listeners = [];
                    var events = this._events[event.type];
                    for (var i = 0, l = events.length; i < l; ++i) {
                        listeners.push(events[i].listener);
                        if (events[i].once) {
                            events[i].destruct();
                            i--;
                            l--;
                        }
                    }
                    for (var i = 0, l = listeners.length; i < l; ++i) {
                        listeners[i].call(this._target, event);
                        if (event._stopImmediatePropagation) {
                            break;
                        }
                    }
                    return !event._isDefaultPrevented;
                }
                else {
                    _log.warn('trying to dispatch event that has no listeners "' + event.type + '"');
                }
            }
            return false;
        };
        /**
         * Shorthand function for dispatchEvent
         * @param type
         * @param data
         * @returns {boolean}
         */
        EventDispatcher.prototype.dispatch = function (type, data) {
            if (this.hasEventListener(type)) {
                return this.dispatchEvent(data === void 0 ? new BaseEvent_1.default(type) : new DataEvent_1.default(type, data));
            }
            return false;
        };
        /**
         * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an event.
         * You can register event listeners on all nodes in the display list for a specific type of event, phase, and priority.
         *
         * After you successfully register an event listener, you cannot change its priority through additional calls to addEventListener().
         * To change a listener's priority, you must first call removeEventListener(). Then you can register the listener again with the new
         * priority level.
         *
         * If the event listener is being registered on a node while an event is also being processed on this node, the event listener is not
         * triggered.
         *
         * If an event listener is removed from a node while an event is being processed on the node, it is still triggered by the current actions
         * After it is removed, the event listener is never invoked again (unless it is registered again for future processing).
         *
         * @method addEventListener
         * @param {string} type The type of event.
         * @param {?} listener  The listener function that processes the event.
         * @param {number} priority  The priority level of the event listener. The higher the number, the higher the priority. All listeners
         * with priority n are processed before listeners of priority n-1. If two or more listeners share the same priority, they
         * are processed in the order in which they were added. The default priority is 0.
         * @param {boolean} once Indicates that the listener is automatically removed after the event is dispatched.
         * @returns {IDestructible} an IDestructible object. Calling 'destruct' on this object will remove this listener.
         */
        EventDispatcher.prototype.addEventListener = function (type, listener, priority, once) {
            if (priority === void 0) { priority = 0; }
            if (once === void 0) { once = false; }
            if (!(type in this._events) || typeof (this._events[type]) === 'undefined') {
                this._events[type] = [];
            }
            for (var i = 0, l = this._events[type].length; i < l; ++i) {
                if (this._events[type][i].listener === listener) {
                    // double
                    _log.warn("Trying to add double listener");
                    return this._events[type][i];
                }
            }
            var data = new EventListenerData(this, type, listener, priority, once);
            this._events[type].push(data);
            this._events[type].sort(this.sort);
            return data;
        };
        /**
         * Checks whether the EventDispatcher object has any listeners registered for a specific type of event.
         * @param type
         * @returns {boolean}
         */
        EventDispatcher.prototype.hasEventListener = function (type) {
            return this._events && this._events[type] && this._events[type].length > 0;
        };
        /**
         * Removes a listener from the EventDispatcher object. If there is no matching listener registered with the EventDispatcher object, a call to this method has no effect.
         * @param type
         * @param listener
         */
        EventDispatcher.prototype.removeEventListener = function (type, listener) {
            if (this._events) {
                if ((type in this._events) && (this._events[type] instanceof Array)) {
                    for (var i = 0, l = this._events[type].length; i < l; ++i) {
                        if (this._events[type][i].listener === listener) {
                            this._events[type][i].dispatcher = null;
                            this._events[type][i].destruct();
                            this._events[type].splice(i, 1);
                            return;
                        }
                    }
                }
                else {
                    _log.warn('trying to remove event that has no listeners "' + type + '"');
                }
            }
        };
        /**
         * Removes all event listeners in this EventDispatcher. If a type is provided, only listeners for this type will be removed.
         * @param type
         */
        EventDispatcher.prototype.removeAllEventListeners = function (type) {
            if (this._events) {
                if (typeof type == 'undefined') {
                    for (type in this._events) {
                        if (this._events[type] instanceof Array) {
                            while (this._events[type].length) {
                                var data = this._events[type].shift();
                                data.dispatcher = null;
                                data.destruct();
                            }
                        }
                    }
                }
                else if ((type in this._events) && (this._events[type] instanceof Array)) {
                    while (this._events[type].length) {
                        var data = this._events[type].shift();
                        data.dispatcher = null;
                        data.destruct();
                    }
                }
                else {
                    _log.warn('trying to remove all events that does not exist "' + type + '"');
                }
            }
        };
        EventDispatcher.prototype.sort = function (e1, e2) {
            return e2.priority - e1.priority;
        };
        /**
         * Removes all event listeners en destructs the object
         */
        EventDispatcher.prototype.destruct = function () {
            this.removeAllEventListeners();
            this._target = null;
            this._events = null;
            _super.prototype.destruct.call(this);
        };
        return EventDispatcher;
    })(Destructible_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventDispatcher;
    var EventListenerData = (function () {
        function EventListenerData(dispatcher, type, listener, priority, once) {
            this.dispatcher = dispatcher;
            this.type = type;
            this.listener = listener;
            this.priority = priority;
            this.once = once;
            this._isDestructed = false;
        }
        EventListenerData.prototype.isDestructed = function () {
            return this._isDestructed;
        };
        EventListenerData.prototype.destruct = function () {
            if (this.dispatcher) {
                this.dispatcher.removeEventListener(this.type, this.listener);
            }
            this.dispatcher = null;
            this.type = null;
            this.listener = null;
            this._isDestructed = true;
        };
        return EventListenerData;
    })();
});
