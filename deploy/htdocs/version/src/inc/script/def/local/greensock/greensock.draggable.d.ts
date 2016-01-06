// This file is in support of tsd/greensock.d.ts,
// the tsd/greensock.d.ts definitions are incomplete, draggable is missing!

// Type definitions for Draggable 0.14.1
// Project: http://greensock.com/
// Definitions by: Lars van Braam <lars@mediamonks.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare class Draggable
{
	/**
	 * [static] Provides a more flexible way to create Draggable instances than the constructor (new Draggable(...)) because the
	 * Draggable.create() method can accommodate multiple elements (either as an array of elements or a jQuery object
	 * with many results) or even selector text like ".yourClass" which gets fed to whatever TweenLite.selector is
	 * (defaults to jQuery if it's loaded).
	 */
	static create(target:HTMLElement|string|Object|Array<HTMLElement>, vars:DraggableVars):Array<Draggable>;

	/**
	 * [static] Provides an easy way to get the Draggable instance that's associated with a particular DOM element.
	 */
	static get(target:HTMLElement|Object|string):Draggable;

	/**
	 * [static] The starting zIndex that gets applied by default when an element is pressed/touched
	 * (for positional types, like "x,y", "top,left", etc.
	 */
	static zindex:number;

	/**
	 * Registers a function that should be called each time a particular type of event occurs, like "drag" or "dragEnd".
	 */
	addEventListener(event:string, listener:Function):void;

	/**
	 * Immediately updates and applies bounds, ensuring that the target element is within the bounds (if any were defined).
	 */
	applyBounds(newBounds:HTMLElement|string|Object):Draggable;

	/**
	 * Disables the Draggable instance so that it cannot be dragged anymore (unless enable() is called).
	 */
	disable():Draggable;

	/**
	 * Enables the Draggable instance.
	 */
	enable():Draggable;

	/**
	 * Gets or sets the enabled state.
	 */
	enabled(value?:boolean):boolean

	/**
	 * You may force the Draggable to immediately stop interactively dragging by calling endDrag() and passing it the
	 * original mouse or touch event that initiated the stop - this is necessary because Draggable must inspect that
	 * event for various information like pageX, pageY, target, etc.
	 */
	endDrag(event:MouseEvent|TouchEvent):void;

	/**
	 * Returns the direction (right | left | up | down | left-up | left-down | right-up | right-down) as measured
	 * from either where the drag started (the default) or the moment-by-moment velocity, or its proximity to another
	 * element that you define.
	 */
	getDirection(from:string|HTMLElement):string;

	/**
	 * Provides an easy way to test whether or not the target element overlaps with a particular element (or the mouse
	 * position) according to whatever threshold you [optionally] define.
	 */
	hitTest(testObject:Object|string|HTMLElement, threshold:number|string):boolean;

	/**
	 * Disables the Draggable instance and removes it from the internal lookup table so that it is made eligible
	 * for garbage collection and it cannot be dragged anymore (unless enable() is called).
	 */
	kill():Draggable;

	/**
	 * This is rarely used, but you may force the Draggable to begin dragging by calling startDrag() and passing it
	 * the original mouse or touch event that initiated things - this is necessary because Draggable must inspect
	 * that event for various information like pageX, pageY, target, etc.
	 */
	startDrag(event:MouseEvent|TouchEvent):void;

	/**
	 * Returns the time (in seconds) that has elapsed since the last drag ended - this can be useful in
	 * situations where you want to skip certain actions if a drag just occurred.
	 */
	timeSinceDrag():number;

	/**
	 * Updates the Draggable's x and y properties so that they reflect the target element's current position.
	 */
	update(applyBounds?:boolean):Draggable;

	/**
	 * To enable auto-scrolling when a Draggable is dragged within 40px of an edge of a scrollable container, set
	 * autoScroll to a non-zero value, where 1 is normal speed, 2 is double-speed, etc. (you can use any number). For
	 * a more intuitive/natural feel, it will scroll faster as the mouse/touch gets closer to the edge. The default
	 * value is 0 (no auto-scrolling).
	 */
	autoScroll:number;
	/**
	 * [read-only] [only applies to type:"rotation"] The ending rotation of the Draggable instance which is calculated
	 * as soon as the mouse/touch is released after a drag, meaning you can use it to predict precisely where it'll
	 * land after a throwProps flick.
	 */
	endRotation:number;
	/**
	 * [read-only] The ending x (horizontal) position of the Draggable instance which is calculated as soon as the
	 * mouse/touch is released after a drag, meaning you can use it to predict precisely where it'll land after a
	 * throwProps flick.
	 */
	endX:number;
	/**
	 * [read-only] The ending y (vertical) position of the Draggable instance which is calculated as soon as the
	 * mouse/touch is released after a drag, meaning you can use it to predict precisely where it'll land after a
	 * throwProps flick.
	 */
	endY:number;
	/**
	 * Reports if the target of a Draggable is being thrown using a ThrowPropsPlugin tween.
	 */
	isThrowing:boolean;
	/**
	 * [read-only] The axis along which movement is locked during that particular drag (either "x" or "y").
	 * For example, if lockAxis is true on a Draggable of type:"x,y", and the user starts dragging horizontally,
	 * lockedAxis would be "y" because vertical movement won't be allowed during that drag.
	 */
	lockedAxis:string;
	/**
	 * [read-only] [only applies to type:"rotation"] When bounds are applied, maxRotation refers to the
	 * maximum "legal" rotation.
	 */
	maxRotation:number;
	/**
	 * [read-only] When bounds are applied, maxX refers to the maximum "legal" value of the horizontal property
	 * (either "x" or "left", depending on which type the Draggable is).
	 */
	maxX:number;
	/**
	 * [read-only] When bounds are applied, maxY refers to the maximum "legal" value of the vertical property
	 * (either "y" or "top", depending on which type the Draggable is).
	 */
	maxY:number;
	/**
	 * [read-only] [only applies to type:"rotation"] When bounds are applied, minRotation refers to the
	 * minimum "legal" rotation.
	 */
	minRotation:number;
	/**
	 * [read-only] When bounds are applied, minX refers to the minimum "legal" value of the horizontal property
	 * (either "x" or "left", depending on which type the Draggable is).
	 */
	minX:number;
	/**
	 * [read-only] When bounds are applied, minY refers to the minimum "legal" value of the vertical property
	 * (either "y" or "top", depending on which type the Draggable is).
	 */
	minY:number;
	/**
	 * [read-only] The last pointer event (either a mouse event or touch event) that affected the Draggable instance.
	 */
	pointerEvent:Object;
	/**
	 * [read-only] The x (horizontal) position of the pointer (mouse or touch) associated with the
	 * Draggable's last event (like event.pageX).
	 */
	pointerX:number;
	/**
	 * [read-only] The y (vertical) position of the pointer (mouse or touch) associated with the Draggable's
	 * last event (like event.pageY).
	 */
	pointerY:number;
	/**
	 * [read-only] [only applies to type:"rotation"] The current rotation (in degrees) of the Draggable instance.
	 */
	rotation:number;
	/**
	 * [read-only] A special object that gets created for type:"scroll" (or "scrollTop" or "scrollLeft")
	 * Draggables; this object manages the scrolling behavior, applying the necessary transforms or margins to
	 * accomplish overscrolling when necessary.
	 */
	scrollProxy:number;
	/**
	 * The object that is being dragged.
	 */
	target:Object;
	/**
	 * [read-only] The TweenLite instance that gets created as soon as the mouse (or touch) is released
	 * (when throwProps is true) - this allows you to check its duration or pause/resume or change its timeScale
	 * or whatever you want.
	 */
	tween:TweenLite;
	/**
	 * The vars object passed into the constructor which stores configuration variables like type, bounds, onPress,
	 * onDrag, etc.
	 */
	vars:DraggableVars;
	/**
	 * [read-only] The current x (horizontal) position of the Draggable instance.
	 */
	x:number;
	/**
	 * [read-only] The current y (vertical) position of the Draggable instance.
	 */
	y:number;
}

