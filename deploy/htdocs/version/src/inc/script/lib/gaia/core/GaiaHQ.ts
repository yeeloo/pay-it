import * as Gaia from "../api/Gaia";
import BranchIterator from "../core/BranchIterator";
import BranchTools from "../core/BranchTools";
import SiteModel from "../core/SiteModel";
import FlowManager from "../flow/FlowManager";
import Flow from "../flow/Flow";
import IPageAsset from "../interface/IPageAsset";
import GaiaEvent from "../events/GaiaEvent";
import GotoEventItem from "../events/GotoEventItem";
import GaiaHistoryEvent from "../events/GaiaHistoryEvent";
import RouteResultItem from "../router/RouteResultItem";
import IRouteResultItem from "../router/IRouteResultItem";

import EventDispatcher from "lib/temple/events/EventDispatcher";
import CommonEvent from "lib/temple/events/CommonEvent";
import BaseEvent from "lib/temple/events/BaseEvent";
import Log from "../../temple/utils/Log";


/**
 * @module Gaia
 * @namespace gaia.core
 * @class GaiaHQ
 * @extends temple.events.EventDispatcher
 */
class GaiaHQ extends EventDispatcher
{
	public static TRANSITION_OUT:string = "transitionOut";
	public static TRANSITION_IN:string = "transitionIn";
	public static TRANSITION:string = "transition";
	public static PRELOAD:string = "preload";
	public static COMPLETE:string = "complete";

	private listeners: {
		[index:string]: {
			[key:string]: GaiaHQListener;
		}[];
	}[];

	private _log:Log = new Log('lib.gaia.core.GaiaHQ');

	public flowManager:FlowManager;

	private uniqueID:number = 0;
	private gotoEventObj:GotoEventItem;

	private static _instance:GaiaHQ;

	constructor()
	{
		super();

		this.listeners = [];
		this.listeners['beforeGoto'] = {};
		this.listeners['afterGoto'] = {};
		this.listeners['beforeTransitionOut'] = {};
		this.listeners['afterTransitionOut'] = {};
		this.listeners['beforePreload'] = {};
		this.listeners['afterPreload'] = {};
		this.listeners['beforeTransition'] = {};
		this.listeners['afterTransition'] = {};
		this.listeners['beforeTransitionIn'] = {};
		this.listeners['afterTransitionIn'] = {};
		this.listeners['afterComplete'] = {};

		this.flowManager = new FlowManager(this);
	}

	public static birth():void
	{
	}

	/**
	 *
	 * @returns {GaiaHQ}
	 */
	public static getInstance():GaiaHQ
	{
		if (GaiaHQ._instance == null)
		{
			GaiaHQ._instance = new GaiaHQ();
		}

		return GaiaHQ._instance;
	}

	// Called by GaiaImpl
	public addListener(eventName:string, target:(event:GaiaEvent) => any, hijack:boolean, onlyOnce:boolean):(removeHijack?:boolean) => void
	{
		if (this.listeners[eventName] != null)
		{
			var listener:GaiaHQListener = this.generateListener(eventName, target);
			if (!listener.hijack && hijack)
			{
				listener._onHijackCompleteDelegate = <(event:BaseEvent) => any>this.onHijackComplete.bind(this);
				listener.addEventListener(CommonEvent.COMPLETE, listener._onHijackCompleteDelegate);
			}
			else if (listener.hijack && !hijack)
			{
				listener.removeEventListener(CommonEvent.COMPLETE, listener._onHijackCompleteDelegate);
			}
			listener.hijack = hijack;
			listener.completed = !hijack;
			listener.onlyOnce = onlyOnce;
			this.addEventListener(eventName, listener.target);
			return (hijack) ? <(removeHijack?:boolean) => any>listener.completeCallback.bind(listener) : null;
		}
		else
		{
			this._log.log("GaiaHQ Error! addListener: " + eventName + " is not a valid event");
			return null;
		}
	}

	public removeListener(eventName:string, target:Function):void
	{
		if (this.listeners[eventName] != undefined)
		{
			for (var id in this.listeners[eventName])
			{
				if (this.listeners[eventName].hasOwnProperty(id))
				{
					if (this.listeners[eventName][id].target == target)
					{
						this.removeListenerByID(eventName, id);
						break;
					}
				}
			}
		}
		else
		{
			this._log.log("GaiaHQ Error! removeListener: " + eventName + " is not a valid event");
		}
	}

