import refdef from "def/ReferenceDefinitions";
import DataManager from "app/data/DataManager";
import ko = require('knockout');
import configManagerInstance from "lib/temple/config/configManagerInstance";
import config from "app/config/config";
import Routes from "app/config/Routes";

import Sequence from "lib/temple/control/sequence/Sequence";
import MethodTask from "lib/temple/control/sequence/tasks/MethodTask";
import ITask from "lib/temple/control/sequence/tasks/ITask";
import DevBarTask from "app/control/DevBarTask";
import Log from 'lib/temple/utils/Log';

// localization
import InitLocaleTask from "app/control/InitLocaleTask";
import LoadJSONByNameTask from 'lib/temple/control/sequence/tasks/loader/LoadJSONByNameTask';

/**
 * @namespace app.control
 * @class StartUp
 */
class StartUp
{
	private _log = new Log('app.control.StartUp');

	/**
	 * Initializes knockout allowBindings
	 *
	 * @class StartUp
	 * @constructor
	 */
	constructor()
	{
		window['ko'] = ko;
	}

	execute(callback: () => any)
	{
		this._log.log('Execute');

		configManagerInstance.init(config.config, config.environment);
		var dm:DataManager = DataManager.getInstance();
		// just because we need it here!
		DataManager.getInstance();

		DataManager.getInstance().setupGateway();

		Routes.init();

		var sequence = new Sequence();

		if (DEBUG && configManagerInstance.getEnvironment() != 'live'
			&& configManagerInstance.getEnvironment() != 'prod'
			&& configManagerInstance.getEnvironment() != 'production')
		{
			sequence.add(new DevBarTask());
		}

		// add your own tasks
		sequence.add(new LoadJSONByNameTask(configManagerInstance, 'record', dm.recordModel.addList.bind(dm.recordModel)));
		sequence.add(new LoadJSONByNameTask(configManagerInstance, 'payee', dm.payeeModel.addList.bind(dm.payeeModel)));
		sequence.add(new InitLocaleTask());

		// do this last
		sequence.add(new MethodTask(callback));
		sequence.execute();
	}
}

export default StartUp;