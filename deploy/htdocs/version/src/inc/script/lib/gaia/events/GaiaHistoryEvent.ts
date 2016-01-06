import refdef from 'def/ReferenceDefinitions';
import BaseEvent from 'lib/temple/events/BaseEvent';
import IRouteResultItem from '../router/IRouteResultItem';

class GaiaHistoryEvent extends BaseEvent
{
	public static DEEPLINK:string = "GaiaHistoryEvent.DEEPLINK";
	public static GOTO:string = "GaiaHistoryEvent.GOTO";

	constructor(type:string, public routeResult:IRouteResultItem)
	{
		super(type);

		this.routeResult = routeResult;
	}
}

export default GaiaHistoryEvent;