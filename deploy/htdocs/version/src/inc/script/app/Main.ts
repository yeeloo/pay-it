import refdef from "def/ReferenceDefinitions";
import ko = require('knockout');
import GaiaMain from "lib/gaia/core/GaiaMain";
import GaiaEvent from "lib/gaia/events/GaiaEvent";
import StartUp from "app/control/StartUp";
import ISitemap from "lib/gaia/interface/ISitemap";
import * as Gaia from "lib/gaia/api/Gaia";
import DataManager from "app/data/DataManager";
import Log from 'lib/temple/utils/Log';

/**
 * Where it all start
 *
 * @namespace app
 * @class Main
 * @extend gaia.core.GaiaMain
 */
class Main extends GaiaMain
{
	private _log = new Log('app.Main');

	/**
	 * @property _beforeGotoHijack
	 * @type Function
	 */
	public _beforeGotoHijack:(removeHijack?:boolean) => void;

	/**
	 * @method constructor
	 * @param {app.config.sitemap} sitemap
	 */
	constructor(sitemap:ISitemap)
	{
		super();

		var startUp = new StartUp();
		startUp.execute(() =>
		{
			this._log.log('StartUp complete, starting Gaia...');
			this.startGaia(sitemap);
		});
	}

	/**
	 * @method onInit
	 */
	public onInit()
	{
		super.onInit();

		this._log.log('onInit');

		// enable for example below
		//this._beforeGotoHijack = Gaia.api.beforeGoto(<(event:GaiaEvent) => void>this.onBeforeGoto.bind(this), true);
	}

	/**
	 * @method onBeforeGoto
	 * @param {GaiaEvent} event
	 */
	private onBeforeGoto(event:GaiaEvent):void
	{
		// example implementation to disallow access to pages by checking certain things

		var dataManager = DataManager.getInstance();
		var pageData:IPageData = Gaia.api.getPage(event.routeResult[0].branch).data || {};

		var isAuthenticated = true;

		// check if we are on a user page, but are not loggedin
		// this could happen when going to a deeplink or using the browsers back button
		if (pageData.hasOwnProperty('auth') && pageData.auth == true && isAuthenticated)
		{
			// not allowed, goto home
			Gaia.api.goto('/index');
		}
		// redirect to 'next' page if already authenticated
		else if (pageData.hasOwnProperty('ifAuthenticated') && isAuthenticated)
		{
			Gaia.api.goto(pageData.ifAuthenticated);
		}
		else
		{
			// allowed, just continue
			this._beforeGotoHijack();
		}

		//todo: add 'current' class to the current active page (leaf)
	}
}

export default Main;

/**
 * @class IPageData
 */
interface IPageData
{

	/**
	 * Redirects to /index if auth is true and not authenticated
	 * @property auth
	 * @type string
	 * @optional
	 */
	auth?:boolean;

	// Redirects to page if authenticated
	/**
	 * Redirects to page if authenticated
	 * @property ifAuthenticated
	 * @type string
	 * @optional
	 */
	ifAuthenticated?:string;
}