import AsyncMethodTask from "lib/temple/control/sequence/tasks/AsyncMethodTask";

class AsyncMethodTimeoutTask extends AsyncMethodTask
{
	private _timeout:number;

	/**
	 * @param method the method that will be called when executing this task.
	 */
	constructor(method:(onDone:()=> void) => void, private _time:number = 5000)
	{
		super(method);
	}

	public executeTaskHook():void
	{
		this._timeout = setTimeout(this.done.bind(this), this._time);
		super.executeTaskHook();
	}

	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		clearTimeout(this._timeout);

		super.destruct();
	}
}

export default AsyncMethodTimeoutTask;