	// This method is the beginning of the event chain
	public goto(routeResult:IRouteResultItem, flow:Flow = null, queryString:string = null, replace:boolean = false):void
	{
		if (!routeResult)
		{
			routeResult = new RouteResultItem([{
				branch: 'index',
				deeplink: {}
			}], Gaia.router.assemble('index'));
		}

		// todo: move this checks somewhere else?
		if (routeResult[0].branch.substr(0, SiteModel.getIndexID().length) != SiteModel.getIndexID())
		{
			routeResult[0].branch = SiteModel.getIndexID() + "/" + routeResult[0].branch;
		}

		routeResult[0].branch = BranchTools.getValidBranch(routeResult[0].branch);

		this.gotoEventObj = new GotoEventItem();
		this.gotoEventObj.routeResult = routeResult;

		//if (route)
		//{
		//	var providedResult:IRouteResultItem = Gaia.router.resolvePage(route);
		//
		//	// if result of provided route doesn't match the goto object, the route has become invalid
		//	if (!providedResult.equals(this.gotoEventObj.routeResult))
		//	{
		//		route = null
		//	}
		//}

		this.gotoEventObj.flow = flow;
		this.gotoEventObj.queryString = queryString;
		this.gotoEventObj.replace = replace;

		this.beforeGoto();
	}

	public onGoto(event:GaiaHistoryEvent):void
	{
		this.goto(event.routeResult);
	}

	// EVENT HIJACKS

	// GOTO BEFORE / AFTER
	public beforeGoto():void
	{
		this.onEvent(GaiaEvent.BEFORE_GOTO);
	}

	public beforeGotoDone():void
	{
		this.gotoEventObj.type = GaiaEvent.GOTO;
		this.dispatchGaiaEvent();
	}

	public afterGoto():void
	{
		this.onEvent(GaiaEvent.AFTER_GOTO);
	}

	public afterGotoDone():void
	{
		this.flowManager.afterGoto();
	}

	// TRANSITION OUT BEFORE / AFTER
	public beforeTransitionOut():void
	{
		this.onEvent(GaiaEvent.BEFORE_TRANSITION_OUT);
	}

	public beforeTransitionOutDone():void
	{
		this.dispatchEvent(new BaseEvent(GaiaHQ.TRANSITION_OUT));
	}

	public afterTransitionOut():void
	{
		this.onEvent(GaiaEvent.AFTER_TRANSITION_OUT);
	}

	public afterTransitionOutDone():void
	{
		this.flowManager.afterTransitionOutDone();
	}

	// PRELOAD BEFORE / AFTER
	public beforePreload():void
	{
		this.onEvent(GaiaEvent.BEFORE_PRELOAD);
	}

	public beforePreloadDone():void
	{
		this.dispatchEvent(new BaseEvent(GaiaHQ.PRELOAD));
	}

	public afterPreload():void
	{
		this.onEvent(GaiaEvent.AFTER_PRELOAD);
	}

	public afterPreloadDone():void
	{
		this.flowManager.afterPreloadDone();
	}

	// TRANSITION IN BEFORE / AFTER
	public beforeTransition():void
	{
		this.onEvent(GaiaEvent.BEFORE_TRANSITION);
	}

	public beforeTransitionDone():void
	{
		this.dispatchEvent(new BaseEvent(GaiaHQ.TRANSITION));
	}

	public afterTransition():void
	{
		this.onEvent(GaiaEvent.AFTER_TRANSITION);
	}

	public afterTransitionDone():void
	{
		this.flowManager.afterTransitionDone();
	}

	// TRANSITION IN BEFORE / AFTER
	public beforeTransitionIn():void
	{
		this.onEvent(GaiaEvent.BEFORE_TRANSITION_IN);
	}

	public beforeTransitionInDone():void
	{
		this.dispatchEvent(new BaseEvent(GaiaHQ.TRANSITION_IN));
	}

	public afterTransitionIn():void
	{
		this.onEvent(GaiaEvent.AFTER_TRANSITION_IN);
	}

	public afterTransitionInDone():void
	{
		this.flowManager.afterTransitionInDone();
	}

	// AFTER COMPLETE
	public afterComplete():void
	{
		this.dispatchEvent(new BaseEvent(GaiaHQ.COMPLETE));
		this.onEvent(GaiaEvent.AFTER_COMPLETE);
	}

	public afterCompleteDone():void
	{
		// we're done
	}

