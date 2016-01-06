/**
 * This class contains the possible values for a MouseEvent. The MouseEvent interface represents events that occur due
 * to the user interacting with a pointing device (such as a mouse).
 *
 * @example
 * ```
 * this.element.addEventListener(MouseEvents.CLICK, <any>this.handleClick.bind(this));
 * ```
 *
 * @module Temple
 * @namespace temple.events
 * @class MouseEvents
 */
class MouseEvents
{
	/**
	 * The mousedown event is fired when a pointing device button (usually a mouse button) is pressed on an element.
	 * This event bubbles and is cancelable.
	 *
	 * @property MOUSEDOWN
	 * @type {string}
	 * @static
	 */
	public static MOUSEDOWN:string = 'mousedown';

	/**
	 * The mouseup event is fired when a pointing device button (usually a mouse button) is released over an element.
	 * This event bubbles and is cancelable.
	 *
	 * @property MOUSEUP
	 * @type {string}
	 * @static
	 */
	public static MOUSEUP:string = 'mouseup';

	/**
	 * The click event is fired when a pointing device button (usually a mouse button) is pressed and released on a
	 * single element.
	 * This event bubbles and is cancelable.
	 *
	 * @property CLICK
	 * @type {string}
	 * @static
	 */
	public static CLICK:string = 'click';

	/**
	 * The dblclick event is fired when a pointing device button (usually a mouse button) is clicked twice on a single
	 * element.
	 * This event bubbles and is cancelable.
	 *
	 * @property DBLCLICK
	 * @type {string}
	 * @static
	 */
	public static DBLCLICK:string = 'dblclick';

	/**
	 * The mousemove event is fired when a pointing device (usually a mouse) is moved while over an element.
	 * This event bubbles and is cancelable.
	 *
	 * @property MOUSEMOVE
	 * @type {string}
	 * @static
	 */
	public static MOUSEMOVE:string = 'mousemove';

	/**
	 * The mouseover event is fired when a pointing device is moved onto the element that has the listener attached or
	 * onto one of its children.
	 * This event bubbles and is cancelable.
	 *
	 * @property MOUSEOVER
	 * @type {string}
	 * @static
	 */
	public static MOUSEOVER:string = 'mouseover';

	/**
	 * The mouseout event is fired when a pointing device (usually a mouse) is moved off the element that has the
	 * listener attached or off one of its children.
	 * This event bubbles and is cancelable.
	 *
	 * @property MOUSEOUT
	 * @type {string}
	 * @static
	 */
	public static MOUSEOUT:string = 'mouseout';

	/**
	 * The mouseenter event is fired when a pointing device (usually a mouse) is moved over the element that has the
	 * listener attached.
	 * Similar to mouseover, it differs in that it doesn't bubble and that it isn't sent when the pointer is moved from
	 * one of its descendants' physical space to its own physical space.
	 *
	 * @property MOUSEENTER
	 * @type {string}
	 * @static
	 */
	public static MOUSEENTER:string = 'mouseenter';

	/**
	 * The mouseleave event is fired when a pointing device (usually a mouse) is moved off the element that has the
	 * listener attached.
	 * Similar to mouseout, it differs in that it doesn't bubble and that it isn't sent until the pointer has moved from
	 * its physical space and the one of all its descendants.
	 *
	 * @property MOUSELEAVE
	 * @type {string}
	 * @static
	 */
	public static MOUSELEAVE:string = 'mouseleave';
}

export default MouseEvents;