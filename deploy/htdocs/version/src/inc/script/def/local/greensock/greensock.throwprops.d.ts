// This file is in support of tsd/greensock.d.ts,
// the tsd/greensock.d.ts definitions are incomplete, the ThrowPropsPlugin is missing!

// Type definitions for ThrowpropsPlugin 0.9.9
// Project: http://greensock.com/
// Definitions by: Lars van Braam <lars@mediamonks.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare class ThrowPropsPlugin
{
	/**
	 * [static] Determines the amount of change given a particular velocity, an easing equation, and the duration
	 * that the tween will last.
	 */
	static calculateChange(velocity:number, ease:Object, duration:number, checkPoint?:number):number;

	/**
	 * [static] Calculates the duration (in seconds) that it would take to move from a particular start value to an
	 * end value at the given initial velocity, decelerating according to a certain easing equation (like Strong.easeOut).
	 */
	static calculateDuration(start:number, end:number, velocity:number, ease:Object, checkPoint?:number):number;

	/**
	 * [static] Analyzes various throwProps variables (like initial velocities, max/min values, and resistance) and
	 * determines the appropriate duration.
	 */
	static calculateTweenDuration(target:Object, vars:Object, maxDuration?:number, minDuration?:number, overshootTolerance?:number):number

	/**
	 *  [static] Returns the current velocity of the given property and target object (only works if you started
	 *  tracking the property using the ThrowPropsPlugin.track() or VelocityTracker.track() method).
	 */
	static getVelocity(target:Object, prop:string):number;

	/**
	 * [static] Allows you to discern whether the velocity of a particular target or one of its properties is being
	 * tracked (typically initiated using the track() method).
	 */
	static isTracking(target:Object, prop?:string):boolean;

	/**
	 * [static] Automatically analyzes various throwProps variables (like velocity, max, min, and resistance) and
	 * creates a TweenLite instance with the appropriate duration.
	 */
	static to(target:Object, vars:Object, maxDuration?:number, minDuration?:number, overshootTolerance?:number):TweenLite;

	/**
	 * [static] Allows you to have the velocity of particular properties automatically tracked for you so that
	 * ThrowPropsPlugin tweens can access that data internally instead of manually calculating it and feeding it into each tween.
	 */
	static track(target:Object, props:string, type:string):VelocityTracker

	/**
	 * [static] Stops tracking the velocity of certain properties (or all properties of an object), like ones initiated
	 * with the track() method.
	 */
	static untrack(target:Object, props?:string):void;

	/**
	 * [static] The default resistance that is used to calculate how long it will take for the tweening property
	 * (or properties) to come to rest by the static ThrowPropsPlugin.to() and
	 * ThrowPropsPlugin.calculateTweenDuration() methods.
	 */
	static defaultResistance:number;
}

declare class VelocityTracker
{
	/**
	 * [static] Returns the VelocityTracker associated with a particular object.
	 */
	static getByTarget(target:Object):VelocityTracker;

	/**
	 * [static] Allows you to discern whether the velocity of a particular target or one of its properties is being
	 * tracked (typically initiated using the VelocityTracker.track() method).
	 */
	static isTracking(target:Object, prop:string):boolean;

	/**
	 * [static] Allows you to have the velocity of particular properties automatically tracked for you so that you
	 * can access them anytime using the VelocityTracker's getVelocity() method, like myTracker.getVelocity("y").
	 */
	static track(target:Object, props:string, type:string):VelocityTracker;

	/**
	 * [static] Stops tracking the velocity of certain properties (or all properties of an object), like ones
	 * initiated with the track() method.
	 */
	static untrack(target:Object, props:string):void

	/**
	 * Adds a property to track
	 */
	addProp(prop:string, type:string):void;

	/**
	 * Returns the current velocity of the given property.
	 */
	getVelocity(prop:string):number;

	/**
	 * Allows you to discern whether the velocity of a particular property is being tracked.
	 */
	isTrackingProp(prop:string):boolean;

	/**
	 * Stops tracking a particular property
	 */
	removeProp(prop:string):void;

	/**
	 * Returns the target object with which the VelocityTracker is associated.
	 */
	target:Object;
}
