import refdef from 'def/ReferenceDefinitions';
import AbstractTask from "lib/temple/control/sequence/tasks/AbstractTask";
import configManagerInstance from "lib/temple/config/configManagerInstance";

import LocaleManager from "lib/temple/locale/LocaleManager";
import LocaleKnockoutBinding from "lib/temple/locale/LocaleKnockoutBinding";
import LocaleGaiaHistoryHook from "lib/gaia/router/locale/LocaleGaiaHistoryHook";
import Log from 'lib/temple/utils/Log';

/*
 * Choose your provider
 */
//import JSONLocaleProvider from "lib/temple/locale/provider/JSONLocaleProvider";
//import JSONPLocaleProvider from "lib/temple/locale/provider/JSONPLocaleProvider";
//import XMLLocaleProvider from "lib/temple/locale/provider/XMLLocaleProvider";
//import XMLPLocaleProvider from "lib/temple/locale/provider/XMLPLocaleProvider";

/**
 * @namespace app.control
 * @class InitLocaleTask
 * @extend temple.control.sequence.tasks.AbstractTask
 */
class InitLocaleTask extends AbstractTask
{
	private _fallbackLocale:string;

	private _log = new Log('app.control.InitLocaleTask');

	/**
	 * @class InitLocaleTask
	 * @constructor InitLocaleTask
	 * @param {string} fallbackLocale
	 */
	constructor(fallbackLocale:string = 'debug')
	{
		super();

		this._fallbackLocale = fallbackLocale;
	}

	/**
	 * @inheritDoc
	 */
	public executeTaskHook():void
	{
		this._log.log('executeTaskHook');

		// localization
		new LocaleKnockoutBinding();
		LocaleManager.getInstance().setFallbackLocale(this._fallbackLocale);

		// optional, add aliases for mapping http://yourwebsite/nl to http://yourwebsite/nl_NL
		LocaleManager.getInstance().addAlias('nl', 'nl_NL');


		// choose your poison!

		//var jsonProvider= new JSONLocaleProvider(LocaleManager.getInstance());
		//jsonProvider.addLocaleFile('en_GB', 'data/locale/en_GB.json', true);
		//jsonProvider.addLocaleFile('nl_NL', 'data/locale/nl_NL.json', true);

		//var xmlProvider = new XMLPLocaleProvider(LocaleManager.getInstance());
		//xmlProvider.addLocaleFile('en_GB', 'data/locale/en_GB.xmlp', true);
		//xmlProvider.addLocaleFile('nl_NL', 'data/locale/nl_NL.xmlp', true);

		// this will add the mapping between the url and the localeManager, and sets the LocaleManager to the current or default locale
		new LocaleGaiaHistoryHook();

		configManagerInstance.setVariable('locale', LocaleManager.getInstance().getLocale());

		this.done();
	}

	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		this._fallbackLocale = null;

		super.destruct();
	}
}

export default InitLocaleTask;
