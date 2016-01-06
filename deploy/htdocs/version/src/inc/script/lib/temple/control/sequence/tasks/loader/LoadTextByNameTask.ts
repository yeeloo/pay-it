import refdef from "def/ReferenceDefinitions";
import LoadTextTask from "./LoadTextTask";
import ConfigManager from "lib/temple/config/ConfigManager";

/**
 * Task for loading a file as a text
 */
class LoadTextByNameTask extends LoadTextTask
{
	/**
	 * Name of the URL of the text file
	 */
	public name:string;

	private _configManager:ConfigManager;

	/**
	 * Creates a new instance of the LoadTextByNameTask
	 *
	 * @param configManager {ConfigManager} the ConfigManager instance which has the URL of the text file
	 * @param name {string} the name of the URL of the text file in the ConfigManager
	 * @param completeCallback {Function} a method which is called when the load of the text file is complete. The
	 * content of the text file is passed as argument to the method
	 */
	constructor(configManager:ConfigManager, name:string, completeCallback: (data:any) => any = null)
	{
		super(null, completeCallback);

		this._configManager = configManager;
		this.name = name;
	}

	public executeTaskHook():void
	{
		this.url = this._configManager.getURL(this.name);

		super.executeTaskHook();
	}
	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		this.name = null;
		this._configManager = null;

		super.destruct();
	}
}
	
export default LoadTextByNameTask;