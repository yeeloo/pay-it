var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './ThrottleDebounce', 'lib/temple/events/BaseEvent', 'lib/temple/events/EventDispatcher'], function (require, exports, ThrottleDebounce_1, BaseEvent_1, EventDispatcher_1) {
    /**
     * Class that keeps track of the vertical scroll position of an element.
     */
    var ScrollTracker = (function (_super) {
        __extends(ScrollTracker, _super);
        function ScrollTracker(_targetElement, _axis) {
            var _this = this;
            if (_targetElement === void 0) { _targetElement = window; }
            if (_axis === void 0) { _axis = Axis.Y; }
            _super.call(this);
            this._targetElement = _targetElement;
            this._axis = _axis;
            this.trackingPoints = [];
            this.viewSize = 0;
            this.scrollSize = 0;
            this.viewStart = 0;
            this.viewEnd = 0;
            this._lastScrollPosition = 0;
            /**
             * Handles events thrown by ScrollTrackerPoint instances and bubbles them up to this
             * ScrollTracker instance.
             * @param event The event thrown.
             */
            this._pointEventHandler = function (event) {
                _this.dispatchEvent(event);
            };
            /**
             * Event handler called when the target element is scrolled. Will detect the new scroll
             * position and call checkInView() on all tracking points.
             */
            this._scrollHandler = function () {
                var isX = _this._axis == Axis.X;
                if (_this._targetElement === window) {
                    _this.viewStart = isX ? window.pageXOffset : window.pageYOffset;
                }
                else {
                    var target = _this._targetElement;
                    _this.viewStart = isX ? target.scrollLeft : target.scrollTop;
                }
                _this.viewEnd = _this.viewStart + _this.viewSize;
                var scrollingBack = _this.viewStart < _this._lastScrollPosition;
                _this._lastScrollPosition = _this.viewStart;
                for (var i = 0; i < _this.trackingPoints.length; i++) {
                    _this.trackingPoints[i].checkInView(scrollingBack);
                }
            };
            /**
             * Event handler called when the window resizes. Only used when the target of this ScrollTracker
             * instance is the window object.
             */
            this._windowResizeHandler = function () {
                _this.updateSize();
            };
            this.initEvents();
        }
        Object.defineProperty(ScrollTracker.prototype, "axis", {
            /**
             * Returns which axis this ScrollTracker instance is tracking.
             */
            get: function () {
                return this._axis;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollTracker.prototype, "target", {
            /**
             * Returns the target element this ScrollTracker instance is tracking.
             */
            get: function () {
                return this._targetElement;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Updates the size of the viewport of the target element.
         */
        ScrollTracker.prototype.updateSize = function () {
            var isX = this._axis == Axis.X;
            this.viewSize = isX ? $(this._targetElement).width() : $(this._targetElement).height();
            if (this._targetElement == window) {
                this.scrollSize = isX ? $(document).width() : $(document).height();
            }
            else {
                var target = this._targetElement;
                this.scrollSize = isX ? target.scrollWidth : target.scrollHeight;
            }
        };
        /**
         * Adds a new point of which we will detect when it enters and leaves the view.
         * @param position The position of this points in pixels. This is the distance from the start
         * or end of the target element depending on the 'side' parameter, measured horizontally or
         * vertically depending on the axis of this ScrollTracker instance.
         * @param side The side from which the 'position' parameter is defined. Side.START measures the
         * position from the top or left edge and Side.END will measure the position from the bottom
         * or right edge.
         * @returns {ScrollTrackerPoint} A reference to a ScrollTrackerPoint instance that can be
         * used to bind events, remove or update the point added.
         */
        ScrollTracker.prototype.addPoint = function (position, side) {
            if (side === void 0) { side = Side.START; }
            var point = new ScrollTrackerPoint(position, side, this);
            this.trackingPoints.push(point);
            point.addEventListener(ScrollTrackerEvent.ENTER_VIEW, this._pointEventHandler);
            point.addEventListener(ScrollTrackerEvent.LEAVE_VIEW, this._pointEventHandler);
            return point;
        };
        /**
         * Removes an existing point from this ScrollTracker. This point will be destructed and will
         * no longer throw events.
         * @param point The ScrollTrackerPoint instance to remove.
         * @returns {boolean} Boolean indicating if the point was found and removed successfully.
         */
        ScrollTracker.prototype.removePoint = function (point) {
            var index = this.trackingPoints.indexOf(point);
            if (index >= 0) {
                this.trackingPoints[index].destruct();
                this.trackingPoints.splice(index, 1);
                return true;
            }
            return false;
        };
        /**
         * Removes all points from this ScrollTracker instance. They will be destructed and will
         * no longer throw events.
         */
        ScrollTracker.prototype.removeAllPoints = function () {
            for (var i = 0; i < this.trackingPoints.length; i++) {
                this.trackingPoints[i].destruct();
            }
            this.trackingPoints.length = 0;
        };
        /**
         * Detructs this ScrollTracker and all points created on it. Removes all event handlers.
         */
        ScrollTracker.prototype.destruct = function () {
            $(this._targetElement).off(this.eventNamespace);
            $(window).off(this.eventNamespace);
            this.removeAllPoints();
            _super.prototype.destruct.call(this);
        };
        /**
         * Initialize scroll and resize events using jQuery. Resize events will only be used when
         * the target of ScrollTracker is 'window'. If the target is not window, updateSize() has
         * to be called manually to update the view size.
         */
        ScrollTracker.prototype.initEvents = function () {
            $(this._targetElement).on('scroll' + this.eventNamespace, ThrottleDebounce_1.default.throttle(this._scrollHandler, ScrollTracker._DEFAULT_THROTTLE_SCROLL));
            this._scrollHandler();
            if (this._targetElement === window) {
                $(window).on('resize' + this.eventNamespace, ThrottleDebounce_1.default.throttle(this._windowResizeHandler, ScrollTracker._DEFAULT_THROTTLE_RESIZE));
                this._windowResizeHandler();
            }
            else {
                this.updateSize();
            }
        };
        ScrollTracker._DEFAULT_THROTTLE_SCROLL = 1000 / 60;
        ScrollTracker._DEFAULT_THROTTLE_RESIZE = 200;
        return ScrollTracker;
    })(EventDispatcher_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ScrollTracker;
    /**
     * Enum for axis of the ScrollTracker. Use X for horizontal scrolling and Y for vertical scrolling.
     */
    (function (Axis) {
        Axis[Axis["X"] = 1] = "X";
        Axis[Axis["Y"] = 2] = "Y";
    })(exports.Axis || (exports.Axis = {}));
    var Axis = exports.Axis;
    /**
     * Enum for side of the ScrollTracker. START means top or left if the axis is Y or X, respectively.
     * END stands for bottom or right.
     */
    (function (Side) {
        Side[Side["START"] = 0] = "START";
        Side[Side["END"] = 1] = "END";
    })(exports.Side || (exports.Side = {}));
    var Side = exports.Side;
    /**
     * Events to thrown by ScrollTracker and ScrollTrackerPoint instances
     */
    var ScrollTrackerEvent = (function (_super) {
        __extends(ScrollTrackerEvent, _super);
        function ScrollTrackerEvent(type, point, side) {
            _super.call(this, type);
            this.point = point;
            this.side = side;
        }
        ScrollTrackerEvent.ENTER_VIEW = 'ScrollTrackerEvent.enterView';
        ScrollTrackerEvent.LEAVE_VIEW = 'ScrollTrackerEvent.leaveView';
        return ScrollTrackerEvent;
    })(BaseEvent_1.default);
    exports.ScrollTrackerEvent = ScrollTrackerEvent;
    /**
     * Instance created for every coordinate that a ScrollTracker tracks.
     */
    var ScrollTrackerPoint = (function (_super) {
        __extends(ScrollTrackerPoint, _super);
        function ScrollTrackerPoint(_position, _side, _tracker) {
            _super.call(this);
            this._position = _position;
            this._side = _side;
            this._tracker = _tracker;
            /**
             * Boolean indicating if the point is currently in view. Updated when checkInView() is called.
             */
            this.isInView = false;
            /**
             * Boolean indicating if the point is currently within the bounds of the target element.
             * Updated when checkInView() is called.
             */
            this.isInBounds = false;
            this.checkInView();
        }
        Object.defineProperty(ScrollTrackerPoint.prototype, "position", {
            /**
             * @returns {number} The current position of the point in pixels. This is the distance from the
             * start or end of the target element depending on the 'side' parameter, measured horizontally or
             * vertically depending on the axis of this ScrollTracker instance.
             */
            get: function () {
                return this._position;
            },
            /**
             * Change the position of this point. Executes checkInView to check if the point has entered or
             * leaved view.
             * @param position The position of this points in pixels. This is the distance from the start
             * or end of the target element depending on the 'side' parameter, measured horizontally or
             * vertically depending on the axis of this ScrollTracker instance.
             */
            set: function (position) {
                this._position = position;
                this.checkInView();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollTrackerPoint.prototype, "side", {
            /**
             * @returns {Side} The side of from which the position of this point is measured.
             */
            get: function () {
                return this._side;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Checks if this point is in view using it's position and the current scroll position saved on
         * the ScrollTracker. Updates the isInView property accordingly.
         * @return {boolean} True if this point is in view.
         */
        ScrollTrackerPoint.prototype.checkInView = function (scrollingBack) {
            if (scrollingBack === void 0) { scrollingBack = false; }
            var viewStart = this._tracker.viewStart;
            var viewEnd = this._tracker.viewEnd;
            var scrollSize = this._tracker.scrollSize;
            var positionFromStart = this._side == Side.START ? this._position : scrollSize - this._position;
            var isInView = viewStart <= positionFromStart && viewEnd >= positionFromStart;
            this.isInBounds = positionFromStart >= 0 && positionFromStart <= viewEnd;
            if (this.isInView != isInView) {
                var eventType = isInView ?
                    ScrollTrackerEvent.ENTER_VIEW : ScrollTrackerEvent.LEAVE_VIEW;
                var event = new ScrollTrackerEvent(eventType, this, (isInView ? scrollingBack : !scrollingBack) ? Side.START : Side.END);
                this.dispatchEvent(event);
                this.isInView = isInView;
            }
            return this.isInView;
        };
        /**
         * Destructs the ScrollTrackerPoint instance.
         */
        ScrollTrackerPoint.prototype.destruct = function () {
            this._tracker = null;
            _super.prototype.destruct.call(this);
        };
        return ScrollTrackerPoint;
    })(EventDispatcher_1.default);
    exports.ScrollTrackerPoint = ScrollTrackerPoint;
});
