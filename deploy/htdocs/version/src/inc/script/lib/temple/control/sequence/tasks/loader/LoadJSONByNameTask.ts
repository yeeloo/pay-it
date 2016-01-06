import LoadJSONTask from "./LoadJSONTask";
import ConfigManager from "lib/temple/config/ConfigManager";

class LoadJSONByNameTask extends LoadJSONTask
{
	private _name:string;
	private _configManager:ConfigManager;

	/**
	 * @param name {string}
	 * @param completeCallback {Function}
	 * @param jsonpCallback {string}
	 */
	constructor(configManager:ConfigManager, name:string, completeCallback: (data:any) => any = null, jsonpCallback:string = null)
	{
		super(null, completeCallback, jsonpCallback);

		this._configManager = configManager;
		this._name = name;
	}

	public executeTaskHook():void
	{
		this._url = this._configManager.getURL(this._name);

		super.executeTaskHook();
	}
	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		this._name = null;
		this._configManager = null;

		super.destruct();
	}
}
	
export default LoadJSONByNameTask;