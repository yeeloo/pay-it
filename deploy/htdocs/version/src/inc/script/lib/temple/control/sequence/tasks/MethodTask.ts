import AbstractTask from "lib/temple/control/sequence/tasks/AbstractTask";

class MethodTask extends AbstractTask
{
	private _method:Function;
	private _arguments:any[];

	/**
	 * @param method the method that will be called when executing this task.
	 * @param arguments any number of arguments that will be passed to the callback function when it is called.
	 */
	constructor(method:Function, args:any[] = null)
	{
		super();

		this._method = method;
		this._arguments = args;
	}

	public getMethod():string
	{
		return this._method.toString();
	}

	public executeTaskHook():void
	{
		this._method.apply(null, this._arguments ? this._arguments : <any>[]);
		this.done();
	}

	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		this._method = null;
		this._arguments = null;

		super.destruct();
	}
}

export default MethodTask;