interface DraggableVars
{
	/**
	 *  indicates the type of dragging (the properties that the dragging should affect). Any of the following
	 *  work: "x,y" (basically the translateX and translateY of transform) | "top,left" | "rotation" |"scroll" |
	 *  "x" | "y" | "top" | "left" | "scrollTop" | "scrollLeft". The default is "x,y" for all browsers except old
	 *  versions of IE that don't natively support transforms in which case "top,left" is the default.
	 */
	type:string;

	/**
	 * to cause the draggable element to stay within the bounds of another DOM element (like a container), you can pass
	 * the element likebounds:document.getElementById("container") or a jQuery object is fine too, or even selector
	 * text like "#container" which gets passed to whatever TweenLite.selector is. If you prefer, you can define bounds
	 * as a rectangle instead, like bounds:{top:100, left:0, width:1000, height:800}which is based on the parent's
	 * coordinate system (top/left would be from the upper left corner of the parent). Or you can define specific
	 * maximum and minimum values like bounds:{minX:10, maxX:300, minY:50, maxY:500} or
	 * bounds:{minRotation:0, maxRotation:270}.
	 */
	bounds?:Element|string|Object;

	/**
	 * if true, dragging more than 2 pixels in either direction (horizontally or vertically) will lock movement into
	 * that axis so that the element can only be dragged that direction (horizontally or vertically, whichever had
	 * the most initial movement) during that drag. No diagonal movement will be allowed. Obviously this is only
	 * applicable for type:"x,y" and type:"top,left" and type:"scroll"Draggables. If you only want to allow vertical
	 * movement, you should use type:"y" or type:"top" ortype:"scrollTop" or if you only want to allow horizontal
	 * movement, you should use type:"x" ortype:"left" or type:"scrollLeft".
	 */
	lockAxis?:boolean;

