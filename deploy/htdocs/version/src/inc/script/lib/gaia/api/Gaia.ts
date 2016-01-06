import Flow from "../flow/Flow";
import GaiaHQ from "../core/GaiaHQ";
import GaiaHistory from "../core/GaiaHistory";
import GaiaRouter from "../router/GaiaRouter";
import SiteModel from "../core/SiteModel";
import SiteController from "../core/SiteController";
import BranchTools from "../core/BranchTools";
import GaiaEvent from "../events/GaiaEvent";

import IPageAsset from "../interface/IPageAsset";
import IRoute from "../interface/IRoute";
import IRouteResultItem from "../router/IRouteResultItem";
import RouteResultItem from "../router/RouteResultItem";

import IGaia from "./IGaia";
import IGaiaHistory from "../core/IGaiaHistory";
import GaiaHistoryEvent from "../events/GaiaHistoryEvent";
import IDestructible from "../../temple/core/IDestructible";
import PageEvent from "../events/PageEvent";
import Log from "../../temple/utils/Log";

/**
 *
 * @moduleDocumentation ../../../doc/module/Gaia.md
 * @module Gaia
 * @namespace gaia.api
 * @class GaiaImpl
 */
class GaiaImpl implements IGaia
{
	private _log:Log = new Log('lib.gaia.api.Gaia');

	constructor()
	{

	}

	/**
	 * goto is the primary method you will be using in Gaia. It requires at least one argument and that is a string of the branch you want to navigate to.
	 *
	 * It has support for absolute paths, starting with a `/`, or relative paths. You can also use `./` or `../` to go a level up.<br>
	 * The starting `/` is optional<br>
	 * Starting with a `.` makes it relative<br>
	 *
	 * Starting with `index/home/detail`
	 *
	 *	index/foo        >> index/foo
	 *	/index/foo       >> index/foo
	 *	.                >> index/home/detail
	 *	./foo            >> index/home/detail/foo
	 *	..               >> index/home
	 *	../foo           >> index/home/foo
	 *
	 * __Note:__<br>
	 * If you are doing a goto to a sub- or parent-page and want to keep url-parameters of your current/parent page in tact, you should use
	 *
	 *	$.extend({}, Gaia.api.getDeeplink(), {foo: bar})
	 *
	 * to merge the current and new deeplink together and pass them as the deeplink parameter.
	 *
	 * @method goto
	 * @param {string} branch
	 * @param {HashMap} [deeplink]
	 * @param {boolean} [replace=false]
	 */
	public goto(branch:string, deeplink?:{[param:string]: any;}, flow:Flow = null, replace:boolean = false):void
	{
		if (!branch) throw new Error("branch can not be empty");

		var branch = BranchTools.resolveBranch(branch, this.getCurrentBranch());

		var routeResult:IRouteResultItem = new RouteResultItem([{
			branch: branch,
			deeplink: deeplink
		}], router.assemble(branch, deeplink));

		GaiaHQ.getInstance().goto(routeResult, flow, null, replace);
	}

	/**
	 * Opens a new page by providing the route.
	 *
	 * @method gotoRoute
	 * @param {string} route
	 */
	public gotoRoute(route:string, replace:boolean = false):void
	{
		// add accidental missing starting /
		if (route.charAt(0) != '/')
		{
			route = route + '/';
		}

		// transform route into branch
		router.resolvePage(route, (routeResult:IRouteResultItem) =>
		{
			if (routeResult)
			{
				GaiaHQ.getInstance().goto(routeResult, null, null, replace);
			}
			else
			{
				routeResult = new RouteResultItem([{
					branch: 'index',
					deeplink: {}
				}], router.assemble('index'));

				this._log.error('gotoRoute: invalid route ', route);
				GaiaHQ.getInstance().goto(routeResult);
			}
		}, true, false);
	}

	/**
	 * Proxy method for a normal goto, but from the current page.
	 *
	 * @method gotoDeeplink
	 * @param {HashMap} [deeplink]
	 * @param {boolean} [replace=false]
	 */
	public gotoDeeplink(deeplink?:{[param:string]: any;}, replace:boolean = false):void
	{
		this.goto(this.getCurrentBranch(), deeplink, null, replace);
	}

