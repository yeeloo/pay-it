import IGaiaHistory from "./IGaiaHistory";
import * as Gaia from "../api/Gaia";
import BranchTools from "../core/BranchTools";
import SiteModel from "../core/SiteModel";
import GaiaEvent from "../events/GaiaEvent";
import GaiaHistoryEvent from "../events/GaiaHistoryEvent";
import IRouteResultItem from "../router/IRouteResultItem";

import EventDispatcher from "lib/temple/events/EventDispatcher";
import BaseEvent from "lib/temple/events/BaseEvent";
import Log from "../../temple/utils/Log";

/**
 * @module Gaia
 * @namespace gaia.core
 * @class GaiaHistory
 * @extend temple.events.EventDispatcher
 */
class GaiaHistory extends EventDispatcher implements IGaiaHistory
{
	private static _instance:GaiaHistory;

	private _log:Log = new Log('lib.gaia.core.GaiaHistory');
	private _deeplink:{[param:string]:any} = {};
	private _enabled:boolean;

	private isInternal:boolean;

	private lastValidBranch:string;

	private _history:IRouteResultItem[];
	private _historyPointer:number;

	constructor()
	{
		super();

		this._history = [];
		this._historyPointer = 0;
	}

	public static getInstance():GaiaHistory
	{
		if (GaiaHistory._instance == null)
		{
			GaiaHistory._instance = new GaiaHistory();
		}

		window['GaiaHistory'] = GaiaHistory;

		return GaiaHistory._instance;
	}

	public getHistory():IRouteResultItem[]
	{
		return this._history;
	}

	public getHistoryPointer():number
	{
		return this._historyPointer;
	}

	public getDeeplink():{[param:string]:any}
	{
		return this._deeplink;
	}

	public onGoto(event:GaiaEvent):void
	{
		this._log.log('onGoto: ', event);

		if (!event.external)
		{
			this.isInternal = true;

			this._deeplink = event.routeResult[0].deeplink;
			this.lastValidBranch = event.routeResult[0].branch;

			// new url
			var newRoute = event.routeResult.route;// || Gaia.router.assemble(event.routeResult[0].branch, event.routeResult[0].deeplink);

			if (newRoute)
			{
				// current url
				var urlValue = Gaia.router.getRoute();

				this._log.log('onGoto: ', urlValue, newRoute);
				// did the url change?
				if (newRoute != urlValue)
				{
					//// and are we not dealing with an alias
					//var currentBranchResult:IRouteResultItem = Gaia.router.resolvePage(urlValue);
					//
					//if (!currentBranchResult.equals(event.routeResult))
					//{
						// set new url
						Gaia.router.setRoute(newRoute, event.replace);
					//}
				}
			}

			// for normal browsers, isInternal can be set to false here
			// but in IE the change listener is async, so we get issues
			// but I let it here because it might give other issues
			this.isInternal = false;

			var title:string = SiteModel.getTitle().replace('{page}', Gaia.api.getPage(event.routeResult[0].branch).title);
			document.title = title;
		}
	}

	/* internal */ onChange(routeResult:IRouteResultItem):void
	{
		// we were in the middle
		if (this._historyPointer != 0)
		{
			// kill the 'forward' pages, because we create a new future
			this._history.splice(0, this._historyPointer);
			this._historyPointer = 0;
		}

		this._history.unshift(routeResult);


		if (!this.isInternal)
		{
			this.dispatchGoto(routeResult);
		}

		this.dispatchDeeplink(routeResult);

		// this is set here for IE
		//this.isInternal = false;
	}

	private dispatchGoto(routeResult:IRouteResultItem):void
	{
		this.dispatchEvent(new GaiaHistoryEvent(GaiaHistoryEvent.GOTO, routeResult));
	}

	private dispatchDeeplink(routeResult:IRouteResultItem):void
	{
		if (this.hasEventListener(GaiaHistoryEvent.DEEPLINK))
		{
			this.dispatchEvent(new GaiaHistoryEvent(GaiaHistoryEvent.DEEPLINK, routeResult));
		}
	}

	public back():void
	{
		if (Gaia.router.config().isEnabled())
		{
			history.back();
		}
		else
		{
			++this._historyPointer;
			this._historyPointer = Math.max(0, Math.min(this._history.length - 1, this._historyPointer));

			this._internalChange();
		}
	}

	public forward():void
	{
		if (Gaia.router.config().isEnabled())
		{
			history.forward();
		}
		else
		{
			--this._historyPointer;
			this._historyPointer = Math.max(0, Math.min(this._history.length - 1, this._historyPointer));

			this._internalChange();
		}
	}

	public jump(steps:number):void
	{
		if (Gaia.router.config().isEnabled())
		{
			history.go(steps);
		}
		else
		{
			this._historyPointer -= steps;
			this._historyPointer = Math.max(0, Math.min(this._history.length - 1, this._historyPointer));

			this._internalChange();
		}
	}

	// untested
	private _internalChange()
	{
		// get validBranch from history
		var val = this._history[this._historyPointer];
		var validBranch = BranchTools.getValidBranch(val[0].branch);

		// convert validBranch to route
		if (validBranch.length > 0)
		{
			// todo
//			this._deeplink = val.substring(validBranch.length);
//			this._localValue = Gaia.api.getPage(validBranch).route.base + this._deeplink;

			// do as if the url has changed
			this.onChange(this._history[this._historyPointer]);
		}
	}
}

export default GaiaHistory;