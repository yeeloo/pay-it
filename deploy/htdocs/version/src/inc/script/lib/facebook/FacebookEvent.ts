import BaseEvent from "lib/temple/events/BaseEvent";

class FacebookEvent extends BaseEvent
{
	public static LOGIN:string = "FacebookEvent.login";
	public static LOGOUT:string = "FacebookEvent.logout";

	constructor(type:string)
	{
		super(type);
	}
}

export default FacebookEvent;