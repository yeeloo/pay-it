import BaseEvent from "lib/temple/events/BaseEvent";

/**
 * @module Temple
 * @namespace temple.events
 * @class CommonEvent
 * @extend temple.events.BaseEvent
 */
class CommonEvent extends BaseEvent
{
	public static COMPLETE:string = "complete";
	public static UPDATE:string = "update";
	public static INIT:string = "init";
	public static CHANGE:string = "change";
	public static OPEN:string = "open";
	public static CLOSE:string = "close";

	constructor(type:string)
	{
		super(type);
	}
}

export default CommonEvent;