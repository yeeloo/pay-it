import refdef from "def/ReferenceDefinitions";
import AbstractTask from "./AbstractTask";

class TimeDelayTask extends AbstractTask
{
	private _timeout:number;

	constructor(public milliseconds:number)
	{
		super();
	}

	public executeTaskHook():void
	{
		this._timeout = setTimeout(this.done.bind(this), this.milliseconds);
	}

	public cancel():boolean
	{
		if (this._timeout)
		{
			clearTimeout(this._timeout);
		}
		return true;
	}
}

export default TimeDelayTask;