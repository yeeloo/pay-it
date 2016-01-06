var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/events/BaseEvent"], function (require, exports, BaseEvent_1) {
    /**
     * @module Temple
     * @namespace temple.net.sockets
     * @class SocketEvent
     */
    var SocketEvent = (function (_super) {
        __extends(SocketEvent, _super);
        /**
         * Event dispatched by {{#crossLink "temple.net.sockets.SocketService"}}SocketService{{/crossLink}}.
         *
         * @class SocketEvent
         * @constructor
         * @param {string} type
         * @param {any} [action=null]
         * @param {any} [event=null]
         * @param {any} [data=null]
         * @param {Date} [time=null]
         */
        function SocketEvent(type, action, event, data, time) {
            if (action === void 0) { action = null; }
            if (event === void 0) { event = null; }
            if (data === void 0) { data = null; }
            if (time === void 0) { time = null; }
            _super.call(this, type);
            this.action = action;
            this.event = event;
            this.data = data;
            this.time = time;
        }
        /**
         * Dispatched when {{#crossLink "temple.net.sockets.SocketService"}}SocketService{{/crossLink}} starts connecting to the server.
         *
         * @static
         * @property CONNECTING
         * @type string
         * @default 'SocketEvent.connecting'
         */
        SocketEvent.CONNECTING = 'SocketEvent.connecting';
        /**
         * Dispatched when a socket connection is established with the server.
         *
         * @static
         * @property OPENED
         * @type string
         * @default 'SocketEvent.opened'
         */
        SocketEvent.OPENED = 'SocketEvent.opened';
        /**
         * Dispatched when a socket connection is closed.
         *
         * @static
         * @property CLOSED
         * @type string
         * @default 'SocketEvent.closed'
         */
        SocketEvent.CLOSED = 'SocketEvent.closed';
        /**
         * Dispatched when the {{#crossLink "temple.net.sockets.SocketService"}}SocketService{{/crossLink}} tries to reconnect to the server.
         *
         * @static
         * @property RECONNECT
         * @type string
         * @default 'SocketEvent.reconnect'
         */
        SocketEvent.RECONNECT = 'SocketEvent.reconnect';
        /**
         * Dispatched when the server doesn't return socketservers to establish a connection to.
         *
         * @static
         * @property NO_SERVERS_AVAILABLE
         * @type string
         * @default 'SocketEvent.no_servers_available'
         */
        SocketEvent.NO_SERVERS_AVAILABLE = 'SocketEvent.no_servers_available';
        /**
         * Dispatched when a message from the server is received.
         *
         * @static
         * @property MESSAGE
         * @type string
         * @default 'SocketEvent.message'
         */
        SocketEvent.MESSAGE = 'SocketEvent.message';
        /**
         * Dispatched when the {{#crossLink "temple.net.sockets.SocketService"}}SocketService{{/crossLink}} can't establish a connection to the server.
         *
         * @static
         * @property UNABLE_TO_CONNECT
         * @type string
         * @default 'SocketEvent.unable_to_connect'
         */
        SocketEvent.UNABLE_TO_CONNECT = 'SocketEvent.unable_to_connect';
        return SocketEvent;
    })(BaseEvent_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SocketEvent;
});
