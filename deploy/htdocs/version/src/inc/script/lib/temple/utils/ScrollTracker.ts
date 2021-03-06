/* tslint:disable:no-unused-variable */
import refdef = require('def/ReferenceDefinitions');
/* tslint:enable:no-unused-variable */
import ThrottleDebounce from './ThrottleDebounce';
import Destructible  from 'lib/temple/core/Destructible';
import BaseEvent from 'lib/temple/events/BaseEvent';
import EventDispatcher from 'lib/temple/events/EventDispatcher';

/**
 * Class that keeps track of the vertical scroll position of an element.
 */
export default class ScrollTracker extends EventDispatcher
{
	private static _DEFAULT_THROTTLE_SCROLL:number = 1000 / 60;
	private static _DEFAULT_THROTTLE_RESIZE:number = 200;

	public trackingPoints:ScrollTrackerPoint[] = [];

	public viewSize:number = 0;
	public scrollSize:number = 0;
	public viewStart:number = 0;
	public viewEnd:number = 0;

	private _lastScrollPosition:number = 0;

	constructor(private _targetElement:HTMLElement|Window = window, private _axis:Axis = Axis.Y)
	{
		super();

		this.initEvents();
	}

	/**
	 * Returns which axis this ScrollTracker instance is tracking.
	 */
	public get axis():Axis
	{
		return this._axis;
	}

	/**
	 * Returns the target element this ScrollTracker instance is tracking.
	 */
	public get target():HTMLElement|Window
	{
		return this._targetElement;
	}

	/**
	 * Updates the size of the viewport of the target element.
	 */
	public updateSize():void
	{
		var isX = this._axis == Axis.X;
		this.viewSize = isX ? $(this._targetElement).width() : $(this._targetElement).height();

		if (this._targetElement == window)
		{
			this.scrollSize = isX ? $(document).width() : $(document).height();
		}
		else
		{
			var target = <HTMLElement> this._targetElement;
			this.scrollSize = isX ? target.scrollWidth : target.scrollHeight;
		}
	}

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
	public addPoint(position:number, side:Side = Side.START):ScrollTrackerPoint
	{
		var point = new ScrollTrackerPoint(position, side, this);
		this.trackingPoints.push(point);
		point.addEventListener(ScrollTrackerEvent.ENTER_VIEW, this._pointEventHandler);
		point.addEventListener(ScrollTrackerEvent.LEAVE_VIEW, this._pointEventHandler);

		return point;
	}

	/**
	 * Removes an existing point from this ScrollTracker. This point will be destructed and will
	 * no longer throw events.
	 * @param point The ScrollTrackerPoint instance to remove.
	 * @returns {boolean} Boolean indicating if the point was found and removed successfully.
	 */
	public removePoint(point:ScrollTrackerPoint):boolean
	{
		var index = this.trackingPoints.indexOf(point);
		if (index >= 0)
		{
			this.trackingPoints[index].destruct();
			this.trackingPoints.splice(index, 1);
			return true;
		}

		return false;
	}

	/**
	 * Removes all points from this ScrollTracker instance. They will be destructed and will
	 * no longer throw events.
	 */
	public removeAllPoints():void
	{
		for (var i = 0; i < this.trackingPoints.length; i++)
		{
			this.trackingPoints[i].destruct();
		}
		this.trackingPoints.length = 0;
	}

	/**
	 * Detructs this ScrollTracker and all points created on it. Removes all event handlers.
	 */
	public destruct():void
	{
		$(this._targetElement).off(this.eventNamespace);
		$(window).off(this.eventNamespace);

		this.removeAllPoints();

		super.destruct();
	}

	/**
	 * Initialize scroll and resize events using jQuery. Resize events will only be used when
	 * the target of ScrollTracker is 'window'. If the target is not window, updateSize() has
	 * to be called manually to update the view size.
	 */
	private initEvents():void
	{
		$(this._targetElement).on('scroll' + this.eventNamespace, ThrottleDebounce.throttle(
			this._scrollHandler,
			ScrollTracker._DEFAULT_THROTTLE_SCROLL
		));
		this._scrollHandler();

		if (this._targetElement === window)
		{
			$(window).on('resize' + this.eventNamespace, ThrottleDebounce.throttle(
				this._windowResizeHandler,
				ScrollTracker._DEFAULT_THROTTLE_RESIZE
			));

			this._windowResizeHandler();
		}
		else
		{
			this.updateSize();
		}
	}

	/**
	 * Handles events thrown by ScrollTrackerPoint instances and bubbles them up to this
	 * ScrollTracker instance.
	 * @param event The event thrown.
	 */
	private _pointEventHandler = (event:ScrollTrackerEvent) =>
	{
		this.dispatchEvent(event);
	};