	// WHEN GAIA EVENTS OCCUR THEY ARE ROUTED THROUGH HERE FOR HIJACKING
	private onEvent(eventName:string):void
	{
		var eventHasListeners:boolean = false;
		var eventHasHijackers:boolean = false;
		for (var id in this.listeners[eventName])
		{
			if (this.listeners[eventName].hasOwnProperty(id))
			{
				if (this.listeners[eventName][id] != null)
				{
					eventHasListeners = true;
					var listener:GaiaHQListener = this.listeners[eventName][id];
					if (listener.onlyOnce)
					{
						listener.dispatched = true;
					}
					if (listener.hijack)
					{
						eventHasHijackers = true;
					}
				}
			}
		}
		this.gotoEventObj.type = eventName;
		if (eventHasListeners)
		{
			this.dispatchGaiaEvent();
		}
		if (!eventHasHijackers)
		{
			this[eventName + "Done"]();
		}
		this.removeOnlyOnceListeners(eventName);
	}

	// GENERATES AN EVENT HIJACKER
	private generateListener(eventName:string, target:(event:GaiaEvent) => any):GaiaHQListener
	{
		// prevent duplicate listeners
		for (var id in this.listeners[eventName])
		{
			if (this.listeners[eventName].hasOwnProperty(id))
			{
				if (this.listeners[eventName][id].target == target)
				{
					this.removeEventListener(eventName, target);
					return this.listeners[eventName][id];
				}
			}
		}
		// new listener
		var listener:GaiaHQListener = new GaiaHQListener();
		listener.event = eventName;
		listener.target = target;
		this.listeners[eventName][String(++this.uniqueID)] = listener;
		return listener;
	}

	// REMOVES EVENT LISTENERS BY THEIR UNIQUE ID
	private removeListenerByID(eventName:string, id:string):void
	{
		(<GaiaHQListener>this.listeners[eventName][id]).removeEventListener(CommonEvent.COMPLETE, this.onHijackComplete);
		this.removeEventListener(eventName, (<GaiaHQListener>this.listeners[eventName][id]).target);
		delete this.listeners[eventName][id];
	}

	// REMOVES EVENT LISTENERS THAT ONLY LISTEN ONCE
	private removeOnlyOnceListeners(eventName:string):void
	{
		for (var id in this.listeners[eventName])
		{
			if (this.listeners[eventName].hasOwnProperty(id))
			{
				var listener:GaiaHQListener = this.listeners[eventName][id];
				if (listener.onlyOnce && listener.dispatched && !listener.hijack)
				{
					this.removeListenerByID(eventName, id);
				}
			}
		}
	}

	// RESET COMPLETED HIJACKERS AFTER ALL HIJACKERS ARE COMPLETE AND REMOVE ONLY ONCE HIJACKERS
	private resetEventHijackers(eventName:string):void
	{
		for (var id in this.listeners[eventName])
		{
			if (this.listeners[eventName].hasOwnProperty(id))
			{
				if (this.listeners[eventName][id].hijack)
				{
					if (!this.listeners[eventName][id].onlyOnce)
					{
						this.listeners[eventName][id].completed = false;
					}
					else
					{
						this.removeListenerByID(eventName, id);
					}
				}
			}
		}
	}

	// EVENT RECEIVED FROM EVENT HIJACKERS WHEN WAIT FOR COMPLETE CALLBACK IS CALLED
	private onHijackComplete(event:BaseEvent):void
	{
		var allDone:boolean = true;
		var eventName:string = (<GaiaHQListener>event.target).event;
		for (var id in this.listeners[eventName])
		{
			if (this.listeners[eventName].hasOwnProperty(id))
			{
				if (!this.listeners[eventName][id].completed)
				{
					allDone = false;
					break;
				}
			}
		}
		if (allDone)
		{
			this.resetEventHijackers(eventName);
			this[eventName + "Done"]();
		}
	}

	private dispatchGaiaEvent():void
	{

		var evt:GaiaEvent = new GaiaEvent(
			this.gotoEventObj.type,
			this.gotoEventObj.routeResult,
			this.gotoEventObj.external,
			this.gotoEventObj.src,
			this.gotoEventObj.flow,
			this.gotoEventObj.window,
			null,
			this.gotoEventObj.replace
		);
		this.dispatchEvent(evt);
	}
}

class GaiaHQListener extends EventDispatcher
{
	public event:string;
	public target:(event:BaseEvent, data?:any) => any;
	public hijack:boolean;
	public onlyOnce:boolean;
	public completed:boolean;
	public dispatched:boolean;

	_onHijackCompleteDelegate:(event:BaseEvent) => any;

	constructor()
	{
		super();
	}

	public completeCallback(destroy:boolean = false):void
	{
		this.completed = true;
		if (destroy)
		{
			this.onlyOnce = true;
		}
		this.dispatchEvent(new CommonEvent(CommonEvent.COMPLETE));
	}
}

export default GaiaHQ;