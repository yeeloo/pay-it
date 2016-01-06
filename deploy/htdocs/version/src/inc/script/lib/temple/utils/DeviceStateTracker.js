var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'app/data/scss-shared/MediaQueries', 'lib/temple/utils/ThrottleDebounce', 'knockout', "lib/temple/core/Destructible"], function (require, exports, MediaQueries_1, ThrottleDebounce_1, ko, Destructible_1) {
    /**
     * Util class that tracks which media query is currently active using the
     * matchMedia API if available. If not available, it will use a state indicator
     * that updates using CSS.
     * The breakpoints are provided in a separate MediaQueries.js file, which is
     * shared with SCSS to generate the corresponding CSS.
     */
    var DeviceStateTracker = (function (_super) {
        __extends(DeviceStateTracker, _super);
        function DeviceStateTracker() {
            var _this = this;
            _super.call(this);
            /**
             * Indicating if the browser supports the matchMedia API
             */
            this.supportsMatchMedia = false;
            /**
             * Observable that holds the index of the currently active DeviceState in
             * the DeviceState enum in MediaQueries.js.
             */
            this.currentState = ko.observable(null);
            /**
             * Array of MediaQueryList instances for each device state. Only used if the
             * matchMedia API is supported.
             */
            this._queryLists = [];
            /**
             * Array containing the name of each device state as defined in the
             * MediaQueries.js file.
             */
            this._deviceStateNames = [];
            /**
             * Array containing a boolean for each device state that indicates if the
             * media query currently matches. When multiple media queries match, we will
             * set the state to the one with the largest index. Only used if the
             * matchMedia API is supported.
             */
            this._queryListMatches = [];
            /**
             * Reference to a state-indicator element that will be used to read the
             * currently active breakpoint if the matchMedia API is not supported.
             */
            this._stateIndicator = null;
            /**
             * Called whenever a MediaQueryList updates. Checks if the query matches
             * and stores the result in the queryListMatches_ array. Then calls
             * updateFromMatchMedia_() to find the current state from all matching
             * queries.
             * @param changedMql The MediaQueryList that changed
             */
            this.handleQueryChange = function (changedMql) {
                _this._queryLists.forEach(function (mql, index) {
                    if (mql.media == changedMql.media) {
                        _this._queryListMatches[index] = changedMql.matches;
                    }
                });
                _this.updateFromMatchMedia();
            };
            this.initTracking();
            this.currentStateName = ko.computed(function () {
                var state = _this.currentState();
                if (state === null) {
                    return null;
                }
                return _this._deviceStateNames[state];
            }, { pure: true });
        }
        /**
         * Initializes tracking of media queries using matchMedia if supported, using
         * a state indicator otherwise.
         */
        DeviceStateTracker.prototype.initTracking = function () {
            this._deviceStateNames = Object.keys(MediaQueries_1.DeviceState).filter(function (key) {
                return isNaN(parseInt(key, 10));
            });
            if (window.matchMedia) {
                this.supportsMatchMedia = true;
                this.initMatchMedia();
            }
            else {
                this.initStateIndicator();
            }
        };
        /**
         * Loops through each deviceState and adds a matchMedia listener for each.
         * Calls updateFromMatchMedia_ to initialize the current state.
         */
        DeviceStateTracker.prototype.initMatchMedia = function () {
            var _this = this;
            this._queryLists = this._deviceStateNames.map(function (stateName) {
                var mediaQuery = MediaQueries_1.mediaQueries[stateName];
                if (!mediaQuery) {
                    throw new Error("DeviceState " + stateName + " not found in the mediaQueries array.");
                }
                return window.matchMedia(MediaQueries_1.mediaQueries[stateName]);
            });
            this._queryLists.forEach(function (mql) {
                _this._queryListMatches.push(mql.matches);
                mql.addListener(_this.handleQueryChange);
            });
            this.updateFromMatchMedia();
        };
        /**
         * Takes the results from the matchMedia event listeners saved in the
         * queryListMatches_ property. Sets the last one in the array as the active
         * query. When the reverseDeviceStateOrder boolean is set to true, will
         * set the first one in this array.
         */
        DeviceStateTracker.prototype.updateFromMatchMedia = function () {
            var numQueries = this._queryListMatches.length;
            for (var i = 0; i < numQueries; i++) {
                var index = MediaQueries_1.reverseDeviceStateOrder ? i : numQueries - 1 - i;
                if (this._queryListMatches[index]) {
                    this.currentState(index);
                    break;
                }
            }
        };
        /**
         * Initializes tracking of the current media query using a state indicator
         * element. This element will hold the state name as content inside its
         * :before pseudo-element. On window resize, we will check the contents
         * of the pseudo-element to read the current state.
         */
        DeviceStateTracker.prototype.initStateIndicator = function () {
            this._stateIndicator = document.createElement('div');
            this._stateIndicator.className = 'state-indicator';
            document.body.appendChild(this._stateIndicator);
            $(window).on('resize' + this.eventNamespace, ThrottleDebounce_1.default.debounce(this.updateFromStateIndicator, 100, this));
            this.updateFromStateIndicator();
        };
        /**
         * Called on window resize. Reads the current state from the state indicator
         * element. Only used if the matchMedia API is unavailable.
         */
        DeviceStateTracker.prototype.updateFromStateIndicator = function () {
            var stateContent = window.getComputedStyle(this._stateIndicator, ':before').
                getPropertyValue('content');
            var state = parseInt(stateContent.replace(/['"]/g, ''), 10);
            this.currentState(state);
        };
        /**
         * Destruct this DeviceStateTracker instance and remove any event listeners.
         */
        DeviceStateTracker.prototype.destruct = function () {
            var _this = this;
            $(window).off(this.eventNamespace);
            this._queryLists.forEach(function (query) {
                query.removeListener(_this.handleQueryChange);
            });
            this._queryLists.length = 0;
            _super.prototype.destruct.call(this);
        };
        return DeviceStateTracker;
    })(Destructible_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DeviceStateTracker;
});