	/**
	 * Navigates to a popup relative from the current base-branch.<br>
	 * Popups are normal pages that are dynamically appended as subpages to all other pages.<br>
	 * You navigate to popups using the branch-path of only the popup.<br>
	 * So if you are on /index/home, and you want to open the about popup you do:
	 *
	 *	Gaia.api.gotoPopup('about');
	 *
	 * If you have a popup-wrapper named 'popup' the goto will be:
	 *
	 *	Gaia.api.gotoPopup('popup/about');
	 *
	 * Opening a new popup will automatically close other opened popups.
	 *
	 * Because opening a popup is almost always a sub-page (except when closing a current one),
	 * it will automatically merge the passed deeplink over the current deeplink, keeping it in tact.
	 *
	 * @method gotoPopup
	 * @param {string} popupId the 'branch-path' of the popup part of the branch, will be appended to the current branch
	 * @param {HashMap} [deeplink]
	 */
	public gotoPopup(popupId:string, deeplink?:{[param:string]:any}, replace?:boolean):void
	{
		var branch = BranchTools.getPopupBranch(popupId, this.getCurrentBranch());

		// merge new deeplink over current one
		deeplink = $.extend({}, this.getDeeplink(), deeplink);

		this.goto(branch, deeplink, null, replace);
	}

	/**
	 * Closes the currently opened popup.
	 * It will also automatically keep the current deeplink, alowing the parent page to keep working.
	 *
	 * @method closePopup
	 */
	public closePopup():void
	{
		this.gotoPopup(null, this.getDeeplink());
	}

	/**
	 * Returns the current branch.
	 *
	 * @method getCurrentBranch
	 * @returns {string}
	 */
	public getCurrentBranch():string
	{
		return SiteController.getCurrentBranch();
	}

	/**
	 * Returns the current route.
	 *
	 * @method getCurrentRoute
	 * @returns {string}
	 */
	public getCurrentRoute():string
	{
		return SiteController.getCurrentRoute();
	}

	/**
	 * Returns the current deeplink.
	 *
	 * The deeplink is an object filled with all the deeplink parameters.<br>
	 * To get an individual parameter you can use {{#crossLink "gaia.api.GaiaImpl/getParam:method"}}{{/crossLink}}
	 *
	 * @method getDeeplink
	 * @returns {HashMap}
	 */
	public getDeeplink():{[param:string]:any}
	{
		return GaiaHistory.getInstance().getDeeplink();
	}

	/**
	 * Returns the current route.
	 *
	 * Proxy function for {{#crossLink "gaia.router.GaiaRouter/getRoute:method"}}{{/crossLink}}
	 *
	 * @method getRoute
	 * @returns {string}
	 */
	public getRoute():string
	{
		return router.getRoute();
	}

	/**
	 * Returns a single deeplink param.
	 *
	 * @method getParam
	 * @param {string} [key]
	 * @returns {*}
	 */
	public getParam(key:string = null):any
	{
		var dl = this.getDeeplink();

		if (dl == null || key == null)
		{
			return dl;
		}

		if (dl.hasOwnProperty(key))
		{
			return dl[key];
		}
		else
		{
			return null;
		}

	}

	/**
	 * Returns the valid branch from the input, stripping off all invalid parts of the link at the end.
	 *
	 * @method getValidBranch
	 * @param {string} branch
	 * @returns {string}
	 */
	public getValidBranch(branch:string):string
	{
		return BranchTools.getValidBranch(branch);
	}

	/**
	 * Returns the PageAsset from the given branch, giving access to data from the sitemap and the page Controller.
	 *
	 * @method getPage
	 * @param {string} branch
	 * @returns {IPageAsset}
	 */
	public getPage(branch:string):IPageAsset
	{
		return BranchTools.getPage(branch);
	}

	public getDepthContainer(name:string):HTMLDivElement
	{
		return null;
	}

	/**
	 * Goes back to the previous page, either by using the Browsers history, or checking internally.
	 * @method back
	 */
	public back():void
	{
		GaiaHistory.getInstance().back();
	}


	/**
	 * Goes forward to the next page, either by using the Browsers history, or checking internally.
	 * @method forward
	 */
	public forward():void
	{
		GaiaHistory.getInstance().forward();
	}


	/**
	 * Jumps x steps in the history, either by using the Browsers history, or checking internally.
	 * @method jump
	 */
	public jump(steps:number):void
	{
		GaiaHistory.getInstance().jump(steps);
	}