	/**
	 * if you want only a certain area to trigger the dragging (like the top bar of a window) instead of the entire
	 * element, you can define a child element as the trigger, liketrigger:yourElement or trigger:"#topBar" or
	 * trigger:$("#yourID"). You may define the trigger as an element or a selector string (which gets fed to
	 * whatever TweenLite.selector is), or a jQuery object.
	 */
	trigger?:Element|string|Object;

	/**
	 * a number between 0 and 1 that controls the degree to which resistance is applied to the element as it goes
	 * outside the bounds (if any are applied), where 1 won't allow it to be dragged past the bounds at all, 0.75
	 * applies a lot of resistance (making the object travel at quarter-speed beyond the border while dragging),
	 * and 0.5 would be half-speed beyond the border, etc. This can even apply to rotation.
	 */
	edgeResistance?:number;

	/**
	 * a number between 0 and 1 that controls the degree to which resistance is constantly applied to the element as
	 * it is dragged, where 1 won't allow it to be dragged at all, 0.75 applies a lot of resistance (making the object
	 * travel at quarter-speed), and 0.5 would be half-speed, etc. This can even apply to rotation.
	 */
	dragResistance?:number;

	/**
	 * by default, for vertical/horizontal dragging, when an element is pressed/touched, it has its zIndex set to a
	 * high value (1000 by default) and that number gets incremented and applied to each new element that gets
	 * pressed/touched so that the stacking order looks correct (newly pressed objects rise to the top), but if you
	 * prefer to skip this behavior setzIndexBoost:false.
	 */
	zindexBoost?:number;

	/**
	 *  by default (except for type:"rotation"), the cursor css property of the element is set to "move" so that when
	 *  the mouse rolls over it, there's a visual cue indicating that it's moveable, but you may define a different
	 *  cursor if you prefer (as described at http://devdocs.io/css/cursor) likecursor:"pointer".
	 */
	cursor?:string;

	/**
	 * To enable auto-scrolling when a Draggable is dragged within 40px of an edge of a scrollable container, set
	 * autoScroll to a non-zero value, where 1 is normal speed, 2 is double-speed, etc. (you can use any number). For
	 * a more intuitive/natural feel, it will scroll faster as the mouse/touch gets closer to the edge. The default
	 * value is 0 (no auto-scrolling). For a demo, see http://codepen.io/GreenSock/pen/YPvdYv/?editors=001
	 */
	autoScroll?:number;

	/**
	 * allows you to define rules that get applied WHILE the element is being dragged (whereas regular snap affects
	 * only the end value(s), where the element lands after the drag is released). For example, maybe you want the
	 * rotation to snap to 10-degree increments while dragging or you want the x and y values to snap to a grid
	 * (whichever cell is closest). You can define theliveSnap in any of the following ways:
	 */
	liveSnap?:(endValue:number)=>number|boolean|Array<number>|{x?:(endValue:number)=>number|Array<number>, y?:(endValue:number)=>number|Array<number>};

