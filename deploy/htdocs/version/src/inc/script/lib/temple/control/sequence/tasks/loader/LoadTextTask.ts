import AbstractTask from "lib/temple/control/sequence/tasks/AbstractTask";

/**
 * Task for loading a file as a text
 */
class LoadTextTask extends AbstractTask
{
	/**
	 * URL of the text file
	 */
	public url:string;

	private _completeCallback:(text:string) => any;

	/**
	 * Creates a new instance of the LoadTextTask
	 *
	 * @param url {string} the url to the text file
	 * @param completeCallback a method which is called when the load of the text file is complete. The content of the
	 * text file is passed as argument to the method
	 */
	constructor(url:string, completeCallback: (text:string) => any = null)
	{
		super();

		this.url = url;
		this._completeCallback = completeCallback;
	}

	public executeTaskHook():void
	{
		$.get(this.url)
			.done((data) =>
			{
				if (this._completeCallback)
				{
					this._completeCallback(data);
				}

				this.done();
			})
			.fail(() => {
				this.fail('error getting text');
			});
	}

	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		this.url = null;
		this._completeCallback = null;

		super.destruct();
	}
}

export default LoadTextTask;