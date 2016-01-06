import IFlow from "./IFlow";
import GaiaHQ from "../core/GaiaHQ";
import Flow from "./Flow";
import NormalFlow from "./NormalFlow";
import CrossFlow from "./CrossFlow";
import PreloadFlow from "./PreloadFlow";

/**
 * @module Gaia
 * @namespace gaia.flow
 * @class FlowManager
 */
class FlowManager
{
	private _flow:IFlow = null;
	private _flows:{[flow:string]:IFlow} = {};

	private _gaiaHQ:GaiaHQ;

	constructor(gaiaHQ:GaiaHQ, flow:Flow = Flow.NORMAL)
	{
		this._gaiaHQ = gaiaHQ;
		this.setFlow(flow);
	}

	public getFlow():Flow
	{
		return this._flow.getFlow();
	}

	public setFlow(flow:Flow):void
	{
		if (this._flows[flow])
		{
			this._flow = this._flows[flow];
		}
		else
		{
			switch(flow)
			{
				case Flow.NORMAL:
				{
					this._flow = new NormalFlow(this);
					break;
				}
				case Flow.CROSS:
				{
					this._flow = new CrossFlow(this);
					break;
				}
				case Flow.PRELOAD:
				{
					this._flow = new PreloadFlow(this);
					break;
				}
				case null:
				{
					// keep current, do nothing
					return;
				}
				default:
				{
					throw new Error("Unhandled flow: " + flow);
				}
			}
			this._flows[flow] = this._flow;
		}
	}

	/**
	 * from GaiaHQ to flow
	 *
	 * @public
	 * @method afterGoto
	 */
	public afterGoto():void
	{
		this._flow.start();
	}

	/**
	 * @public
	 * @method afterTransitionOutDone
	 */
	public afterTransitionOutDone():void
	{
		this._flow.afterTransitionOutDone();
	}

	/**
	 * @public
	 * @method afterPreloadDone
	 */
	public afterPreloadDone():void
	{
		this._flow.afterPreloadDone();
	}

	/**
	 * @public
	 * @method afterTransitionDone
	 */
	public afterTransitionDone():void
	{
		this._flow.afterTransitionDone();
	}

	/**
	 * @public
	 * @method afterTransitionInDone
	 */
	public afterTransitionInDone():void
	{
		this._flow.afterTransitionInDone();
	}

	// from flow
	// to GaiaHQ

	/**
	 * @public
	 * @method transitionOut
	 */
	public transitionOut():void
	{
		this._gaiaHQ.beforeTransitionOut();
	}

	/**
	 * @public
	 * @method preload
	 */
	public preload():void
	{
		this._gaiaHQ.beforePreload();
	}

	/**
	 * @public
	 * @method transition
	 */
	public transition():void
	{
		this._gaiaHQ.beforeTransition();
	}

	/**
	 * @public
	 * @method transitionIn
	 */
	public transitionIn():void
	{
		this._gaiaHQ.beforeTransitionIn();
	}

	/**
	 * @public
	 * @method complete
	 */
	public complete():void
	{
		this._gaiaHQ.afterComplete();
	}

	// from SiteController
	// to GaiaHQ

	/**
	 * @public
	 * @method start
	 */
	public start(flow:Flow):void
	{
		if (flow)
		{
			this.setFlow(flow);
		}
		this._gaiaHQ.afterGoto();
	}

	/**
	 * @public
	 * @method transitionOutComplete
	 */
	public transitionOutComplete():void
	{
		this._gaiaHQ.afterTransitionOut();
	}

	/**
	 * @public
	 * @method preloadComplete
	 */
	public preloadComplete():void
	{
		this._gaiaHQ.afterPreload();
	}

	/**
	 * @public
	 * @method transitionComplete
	 */
	public transitionComplete():void
	{
		this._gaiaHQ.afterTransition();
	}

	/**
	 * @public
	 * @method transitionInComplete
	 */
	public transitionInComplete():void
	{
		this._gaiaHQ.afterTransitionIn();
	}
}

export default FlowManager;