	/**
	 * By default, Draggable will ignore clicks on <a>, <input> <select>,<button>, and <textarea> elements (as
	 * well as any element that has a data-clickable="true"attribute), allowing the browser's default behavior
	 * (like clicking on an input would give it focus and drop the cursor there to begin typing), but if you want
	 * Draggable to hijack those clicks and initiate dragging instead, set dragClickables:true.
	 */
	dragClickables?:boolean;

	/**
	 * ThrowPropsPlugin is the key to getting the momentum-based motion after the users' mouse (or touch) is
	 * released; to have Draggable auto-apply a ThrowPropsPlugin tween to the element when the mouse is released
	 * (or touch ends), you can set throwProps:true. Or for advanced effects, you can define the actual throwProps
	 * object that will get fed into theThrowPropsPlugin.to() call, like throwProps:{top:{min:0, max:1000,
	 * end:[0,200,400,600]}}. However, if you want ultimate control over the ThrowPropsPlugin tween, you can simply
	 * use an onDragEnd to call your own function that creates the tween. Note that ThrowPropsPlugin is a membership
	 * benefit of Club GreenSock, so it is not in the public downloads or github repository.
	 */
	throwProps?:boolean|Object

	/**
	 * a function that should be called each time the ThrowPropsPlugin tween updates/renders (basically on each "tick"
	 * of the engine while the tween is active). This only applies to the tween that gets generated after the user
	 * releases their mouse/touch - the function is not called while the user is dragging the element (that's what
	 * onDrag is for). By default, the scope of the onThrowUpdate is the Draggable instance itself, but you may define
	 * anonThrowUpdateScope if you prefer, just like any other TweenLite or TweenMax.
	 */
	onThrowUpdate?:Function;

	/**
	 * a function that should be called when the ThrowPropsPlugin tween finishes. This only applies to the tween that
	 * gets generated after the user releases their mouse/touch - the function is not called immediately when the user
	 * releases their mouse/touch - that's what onDragEnd is for. By default, the scope of the onThrowComplete is the
	 * Draggable instance itself, but you may define an onThrowCompleteScope if you prefer, just like any other
	 * TweenLite or TweenMax.
	 */
	onThrowComplete?:Function;

	/**
	 * a number (1000 by default) that controls how much resistance or friction there is when the mouse/touch is
	 * released and momentum-based motion is enabled (by setting throwProps:true). The larger the number, the more
	 * resistance and the quicker the motion decelerates. (requires ThrowPropsPlugin and setting throwProps:true,
	 * otherwisethrowResistance will simply be ignored.)
	 */
	throwResistance?:number;

	/**
	 * the maximum duration (in seconds) that the kinetic-based throwProps tween can last. ThrowPropsPlugin will
	 * automatically analyze the velocity and bounds and determine an appropriate duration (faster movements would
	 * typically result in longer tweens to decelerate), but you can cap the duration by defining a maxDuration. The
	 * default is 10 seconds. This has nothing to do with the maximum amount of time that the user can drag the object -
	 * it's only the throwProps tween that results after they release the mouse/touch. (requiresThrowPropsPlugin and
	 * setting throwProps:true, otherwise maxDuration will simply be ignored.)
	 */
	maxDuration?:number;

	/**
	 * the minimum duration (in seconds) that the kinetic-based throwProps tween should last. ThrowPropsPlugin will
	 * automatically analyze the velocity and bounds and determine an appropriate duration (faster movements would
	 * typically result in longer tweens to decelerate), but you can force the tween to take at least a certain
	 * amount of time by defining aminDuration. The default is 0.2 seconds. This has nothing to do with the minimum
	 * amount of time that the user can drag the object - it's only the throwProps tween that results after they
	 * release the mouse/touch. (requires ThrowPropsPlugin and setting throwProps:true, otherwise minDuration will
	 * simply be ignored.)
	 */
	minDuration?:number;

	/**
	 * affects how much overshooting is allowed before smoothly returning to the resting position at the end of the
	 * tween. This can happen when the initial velocity from the flick would normally cause it to exceed the
	 * bounds/min/max. The larger the overshootTolerance the more leeway the tween has to temporarily shoot past
	 * the max/min if necessary. The default is 1. If you don't want to allow any overshooting, you can set it to 0.
	 */
	overshootTolerance?:number;