	// goto
	public beforeGoto(target:(event:GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(GaiaEvent.BEFORE_GOTO, target, hijack, onlyOnce);
	}

	public afterGoto(target:(event:GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(GaiaEvent.AFTER_GOTO, target, hijack, onlyOnce);
	}

	// out
	public beforeTransitionOut(target:(event:GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(GaiaEvent.BEFORE_TRANSITION_OUT, target, hijack, onlyOnce);
	}

	public afterTransitionOut(target:(event:GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(GaiaEvent.AFTER_TRANSITION_OUT, target, hijack, onlyOnce);
	}

	// in
	public beforeTransitionIn(target:(event:GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(GaiaEvent.BEFORE_TRANSITION_IN, target, hijack, onlyOnce);
	}

	public afterTransitionIn(target:(event:GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(GaiaEvent.AFTER_TRANSITION_IN, target, hijack, onlyOnce);
	}

	// trans
	public beforeTransition(target:(event:GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(GaiaEvent.BEFORE_TRANSITION, target, hijack, onlyOnce);
	}

	public afterTransition(target:(event:GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(GaiaEvent.AFTER_TRANSITION, target, hijack, onlyOnce);
	}

	// complete
	public afterComplete(target:(event:GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(GaiaEvent.AFTER_COMPLETE, target, hijack, onlyOnce);
	}


	// goto
	public removeBeforeGoto(target:(event:GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(GaiaEvent.BEFORE_GOTO, target);
	}

	public removeAfterGoto(target:(event:GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(GaiaEvent.AFTER_GOTO, target);
	}

	// out
	public removeBeforeTransitionOut(target:(event:GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(GaiaEvent.BEFORE_TRANSITION_OUT, target);
	}

	public removeAfterTransitionOut(target:(event:GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(GaiaEvent.AFTER_TRANSITION_OUT, target);
	}

	// in
	public removeBeforeTransitionIn(target:(event:GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(GaiaEvent.BEFORE_TRANSITION_IN, target);
	}

	public removeAfterTransitionIn(target:(event:GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(GaiaEvent.AFTER_TRANSITION_IN, target);
	}

	// trans
	public removeBeforeTransition(target:(event:GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(GaiaEvent.BEFORE_TRANSITION, target);
	}

	public removeAfterTransition(target:(event:GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(GaiaEvent.AFTER_TRANSITION, target);
	}

	// complete
	public removeAfterComplete(target:(event:GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(GaiaEvent.AFTER_COMPLETE, target);
	}


	public addDeeplinkListener(target:(event:GaiaEvent) => any):IDestructible
	{
		return GaiaHistory.getInstance().addEventListener(GaiaHistoryEvent.DEEPLINK, target);
	}

	public removeDeeplinkListener(target:(event:GaiaEvent) => any):void
	{
		GaiaHistory.getInstance().removeEventListener(GaiaHistoryEvent.DEEPLINK, target);
	}

	public addPageInitListener(handler:(event:PageEvent) => void):IDestructible
	{
		return GaiaHQ.getInstance().addEventListener(PageEvent.BEFORE_INIT, handler);
	}

	public removePageInitListener(handler:(event:PageEvent) => void):void
	{
		GaiaHQ.getInstance().removeEventListener(PageEvent.BEFORE_INIT, handler);
	}

	/**
	 * Check of Gaia is ready.
	 *
	 * @method isReady
	 * @returns {boolean}
	 */
	public isReady():boolean
	{
		return !!SiteController.getCurrentBranch();
	}

	public getDefaultFlow():Flow
	{
		return SiteModel.defaultFlow;
	}

	public setDefaultFlow(flow:Flow):void
	{
		SiteModel.defaultFlow = flow;
	}

}

/**
 * @namespace gaia.api
 * @class api
 */
export var api:IGaia = new GaiaImpl();

/**
 * @namespace gaia.api
 * @class history
 * @type GaiaHistory
 */
export var history:IGaiaHistory = GaiaHistory.getInstance();

/**
 * @namespace gaia.api
 * @class hq
 * @type GaiaImpl
 */
export var hq:GaiaHQ = GaiaHQ.getInstance();

/**
 * @namespace gaia.api
 * @property router
 * @type gaia.router.GaiaRouter
 */
export var router:GaiaRouter = new GaiaRouter(GaiaHistory.getInstance());