	/**
	 * Event handler called when the target element is scrolled. Will detect the new scroll
	 * position and call checkInView() on all tracking points.
	 */
	private _scrollHandler = () =>
	{
		var isX = this._axis == Axis.X;
		if (this._targetElement === window)
		{
			this.viewStart = isX ? window.pageXOffset : window.pageYOffset;
		}
		else
		{
			var target = <HTMLElement> this._targetElement;
			this.viewStart = isX ? target.scrollLeft : target.scrollTop;
		}

		this.viewEnd = this.viewStart + this.viewSize;
		var scrollingBack = this.viewStart < this._lastScrollPosition;
		this._lastScrollPosition = this.viewStart;

		for (var i = 0; i < this.trackingPoints.length; i++)
		{
			this.trackingPoints[i].checkInView(scrollingBack);
		}
	};

	/**
	 * Event handler called when the window resizes. Only used when the target of this ScrollTracker
	 * instance is the window object.
	 */
	private _windowResizeHandler = () =>
	{
		this.updateSize();
	};
}

/**
 * Enum for axis of the ScrollTracker. Use X for horizontal scrolling and Y for vertical scrolling.
 */
export enum Axis {
	X = 1,
	Y = 1 << 1
}

/**
 * Enum for side of the ScrollTracker. START means top or left if the axis is Y or X, respectively.
 * END stands for bottom or right.
 */
export enum Side {
	START,
	END
}

/**
 * Events to thrown by ScrollTracker and ScrollTrackerPoint instances
 */
export class ScrollTrackerEvent extends BaseEvent
{
	public static ENTER_VIEW:string = 'ScrollTrackerEvent.enterView';
	public static LEAVE_VIEW:string = 'ScrollTrackerEvent.leaveView';

	constructor(type:string,
	            public point:ScrollTrackerPoint,
	            public side:Side)
	{
		super(type);
	}
}

/**
 * Instance created for every coordinate that a ScrollTracker tracks.
 */
export class ScrollTrackerPoint extends EventDispatcher
{
	/**
	 * Boolean indicating if the point is currently in view. Updated when checkInView() is called.
	 */
	public isInView:boolean = false;
	/**
	 * Boolean indicating if the point is currently within the bounds of the target element.
	 * Updated when checkInView() is called.
	 */
	public isInBounds:boolean = false;

	constructor(private _position:number,
	            private _side:Side,
	            private _tracker:ScrollTracker)
	{
		super();

		this.checkInView();
	}

	/**
	 * Change the position of this point. Executes checkInView to check if the point has entered or
	 * leaved view.
	 * @param position The position of this points in pixels. This is the distance from the start
	 * or end of the target element depending on the 'side' parameter, measured horizontally or
	 * vertically depending on the axis of this ScrollTracker instance.
	 */
	public set position(position:number)
	{
		this._position = position;
		this.checkInView();
	}

	/**
	 * @returns {number} The current position of the point in pixels. This is the distance from the
	 * start or end of the target element depending on the 'side' parameter, measured horizontally or
	 * vertically depending on the axis of this ScrollTracker instance.
	 */
	public get position():number
	{
		return this._position;
	}

	/**
	 * @returns {Side} The side of from which the position of this point is measured.
	 */
	public get side():Side
	{
		return this._side;
	}

	/**
	 * Checks if this point is in view using it's position and the current scroll position saved on
	 * the ScrollTracker. Updates the isInView property accordingly.
	 * @return {boolean} True if this point is in view.
	 */
	public checkInView(scrollingBack:boolean = false):boolean
	{
		var viewStart = this._tracker.viewStart;
		var viewEnd = this._tracker.viewEnd;
		var scrollSize = this._tracker.scrollSize;
		var positionFromStart = this._side == Side.START ? this._position : scrollSize - this._position;
		var isInView = viewStart <= positionFromStart && viewEnd >= positionFromStart;
		this.isInBounds = positionFromStart >= 0 && positionFromStart <= viewEnd;

		if (this.isInView != isInView)
		{
			var eventType = isInView ?
				ScrollTrackerEvent.ENTER_VIEW : ScrollTrackerEvent.LEAVE_VIEW;

			var event = new ScrollTrackerEvent(
				eventType,
				this,
				(isInView ? scrollingBack : !scrollingBack) ? Side.START : Side.END
			);

			this.dispatchEvent(event);
			this.isInView = isInView;
		}

		return this.isInView;
	}

	/**
	 * Destructs the ScrollTrackerPoint instance.
	 */
	public destruct()
	{
		this._tracker = null;

		super.destruct();
	}
}