	/**
	 * By default, Draggable requires that the mouse/touch moves more than 2 pixels in order to be interpreted as a
	 * drag, but you can change that threshold using minimumMovement. So minimumMovement:6 would require that the
	 * mouse/touch moves more than 6 pixels to be interpreted as a drag.
	 */
	miniumMovement?:number;

	/**
	 * by default, 3D transforms are used (when the browser supports them) in order to force the element onto its own
	 * layer on the GPU, thus speeding compositing. Typically this provides the best performance, but you can disable
	 * it by setting force3D:false. This may be a good idea if the element that you're dragging contains child elements
	 * that are animating.
	 */
	force3D?:boolean;

	/**
	 * Your Draggable may contain child elements that are "clickable", like links (<a> tags), <button> or <input>
	 * elements, etc. By default, it treats clicks/taps on those elements differently, not allowing the user to drag
	 * them. You can set dragClickables:true to override that, but it still may be handy to control exactly what
	 * Draggable considers to be a "clickable" element, so you can use your own function that accepts the clicked-on
	 * element as the only parameter and returns true or false accordingly. Draggable will call this function whenever
	 * the user presses their mouse/finger down on a Draggable, and the target of that event will be passed to your clickableTest function.
	 */
	clickableTest?:Function;

	/**
	 * a function that should be called as soon as the mouse (or touch) presses down on the element. Inside that
	 * function, "this" refers to the Draggable instance (unless you specifically set the scope using onPressScope),
	 * making it easy to access the target element (this.target) or the boundary coordinates (this.maxX, this.minX,
	 * this.maxY, and this.minY). By default, thepointerEvent (last mouse or touch event related to the Draggable)
	 * will be passed as the only parameter to the callback so that you can, for example, access its pageX or pageY
	 * or target or currentTarget, etc.
	 */
	onPress?:Function;

	/**
	 * a function that should be called as soon as the mouse (or touch) moves more than 2 pixels, meaning that dragging
	 * has begun. Inside that function, "this" refers to the Draggableinstance (unless you specifically set the scope
	 * using onDragStartScope), making it easy to access the target element (this.target) or the boundary coordinates
	 * (this.maxX, this.minX, this.maxY, and this.minY). By default, the pointerEvent (last mouse or touch event
	 * related to the Draggable) will be passed as the only parameter to the callback so that you can, for example,
	 * access its pageX or pageY or target or currentTarget, etc.
	 */
	onDragStart?:Function;

	/**
	 * a function that should be called every time the mouse (or touch) moves during the drag. Inside that function,
	 * "this" refers to the Draggable instance (unless you specifically set the scope using onDragScope), making it
	 * easy to access the target element (this.target) or the boundary coordinates (this.maxX, this.minX, this.maxY,
	 * and this.minY). By default, the pointerEvent(last mouse or touch event related to the Draggable) will be passed
	 * as the only parameter to the callback so that you can, for example, access its pageX or pageY or target or
	 * currentTarget, etc.
	 */
	onDrag?:Function;

	/**
	 * a function that should be called as soon as the mouse (or touch) is releasedafter the drag. Even if nothing is
	 * moved, the onDragEnd will always fire, whereas the onClick callback only fires if the mouse/touch moves less
	 * than 3 pixels. Inside that function, "this" refers to theDraggable instance (unless you specifically set the
	 * scope using onDragEndScope), making it easy to access the target element (this.target) or the boundary
	 * coordinates (this.maxX, this.minX, this.maxY, and this.minY). By default, the pointerEvent (last mouse or touch
	 * event related to the Draggable) will be passed as the only parameter to the callback so that you can, for
	 * example, access its pageX or pageY or target or currentTarget, etc.
	 */
	onDragEnd?:Function;

	/**
	 * a function that should be called as soon as the mouse (or touch) is released after having been pressed on the
	 * target element, regardless of whether or not anything was dragged. Inside that function, "this" refers to the
	 * Draggable instance (unless you specifically set the scope usingonReleaseScope), making it easy to access the
	 * target element (this.target) or the boundary coordinates (this.maxX, this.minX, this.maxY, and this.minY). By
	 * default, the pointerEvent(last mouse or touch event related to the Draggable) will be passed as the only
	 * parameter to the callback so that you can, for example, access its pageX or pageY or target or
	 * currentTarget, etc.
	 */
	onRelease?:Function;

