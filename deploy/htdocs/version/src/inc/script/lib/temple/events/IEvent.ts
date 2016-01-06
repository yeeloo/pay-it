import IEventDispatcher from "./IEventDispatcher";

interface IEvent
{
	type:string;
	cancelable:boolean;

	/**
	 * The event target.
	 */
	target:IEventDispatcher;

	_stopImmediatePropagation:boolean;
	_isDefaultPrevented:boolean;

	/**
	 * Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
	 */
	stopImmediatePropagation();

	/**
	 * Cancels an event's default behavior if that behavior can be canceled.
	 */
	preventDefault();

	/**
	 * Checks whether the preventDefault() method has been called on the event.
	 */
	isDefaultPrevented():boolean;
}

export default IEvent;