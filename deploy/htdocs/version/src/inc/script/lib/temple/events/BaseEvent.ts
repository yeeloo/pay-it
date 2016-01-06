import IEventDispatcher from "./IEventDispatcher";
import IEvent from "./IEvent";

/**
 * The BaseEvent class is used as the base class for the creation of Event objects, which are passed as parameters to event listeners when an event occurs.
 * The properties of the BaseEvent class carry basic information about an event, such as the event's type or whether the event's default behavior can be canceled.
 */
class BaseEvent implements IEvent
{
	/**
	 * The event target.
	 */
	public target:IEventDispatcher = null;

	public _stopImmediatePropagation:boolean = false;
	public _isDefaultPrevented:boolean = false;

	/**
	 * Creates an Event object to pass as a parameter to event listeners.
	 * @param type The type of event.
	 * @param cancelable Determines whether the Event object can be canceled. The default values is false.
	 */
	constructor(public type:string, public cancelable:boolean = false)
	{

	}

	/**
	 * Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
	 */
	public stopImmediatePropagation()
	{
		this._stopImmediatePropagation = true;
	}

	/**
	 * Cancels an event's default behavior if that behavior can be canceled.
	 */
	public preventDefault()
	{
		this._isDefaultPrevented = true;
	}

	/**
	 * Checks whether the preventDefault() method has been called on the event.
	 */
	public isDefaultPrevented():boolean
	{
		return this._isDefaultPrevented;
	}
}

export default BaseEvent;