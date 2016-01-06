import * as Gaia from "../api/Gaia";
import GaiaHQ from "../core/GaiaHQ";
import BranchTools from "../core/BranchTools";
import BranchLoader from "../core/BranchLoader";
import BranchManager from "../core/BranchManager";
import SiteModel from "../core/SiteModel";
import SiteView from "../core/SiteView";
import TransitionController from "../core/TransitionController";
import FlowManager from "../flow/FlowManager";
import Flow from "../flow/Flow";
import IPageAsset from "../interface/IPageAsset";
import GaiaEvent from "../events/GaiaEvent";
import PageEvent from "../events/PageEvent";
import BranchLoaderEvent from "../events/BranchLoaderEvent";

import IRouteResultItem from "../router/IRouteResultItem";

import EventDispatcher from "lib/temple/events/EventDispatcher";
import BaseEvent from "lib/temple/events/BaseEvent";
import CommonEvent from "lib/temple/events/CommonEvent";
import * as utils from "lib/temple/utils/Utils";

/**
 * @module Gaia
 * @namespace gaia.core
 * @class BranchManager
 * @extends temple.events.EventDispatcher
 */
class SiteController extends EventDispatcher
{
	//private static preloadController:PreloadController;
	private static currentBranch:string = "";
	private static currentRoute:string = "";

	private static isTransitioning:boolean = false;
	private static isLoading:boolean = false;

	private transitionController:TransitionController = new TransitionController();
	private branchLoader:BranchLoader = new BranchLoader();
	private siteView:SiteView;

	private queuedBranch:IRouteResultItem;
	private queuedFlow:Flow = null;

	constructor(sv:SiteView)//, preloader:IPreloader)
	{
		super();
		this.siteView = sv;

		//preloadController = new PreloadController(null, preloader);
		//preloadController.addEventListener(PreloadController.READY, onPreloaderReady, false, 1);
		//preloadController.addEventListener(Event.COMPLETE, onPreloadComplete);

		this.branchLoader.addEventListener(BranchLoaderEvent.LOAD_PAGE, this.onLoadPage);
		this.branchLoader.addEventListener(BranchLoaderEvent.LOAD_ASSET, this.onLoadAsset);

		//this.branchLoader.addEventListener(BranchLoaderEvent.START, this.preloadController.onStart);
		//this.branchLoader.addEventListener(AssetEvent.ASSET_PROGRESS, preloadController.onProgress);
		//this.branchLoader.addEventListener(Event.COMPLETE, preloadController.onComplete);

		this.branchLoader.addEventListener(
			CommonEvent.COMPLETE,
			<(event:BaseEvent) => any>this.onPreloadComplete.bind(this)
		);

		this.transitionController.addEventListener(
			PageEvent.TRANSITION_OUT_COMPLETE,
			this.onTransitionOutComplete
		);

		this.transitionController.addEventListener(
			PageEvent.TRANSITION_IN_COMPLETE,
			this.onTransitionInComplete
		);

		this.transitionController.addEventListener(
			PageEvent.TRANSITION_COMPLETE,
			this.onTransitionComplete
		);

		this.transitionController.addEventListener(PageEvent.BEFORE_INIT, <any>this.dispatchEvent.bind(this));
	}

	public static getCurrentBranch():string
	{
		return SiteController.currentBranch;
	}

	public static getCurrentRoute():string
	{
		return SiteController.currentRoute;
	}

	//public static getPreloader():PreloadController
	//{
	//	return preloadController;
	//}

	public static isBusy():boolean
	{
		return SiteController.isTransitioning || SiteController.isLoading;
	}

	// GAIAHQ RECEIVER
	public onGoto(event:GaiaEvent):void
	{
		BranchManager.cleanup();
		var validBranch:string = event.routeResult[0].branch;

		if (!event.external)
		{
			if (validBranch != SiteController.currentBranch)
			{
				if (!SiteController.isTransitioning && !SiteController.isLoading)
				{
					this.queuedBranch = null;
					this.queuedFlow = null;
					var flow:Flow;
					if (event.flow == null)
					{
						flow = SiteModel.defaultFlow;

						if (!SiteModel.getTree().active && SiteModel.getIndexFirst())
						{
							// first just load the index
							SiteController.currentBranch = SiteModel.getIndexID();
							//flow = SiteModel.getTree().flow;
						}
						else
						{
							// need to get the branch root page that will transition in to determine flow
							var prevArray:IPageAsset[] = BranchTools.getPagesOfBranch(SiteController.currentBranch);
							var newArray:IPageAsset[] = BranchTools.getPagesOfBranch(validBranch);
							var i:number;
							for (i = 0; i < newArray.length; i++)
							{
								if (newArray[i] != prevArray[i])
								{
									break;
								}
							}
							if (newArray[i] == null || newArray[i] == undefined)
							{
								//flow = SiteModel.defaultFlow;
							}
							else
							{
								//flow = PageAsset(newArray[i]).flow;
							}
							SiteController.currentBranch = validBranch;
						}
					}
					else
					{
						flow = event.flow;
						SiteController.currentBranch = validBranch;
					}
					GaiaHQ.getInstance().flowManager.start(flow);
				}
				else
				{
					this.queuedBranch = event.routeResult;
					this.queuedFlow = event.flow;
					if (!SiteController.isLoading)
					{
						this.transitionController.interrupt();
					}
					else
					{
						this.branchLoader.interrupt();
					}
				}
			}
		}
		else
		{
			//this.launchExternalPage(event.src, event.window);
		}
	}

