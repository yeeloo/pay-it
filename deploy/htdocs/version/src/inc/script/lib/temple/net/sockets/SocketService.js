var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/events/EventDispatcher", "lib/temple/net/sockets/SocketEvent", "lib/temple/utils/MobileDetect", "../../utils/Log"], function (require, exports, EventDispatcher_1, SocketEvent_1, MobileDetect_1, Log_1) {
    /**
     *
     * @module Temple
     * @namespace temple.net.sockets
     * @class SocketService
     */
    var SocketService = (function (_super) {
        __extends(SocketService, _super);
        /**
         * Creates a new SocketService that will establish a connection to a socketserver with [SockJS](https://github.com/sockjs/sockjs-client). To establish a connection a MediaMonks specific connection stategy is used.
         *
         * Socket connect strategy:
         *
         * The client loads a list of servers from the given url.
         * The response also contains a preferred server index and a port to connect to.
         * The first connection with SockJS is made to the preferred server.
         * If the first connection fails, the code will try all the servers in the list one after another until a connection is established.
         * If no connection can be made to all of the servers in the list. A tiered (10s, 20s, 30s) timeout will start with a random delay.
         * After the timeout is completed the process is repeated until a connection can be made.
         *
         * @class SocketService
         * @constructor
         *
         * @param {string} url The url to connect to.
         * @param {boolean} [debug=true] Whether debug is enabled or disabled. If debug is enabled logs will be outputted to the console.
         */
        function SocketService(url) {
            _super.call(this);
            this._uniqueCallbackId = 0;
            this._reconnectTier = 0;
            this._reconnectDelayTiers = [
                10 * 1000,
                20 * 1000,
                30 * 1000
            ];
            this._maxRandomReconnectDelay = 5 * 1000;
            this._getServersTimeout = 2 * 1000;
            this._maxRandomGetServersDelay = 4 * 1000;
            this._connect = false;
            this._log = new Log_1.default('lib.temple.net.sockets.SocketService');
            this.url = url;
        }
        /**
         * Connects to a server.
         *
         * @method connect
         * @returns {void}
         */
        SocketService.prototype.connect = function () {
            this._connect = true;
            if (this.isConnected()) {
                // make sure we have disconnected
                this._log.error('SocketService::Connect::AlreadyConnected');
                return;
            }
            this._log.info('Connect');
            this._servers = [];
            this._currentServerIndex = 0;
            this._reconnectTier = 0;
            this.forceConnect();
        };
        /**
         * Returns if there is already a connection to the server.
         *
         * @method isConnected
         * @returns {boolean}
         */
        SocketService.prototype.isConnected = function () {
            return typeof this._socket != 'undefined' && this._socket.readyState == SockJS.OPEN;
        };
        /**
         * Disconnects the client from the server.
         *
         * @method disconnect
         * @returns {void}
         */
        SocketService.prototype.disconnect = function () {
            this._connect = false;
            clearTimeout(this._reconnectTimeout);
            if (typeof this._socket == 'undefined') {
                return;
            }
            // remove event listeners
            // prevents handleSocketClosed from firing
            // remove the event listener so it doesn't attempt to reconnect
            this.removeEventListeners(this._socket);
            var result = this._socket.close();
            this._log.info('Disconnect', result);
            this._socket = undefined;
        };
        /**
         * Sends a message to the socket server.
         *
         * @method send
         * @param {string} type The type of the message to send.
         * @param {string} [action] The action of the message to send.
         * @param {any} [data] The data of the message to send.
         * @returns {void}
         */
        SocketService.prototype.send = function (type, action, data) {
            if (!this.isConnected()) {
                throw new Error("Not connected");
            }
            var message = { t: type };
            if (typeof data != 'undefined') {
                message["d"] = data;
            }
            if (typeof action != 'undefined') {
                message["a"] = action;
            }
            this._log.info("send", message);
            this._socket.send(JSON.stringify(message));
        };
        /**
         * Sends a request to the socket server. The request method is a shortcut method that calls the {{#crossLink "temple.net.sockets.SocketService/send:method"}}{{/crossLink}} method and handles the response from the server in the form of a seperate socket message with the same action.
         *
         * @method request
         * @param {string} action The action of the request to send. The action is also used to link the message from the server to the request.
         * @param {any} [data] The data of the request to send.
         * @param {(result:IResult<any>) => any} [callback] The callback that is called when the server responds with a message with the same action as the request.
         * @returns {void}
         */
        SocketService.prototype.request = function (action, data, callback) {
            var handler = this.addEventListener(SocketEvent_1.default.MESSAGE, function (event) {
                if (event.action == action) {
                    handler.destruct();
                    callback(event.data);
                }
            });
            this.send(REQUEST, action, data);
        };
        SocketService.prototype.forceConnect = function () {
            this._log.info('ForceConnect');
            if (!this.url) {
                throw new Error("URL not set");
            }
            if (!this._connect) {
                return;
            }
            if (this._servers.length > 0 && this._currentServerIndex < this._servers.length) {
                if (!this._protocol) {
                    this._protocol = this.url.substr(0, this.url.indexOf("://") + 3);
                }
                this._log.info("Connect to server: '" + (this._protocol + this._servers[this._currentServerIndex] + ':' + this._port) + "'");
                this._log.info("Protocols: ", this.getProtocols());
                this._socket = new SockJS(this._protocol + this._servers[this._currentServerIndex] + ':' + this._port + '/soccom', undefined, {
                    debug: false,
                    devel: true,
                    protocols_whitelist: this.getProtocols()
                });
                this.addEventListeners(this._socket);
            }
            else {
                this.getServers();
            }
        };
        SocketService.prototype.getServers = function () {
            var _this = this;
            this._log.info("getServers", this.url);
            $.ajax(this.url, {
                timeout: 5000,
                dataType: "jsonp",
                jsonpCallback: "connectCb"
            }).done(function (data) {
                if (data && data.servers && data.servers.length > 0) {
                    _this._log.info('getServers: Servers loaded', data);
                    _this._servers = data.servers;
                    _this._port = data.port;
                    if (data.preferred && !isNaN(data.preferred) && data.preferred < _this._servers.length && data.preferred > 0) {
                        _this._servers.unshift(_this._servers.splice(data.preferred, 1)[0]);
                    }
                    _this.forceConnect();
                }
                else {
                    _this.dispatchEvent(new SocketEvent_1.default(SocketEvent_1.default.NO_SERVERS_AVAILABLE));
                    _this._log.warn('getServers: Unable to load servers: no servers available');
                    _this.reconnect();
                }
            }).fail(function () {
                _this.dispatchEvent(new SocketEvent_1.default(SocketEvent_1.default.NO_SERVERS_AVAILABLE));
                _this._log.warn('getServers: Unable to load servers: cannot connect to load balancer');
                _this.reconnect();
            });
        };
        SocketService.prototype.getProtocols = function () {
            var mobileDetect = new MobileDetect_1.default();
            //fix for native android browser that has websocket support in browser and webview but can't connect in webview
            if (mobileDetect.is('androidos') && !mobileDetect.is('chrome') && !mobileDetect.is('firefox') && !mobileDetect.is('opera')) {
                return ['xdr-streaming', 'xhr-streaming', 'iframe-eventsource', 'iframe-htmlfile', 'xdr-polling', 'xhr-polling', 'iframe-xhr-polling', 'jsonp-polling'];
            }
            return window['WebSocket'] ? ['websocket'] : ['xdr-streaming', 'xhr-streaming', 'iframe-eventsource', 'xdr-polling', 'xhr-polling', 'iframe-xhr-polling', 'jsonp-polling', 'iframe-htmlfile'];
        };
        SocketService.prototype.reconnect = function () {
            var _this = this;
            clearTimeout(this._reconnectTimeout);
            var delay = 0;
            if (this._servers.length == 0) {
                this._log.warn('Reconnect: No servers loaded');
                this._servers = [];
                this._currentServerIndex = 0;
                delay = this._getServersTimeout + Math.round(Math.random() * this._maxRandomGetServersDelay);
            }
            else if (this._currentServerIndex == this._servers.length - 1) {
                this._servers = [];
                this._currentServerIndex = 0;
                this._log.warn('Reconnect: No servers left');
                delay = this._reconnectDelayTiers[this._reconnectTier] + Math.round(Math.random() * this._maxRandomReconnectDelay);
                this._reconnectTier = Math.min(this._reconnectTier + 1, this._reconnectDelayTiers.length - 1);
                this.dispatchEvent(new SocketEvent_1.default(SocketEvent_1.default.UNABLE_TO_CONNECT));
            }
            else {
                this._log.info('Reconnect: Try next server');
                this._currentServerIndex++;
                delay = 0;
            }
            this._log.info('Reconnect with delay:', delay);
            this._reconnectTimeout = setTimeout(function () { return _this.forceConnect(); }, delay);
            this.dispatchEvent(new SocketEvent_1.default(SocketEvent_1.default.RECONNECT));
        };
        SocketService.prototype.addEventListeners = function (socket) {
            this._uniqueCallbackId = new Date().getTime();
            this._log.info('AddEventListeners with callback ID', this._uniqueCallbackId);
            this._handleSocketOpened = this.handleSocketOpened.bind(this, this._uniqueCallbackId);
            this._handleSocketMessage = this.handleSocketMessage.bind(this, this._uniqueCallbackId);
            this._handleSocketClosed = this.handleSocketClosed.bind(this, this._uniqueCallbackId);
            socket.addEventListener('open', this._handleSocketOpened);
            socket.addEventListener('message', this._handleSocketMessage);
            socket.addEventListener('close', this._handleSocketClosed);
        };
        SocketService.prototype.removeEventListeners = function (socket) {
            socket.removeEventListener('open', this._handleSocketOpened);
            socket.removeEventListener('message', this._handleSocketMessage);
            socket.removeEventListener('close', this._handleSocketClosed);
        };
        SocketService.prototype.handleSocketOpened = function (uniqueCallbackId) {
            if (uniqueCallbackId != this._uniqueCallbackId) {
                this._log.warn('Socket opened, but conflicted by different callback IDs:', uniqueCallbackId, this._uniqueCallbackId);
                return;
            }
            this._log.info('Socket opened without conflicts');
            clearTimeout(this._reconnectTimeout);
            // reset the reconnect tier
            this._reconnectTier = 0;
            this._currentServerIndex = 0;
            this._servers = [];
            this.dispatchEvent(new SocketEvent_1.default(SocketEvent_1.default.OPENED));
        };
        SocketService.prototype.handleSocketClosed = function (uniqueCallbackId, e) {
            if (uniqueCallbackId != this._uniqueCallbackId) {
                this._log.warn('Socket closed, but conflicted by different callback IDs:', uniqueCallbackId, this._uniqueCallbackId);
                return;
            }
            this._log.info('Socket closed without conflicts');
            this.reconnect();
            this.dispatchEvent(new SocketEvent_1.default(SocketEvent_1.default.CLOSED));
        };
        SocketService.prototype.handleSocketMessage = function (uniqueCallbackId, e) {
            if (uniqueCallbackId != this._uniqueCallbackId) {
                this._log.warn('Message received, but conflicted by different callback IDs:', uniqueCallbackId, this._uniqueCallbackId);
                return;
            }
            var message = JSON.parse(e.data);
            this._log.info('Message', message.t + ": " + message.a, message.d);
            this.dispatchEvent(new SocketEvent_1.default(SocketEvent_1.default.MESSAGE, message.a, message.e, message.d, message.n ? new Date(message.n * 1000) : null));
        };
        return SocketService;
    })(EventDispatcher_1.default);
    var REQUEST = "request";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SocketService;
});