	/**
	 *  a function that should be called only when the mouse/touch is pressed on the element and released without
	 *  moving 3 pixels or more. This makes it easier to discern the user's intent (click or drag). Inside that
	 *  function, "this" refers to the Draggable instance (unless you specifically set the scope using onClickScope),
	 *  making it easy to access the target element (this.target) or the boundary coordinates (this.maxX, this.minX,
	 *  this.maxY, and this.minY). By default, thepointerEvent (last mouse or touch event related to the Draggable)
	 *  will be passed as the only parameter to the callback so that you can, for example, access its pageX or pageY
	 *  or target or currentTarget, etc.
	 */
	onClick?:Function;

	/**
	 * an optional array of parameters to feed the onPress callback. For example,onPressParams:["drag started", 5]
	 * would fit with this code: onPress:function(message, num) { console.log("message: " + message + ", num: " + num); }
	 */
	onPressParams?:Array<any>;

	/**
	 * an optional array of parameters to feed the onDragStart callback. For example,
	 * onDragStartParams:["drag started", 5] would fit with this code:onDragStart:function(message, num) {
	 * console.log("message: " + message + ", num: " + num); }
	 */
	onDragStartParams?:Array<any>;

	/**
	 * an optional array of parameters to feed the onDragEnd callback. For example,
	 * onDragEndParams:["drag ended", 5] would fit with this code:onDragEnd:function(message, num) {
	 * console.log("message: " + message + ", num: " + num); }
	 */
	onDragParams?:Array<any>;

	/**
	 * an optional array of parameters to feed the onClick callback. For example,onClickParams:["clicked", 5]
	 * would fit with this code: onClick:function(message, num) { console.log("message: " + message + ", num: " + num); }
	 */
	onReleaseParams?:Array<any>;

	/**
	 * defines the scope of the onPress function (what "this" refers to inside that function).
	 */
	onPressScope?:Object;

	/**
	 * defines the scope of the onDragStart function (what "this" refers to inside that function).
	 */
	OnDragStartScope?:Object;

	/**
	 * defines the scope of the onDrag function (what "this" refers to inside that function).
	 */
	onDragScope?:Object;

	/**
	 * defines the scope of the onDragEnd function (what "this" refers to inside that function).
	 */
	onDragEndScope?:Object;

	/**
	 * defines the scope of the onRelease function (what "this" refers to inside that function).
	 */
	onRelaseScope?:Object;

	/**
	 * defines the scope of the onClick function (what "this" refers to inside that function).
	 */
	onClickScope?:Object;

	/**
	 *  a function that should be called as soon as movement is locked into the horizontal or vertical axis.
	 *  This happens when lockAxis is true and the user drags enough for Draggable to determine which axis to lock.
	 *  It also happens on touch-enabled devices when you have a Draggable whose type only permits it to drag along
	 *  one axis (like type:"x", type:"y", type:"left", or type:"top") and the user touch-drags and Draggable
	 *  determines the direction, either allowing native touch-scrolling or Draggable-induced dragging. Inside the
	 *  function, "this" refers to the Draggable instance, making it easy to access the locked axis (this.lockedAxis
	 *  which will either be "x" or "y"), or the target element (this.target), etc. By default, the pointerEvent
	 *  (last mouse or touch event related to the Draggable) will be passed as the only parameter to the callback so
	 *  that you can, for example, access its pageX or pageY or target or currentTarget, etc.
	 */
	onLockAxis?:Function;

	/**
	 * The scope to be used for all of the callbacks (onDrag, onDragEnd, onDragStart, etc). The scope is what
	 * "this" refers to inside any of the callbacks. The older callback-specific scope properties are deprecated
	 * but still work.
	 */
	callbackScope?:Object;

	/**
	 *  by default, allows you to native touch-scroll in the opposite direction as Draggables that are limited to one
	 *  axis . For example, a Draggable of type : " x " or " left " would permit native touch-scrolling in the vertical
	 *  direction , and type : " y " or " top " would permit native horizontal touch-scrolling.
	 */
	allowNativeTouchScrolling?:boolean;
}
