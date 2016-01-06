import BaseEvent from "./BaseEvent";

class DataEvent<T> extends BaseEvent
{
	constructor(type:string, public data:T)
	{
		super(type);
	}
}

export default DataEvent;