//declare var window:window;
/**
 * @module Temple
 * @namespace temple.utils
 * @class Popup
 */
define(["require", "exports"], function (require, exports) {
    /**
     * With Popup you can create, manipulate and communicate between the window that opened the popup and the popup it self.
     *
     * [More info](https://github.com/mientjan/Popup)
     *
     * ![example](https://raw.githubusercontent.com/mientjan/Popup/master/screenshot.png)
     *
     * ## Example
     *
     * Creates new instance for a popup.
     *
     * ```
     * var popupWindow = new Popup('OAuth2.php', {
     *   'width':300,
     *   'height':150,
     *   'x':'center',
     *   'y':'center'
     *  });
     * ```
     *
     * Create a listener for 'success'.
     *
     * ```
     * popupWindow.addEventListener('success', function(response){
     *   alert('callback is called and this response is given:' + response);
     * });
     *
     * popupWindow.open();
     *```
     *
     * Popup is opened, in the popup you can send messages back too the page that has opened the popup.
     *
     * ```
     * Popup.dispatchEvent('success', {'message':'The Popup has opened'});
     * ```
     *
     * This can be done vice versa. So you can send messages from the main window to the popup. And from the popup to the main window. This is also possible when the main window and the popup are on different domains.
     *
     * Get properties from the popup.
     *
     * ```
     * var windowObject = authPopup.getWindow();
     * authPopup.get('status'); // The status bar at the bottom of the window.
     * authPopup.get('toolbar'); // The standard browser toolbar, with buttons such as Back and Forward.
     * authPopup.get('location'); // 1 The Location entry field where you enter the URL.
     * authPopup.get('menubar'); // The menu bar of the window
     * authPopup.get('directories'); // The standard browser directory buttons, such as What's New and What's Cool
     * authPopup.get('resizable'); // Allow/Disallow the user to resize the window.
     * authPopup.get('scrollbars'); // Enable the scrollbars if the document is bigger than the window
     * authPopup.get('height'); // Specifies the height of the window in pixels. (example: height='350')
     * authPopup.get('width'); // Specifies the width of the window in pixels.
     * authPopup.get('x'); // position of popup relative to screen/window
     * authPopup.get('y'); // position of popup relative to screen/window
     * ```
     *
     * Set properties. You can only set these properties before the popup is opened.
     *
     * ```
     * authPopup.set('status', true ); // The status bar at the bottom of the window.
     * authPopup.set('toolbar', true ); // The standard browser toolbar, with buttons such as Back and Forward.
     * authPopup.set('location', true ); // 1 The Location entry field where you enter the URL.
     * authPopup.set('menubar', true ); // The menu bar of the window
     * authPopup.set('directories', true ); // The standard browser directory buttons, such as What's New and What's Cool
     * authPopup.set('resizable', true ); // Allow/Disallow the user to resize the window.
     * authPopup.set('scrollbars', true ); // Enable the scrollbars if the document is bigger than the window
     * authPopup.set('height', 150 ); // Specifies the height of the window in pixels. (example: height='350')
     * authPopup.set('width', 300 ); // Specifies the width of the window in pixels.
     * ```
     *
     * Except for:
     *
     * ```
     * // position of popup relative to screen/window
     * authPopup.set('x', 'center' );
     * authPopup.set('x', 'left' );
     * authPopup.set('x', 'right' );
     *
     * // position of popup relative to screen/window
     * authPopup.set('y', 'top' );
     * authPopup.set('y', 'center' );
     * authPopup.set('y', 'bottom' );
     * ```
     *
     * @author Mient-jan Stelling <mientjan.stelling@gmail.com>
     * @class Popup
     * @param {string} url The url of the popup to open.
     * @param {IPopupOptions} options The second boundary value.
     * @constructor
     */
    var Popup = (function () {
        function Popup(url, options) {
            this._options = {
                'name': null,
                'status': 0,
                'toolbar': 0,
                'location': 0,
                'menubar': 0,
                'directories': 0,
                'resizable': 0,
                'scrollbars': 0,
                'height': 900,
                'width': 400,
                'x': 'center',
                'y': 'center' // position of Popup relative to screen/window
            };
            this._window = null;
            this._url = '';
            this._reference = -1;
            this._events = {};
            this.setOptions(options);
            this._url = url;
            if (!this._options.name) {
                if (typeof (window['UID']) == 'undefined') {
                    window['UID'] = new Date().getTime();
                }
                window['UID']++;
                this._options.name = window['UID'].toString();
            }
            Popup.subscribeEntity(this);
            if (Popup.Browser().name == 'ie' && Popup.Browser().version < 10) {
            }
            else {
                window.addEventListener('onmessage', function (e) {
                    try {
                        Popup.receiveMessage(e);
                    }
                    catch (err) {
                    }
                });
            }
        }
        /**
         * Returns information (name, version, platform and features) about the browser.
         *
         * @method Browser
         * @static
         * @return {any}
         */
        Popup.Browser = function () {
            var document = window.document;
            var ua = navigator.userAgent.toLowerCase(), platform = navigator.platform.toLowerCase(), UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0], mode = UA[1] == 'ie' && document['documentMode'];
            var Browser = {
                name: (UA[1] == 'version') ? UA[3] : UA[1],
                version: mode || parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),
                Platform: {
                    name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
                },
                Features: {
                    xpath: !!(document['evaluate']),
                    air: !!(window['runtime']),
                    query: !!(document.querySelector),
                    json: !!(window['JSON'])
                },
                Plugins: {}
            };
            return Browser;
        };
        Popup.subscribeEntity = function (pop) {
            pop._reference = Popup._count;
            Popup._reference[Popup._count] = pop;
            Popup._count++;
        };
        Popup.remove = function (o) {
            delete Popup._reference[o.reference];
        };
        Popup.addEventListener = function (name, fn) {
            if (typeof (Popup._events[name]) == 'undefined') {
                Popup._events[name] = [];
            }
            Popup._events[name].push(fn);
        };
        Popup.removeEventListener = function (name, fn) {
            if (typeof (Popup._events[name]) != 'undefined') {
                for (var i = 0; i < Popup._events[name].length; i++) {
                    if (Popup._events[name][i] == fn) {
                        Popup._events[name].splice(i);
                        --i;
                    }
                }
            }
        };
        Popup.dispatchEvent = function (name, properties, other) {
            if (other === void 0) { other = true; }
            if (!other) {
                if (typeof (Popup._events[name]) != 'undefined') {
                    for (var i = 0; i < Popup._events[name].length; i++) {
                        Popup._events[name][i].call(null, properties);
                    }
                }
            }
            else {
                var message = Popup.encodePostMessage(name, properties);
                if (this.Browser().name == 'ie' && Popup.Browser().verson < 10) {
                    window.opener['Popup'].receiveMessage({
                        origin: location['origin'],
                        data: message
                    });
                }
                else {
                    window.opener.postMessage(message, location['origin']);
                }
            }
        };
        Popup.receiveMessage = function (e) {
            var data = Popup.decodePostMessage(e.data);
            Popup.dispatchEvent(data.name, data.data, false);
        };
        Popup.close = function () {
            window.close();
        };
        Popup.encodePostMessage = function (name, properties) {
            return JSON.stringify({
                name: name,
                data: properties
            });
        };
        Popup.decodePostMessage = function (data) {
            try {
                return JSON.parse(data);
            }
            catch (e) {
            }
            return { name: '', data: {} };
        };
        Popup.prototype.setOptions = function (options) {
            for (var i in this._options) {
                if (this._options.hasOwnProperty(i)) {
                    if (typeof (options[i]) != 'undefined') {
                        this._options[i] = options[i];
                    }
                }
            }
        };
        Popup.prototype.set = function (key, value) {
            if (typeof (this._options[key]) !== 'undefined') {
                this._options[key] = value;
                if (key === 'x' || key === 'y') {
                    this._moveTo();
                }
            }
            return this;
        };
        /**
         * Get a property of the popup.
         *
         * @method get
         * @param {string} key The property to get.
         * @return {any}
         */
        Popup.prototype.get = function (key) {
            if (typeof (this._options[key]) !== 'undefined') {
                return this._options[key];
            }
            return false;
        };
        /**
         * Add an eventlistener.
         *
         * @method addEventListener
         * @param {string} name The event to add.
         * @param {Function} fn The function to call when the event happens.
         * @return {void}
         */
        Popup.prototype.addEventListener = function (name, fn) {
            Popup.addEventListener(name, fn);
        };
        /**
         * Remove an eventlistener.
         *
         * @method removeEventListener
         * @param {string} name The event to remove.
         * @param {Function} fn The function to remove.
         * @return {void}
         */
        Popup.prototype.removeEventListener = function (name, fn) {
            Popup.removeEventListener(name, fn);
        };
        /**
         * Dispatch an event.
         *
         * @method dispatchEvent
         * @param {string} name The event to dispatch.
         * @param {Function} fn The properties to dispatch.
         * @param {boolean} [other=true]
         * @return {void}
         */
        Popup.prototype.dispatchEvent = function (name, properties, other) {
            if (other === void 0) { other = true; }
            if (!other) {
                if (typeof (this._events[name]) != 'undefined') {
                    for (var i = 0; i < this._events[name].length; i++) {
                        this._events[name][i].call(null, properties);
                    }
                }
            }
            else {
                if (Popup.Browser().name == 'ie' && Popup.Browser().version < 10) {
                    this._window.Popup.receiveMessage(Popup.encodePostMessage(name, properties));
                }
                else {
                    this._window.postMessage(Popup.encodePostMessage(name, properties), '*');
                }
            }
        };
        Popup.prototype._receiveMessage = function (e) {
            var data = Popup.decodePostMessage(e.data);
            this.dispatchEvent(data.name, data.data, false);
        };
        /**
         * Open the popup
         *
         * @method open
         * @return {void}
         */
        Popup.prototype.open = function () {
            var params = [];
            var key, value;
            for (key in this._options) {
                if (this._options.hasOwnProperty(key)) {
                    value = this._options[key];
                    if (!(key == 'x' || key == 'y' || key == 'name')) {
                        if (key == 'width' || key == 'height') {
                            value = parseInt(value) + 'px';
                        }
                        params.push(key + '=' + value);
                    }
                }
            }
            this._window = window.open(this._url, this._options.name, params.join(','));
            if (Popup.Browser().name == 'ie' && Popup.Browser().version < 10) {
            }
            else {
                window.addEventListener('message', function (e) {
                    try {
                        Popup.receiveMessage(e);
                    }
                    catch (err) {
                    }
                }, false);
            }
            this._moveTo();
        };
        Popup.prototype._moveTo = function () {
            if (this._window == null) {
                return;
            }
            var x = this.get('x');
            var y = this.get('y');
            if (typeof (x) == 'string') {
                switch (x) {
                    case 'center':
                        {
                            x = (window.screen.width - this.get('width')) / 2;
                            break;
                        }
                    case 'left':
                        {
                            x = 0;
                            break;
                        }
                    case 'right':
                        {
                            x = (window.screen.width - this.get('width'));
                            break;
                        }
                }
            }
            if (typeof (y) == 'string') {
                switch (y) {
                    case 'center':
                        {
                            y = (window.screen.height - this.get('height')) / 2;
                            break;
                        }
                    case 'top':
                        {
                            y = 0;
                            break;
                        }
                    case 'bottom':
                        {
                            y = (window.screen.height - this.get('height'));
                            break;
                        }
                }
            }
            this._window.moveTo(parseInt(x), parseInt(y));
        };
        /**
         * Close the popup
         *
         * @method close
         * @return {void}
         */
        Popup.prototype.close = function () {
            if (this._window === null) {
                return; // Popup never opened or already closed
            }
            this._window.close();
            Popup.remove(this);
        };
        /**
         * Get the window object
         *
         * @method getWindow
         * @return {void}
         */
        Popup.prototype.getWindow = function () {
            return this._window;
        };
        Popup._count = 0;
        Popup._reference = [];
        Popup._events = {};
        Popup._closeInterval = null;
        return Popup;
    })();
    exports.Popup = Popup;
    window['Popup'] = Popup;
});
