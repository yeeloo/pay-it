import configManagerInstance from "lib/temple/config/configManagerInstance";
import IGateway from "app/net/gateway/IGateway";

import Gateway from "app/net/gateway/Gateway";
import RESTOutputHandler from "app/net/gateway/output/RESTOutputHandler";
import RESTInputHandler from "app/net/gateway/input/RESTInputHandler";
import RecordModel from "app/data/model/RecordModel";
import PayeeModel from "app/data/model/PayeeModel";

/**
 * @namespace app.data
 * @class DataManager
 */
class DataManager
{
	private static _instance:DataManager;

	/**
	 * @property gateway
	 * @type Gateway
	 */
	public gateway:IGateway;
	public recordModel:RecordModel = new RecordModel();
	public payeeModel:PayeeModel = new PayeeModel();

	/**
	 * Returns a instance of the datamanager
	 *
	 * @method getInstance
	 * @returns {DataManager}
	 */
	public static getInstance():DataManager
	{
		if (!DataManager._instance)
		{
			DataManager._instance = new DataManager();
			window['dataManager'] = DataManager._instance;
		}

		return DataManager._instance;
	}

	/**
	 * Set up gateway, services and models.
	 * Called from the StartUp
	 *
	 * @method setupGateway
	 */
	public setupGateway():void
	{
		this.gateway = new Gateway({
			// the base url
			url: configManagerInstance.getURL('api'),
			headers: {
				'X-Force-Status-Code-200': 1
			},
			// the default output handler (can be changed to PostOutputHandler or JSONOutputHandler for the 'old gateway', or to RESTOutputHandler for the 'new style'
			outputHandler: new RESTOutputHandler(),
			inputHandler: new RESTInputHandler()
		}, true);
	}

	/**
	 * @class DataManager
	 * @constructor
	 */
	constructor()
	{
	}
}

export default DataManager;