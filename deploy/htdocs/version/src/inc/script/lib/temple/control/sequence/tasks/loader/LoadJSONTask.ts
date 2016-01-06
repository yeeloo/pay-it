import AbstractTask from "lib/temple/control/sequence/tasks/AbstractTask";

class LoadJSONTask extends AbstractTask
{
	public _url:string;
	private _completeCallback:(data:any) => any;
	private _jsonpCallback:string;

	/**
	 * @param url {string}
	 * @param completeCallback
	 * @param jsonpCallback {string}
	 */
	constructor(url:string, completeCallback: (data:any) => any = null, jsonpCallback:string = null)
	{
		super();

		this._url = url;
		this._completeCallback = completeCallback;
		this._jsonpCallback = jsonpCallback;
	}

	public getUrl():string
	{
		return this._url;
	}

	public executeTaskHook():void
	{
		if (this._jsonpCallback)
		{
			$.ajax(<any>{
					url: this._url,
					dataType: "jsonp",
					type: "GET",
					crossDomain: true,
					jsonpCallback: this._jsonpCallback,
					cache: true
				})
				.done((data, textStatus, jqXHR) =>
				{
					if (this._completeCallback)
					{
						this._completeCallback(data);
					}

					this.done();
				})
				.fail((jqXHR, textStatus, errorThrown) =>
				{
					this.fail('error getting json: \'' + this._url + '\'');
				});
		}
		else
		{
			$.getJSON(this._url)
				.done((data) =>
				{
					if (this._completeCallback)
					{
						this._completeCallback(data);
					}

					this.done();
				})
				.fail(() => {
					this.fail('error getting json: \'' + this._url + '\'');
				});
		}
	}

	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		this._url = null;
		this._completeCallback = null;
		this._jsonpCallback = null;

		super.destruct();
	}
}

export default LoadJSONTask;