	// BRANCH LOADER EVENT LISTENERS
	public onLoadPage(event:BranchLoaderEvent):void
	{
		SiteController.isLoading = true;
		var page:IPageAsset = event.asset;
		BranchManager.addPage(page);
		//siteView.addPage(page);
		page.preload();
	}

	public onLoadAsset(event:BranchLoaderEvent):void
	{
		SiteController.isLoading = true;
		//if (event.asset is DisplayObjectAsset) siteView.addAsset(event.asset as DisplayObjectAsset);
		//if (event.asset.preloadAsset) event.asset.preload();
	}

	// GAIAHQ EVENT LISTENERS
	public onTransitionOut(event:BaseEvent):void
	{
		if (!this.checkQueuedBranch())
		{
			SiteController.isTransitioning = true;
			this.transitionController.transitionOut(BranchManager.getTransitionOutArray(SiteController.currentBranch));
		}
	}

	public onTransitionIn(event:BaseEvent):void
	{
		if (!this.checkQueuedBranch())
		{
			SiteController.isTransitioning = true;
			this.transitionController.transitionIn(BranchTools.getPagesOfBranch(SiteController.currentBranch));
		}
	}

	public onTransition(event:BaseEvent):void
	{
		if (!this.checkQueuedBranch())
		{
			SiteController.isTransitioning = true;
			this.transitionController.transition(BranchManager.getTransitionOutArray(SiteController.currentBranch),
				BranchTools.getPagesOfBranch(SiteController.currentBranch));
		}
	}

	public onPreload(event:BaseEvent):void
	{
		if (!this.checkQueuedBranch())
		{
			SiteController.isLoading = true;
			this.branchLoader.loadBranch(SiteController.currentBranch);
		}
	}

	public onComplete(event:BaseEvent):void
	{
		this.checkQueuedBranch();
	}

	public onPreloadComplete(event:BaseEvent):void
	{
		SiteController.isLoading = false;
		GaiaHQ.getInstance().flowManager.preloadComplete();
		//this.siteView.preloader.addEventListener(Event.ENTER_FRAME, preloaderEnterFrame);
	}

	// TRANSITION CONTROLLER EVENT LISTENERS
	private onTransitionOutComplete(event:PageEvent):void
	{
		BranchManager.cleanup();
		GaiaHQ.getInstance().flowManager.transitionOutComplete();
	}

	private onTransitionInComplete(event:PageEvent):void
	{
		BranchManager.cleanup();
		GaiaHQ.getInstance().flowManager.transitionInComplete();
	}

	private onTransitionComplete(event:PageEvent):void
	{
		BranchManager.cleanup();
		GaiaHQ.getInstance().flowManager.transitionComplete();
	}

	// UTILITY FUNCTIONS
	private checkQueuedBranch():boolean
	{
		SiteController.isLoading = SiteController.isTransitioning = false;
		if (this.queuedBranch)
		{
			this.redirect();
			return true;
		}
		return false;
	}

	private redirect():void
	{
		// Waiting one frame makes this more stable when spamming goto events
		//this.siteView.addEventListener(Event.ENTER_FRAME, siteViewEnterFrame);
		GaiaHQ.getInstance().goto(this.queuedBranch, this.queuedFlow);
	}

	private onPreloaderReady(event:Event):void
	{
		//this.preloadController.removeEventListener(Event.COMPLETE, onPreloaderReady);
		//if (this.PreloadController(event.target).asset) this.siteView.preloader.addChild(PreloadController(event.target).asset.loader);
		////siteView.preloader.addChild(DisplayObject(preloadController.clip));
	}

	// EnterFrame functions
	private preloaderEnterFrame(event:Event):void
	{
		GaiaHQ.getInstance().flowManager.preloadComplete();
		//this.siteView.preloader.removeEventListener(Event.ENTER_FRAME, preloaderEnterFrame);
	}

	private siteViewEnterFrame(event:Event):void
	{
		GaiaHQ.getInstance().goto(this.queuedBranch, this.queuedFlow);
		//this.siteView.removeEventListener(Event.ENTER_FRAME, siteViewEnterFrame);
	}
}


export default SiteController;