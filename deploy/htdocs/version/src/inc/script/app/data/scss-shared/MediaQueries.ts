/**
 * Define your media queries here. These media queries will be available in SCSS as a map under the variable
 * $mediaQueries. They can be used in SCSS files by using the respond-to mixin. For example:
 * @include respond-to(X_SMALL) { ... }
 */
export var mediaQueries:{[breakpoint:string]:string;} = {
	X_SMALL : "(max-width: 479px)",
	SMALL : "(min-width: 480px)",
	MEDIUM : "(min-width: 768px)",
	LARGE : "(min-width: 1024px)",
	MEDIUM_ISOLATE : "(min-width: 768px) and (max-width: 1023px)"
};

/**
 * This enum is used by the DeviceStateTracker class to determine which of the media queries in
 * the mediaQueries object above are considered 'device states'. Names of this enum have to
 * correspond with one of the keys in the mediaQueries object. When using the DeviceStateTracker,
 * make sure you have enough device states so that there will always be one with a matching media query.
 *
 * At any time only one "device state" will be active. This will be the last name below that has a
 * matching breakpoint. This is usually convenient for mobile-first designs. If you want to reverse
 * this order (for desktop-first designs, for example), set the reverseDeviceState boolean below
 * to 'true'.
 */
export enum DeviceState {
	X_SMALL,
	SMALL,
	MEDIUM,
	LARGE
}

/**
 * The DeviceStateTracker will set the current deviceState to the last DeviceState with a
 * breakpoint that matches. This is usually desired in mobile-first designs. Set this value to
 * true if the tracker should choose the first matching DeviceState instead.
 */
export var reverseDeviceStateOrder:boolean = false;

