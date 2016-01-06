import refdef from "def/ReferenceDefinitions";
import AbstractFlow from "./AbstractFlow";
import IFlow from "./IFlow";
import Flow from "./Flow";
import FlowManager from "./FlowManager";

/**
 * @class NormalFlow
 */
class NormalFlow extends AbstractFlow implements IFlow
{
	private _flow:Flow = Flow.NORMAL

	public getFlow():Flow
	{
		return this._flow
	}

	/**
	 * @public
	 * @method start
	 */
	public start():void
	{
		this.flowManager.preload();
	}

	/**
	 * @public
	 * @method afterPreloadDone
	 */
	public afterPreloadDone():void
	{
		this.flowManager.transitionOut();
	}

	/**
	 * @public
	 * @method afterTransitionOutDone
	 */
	public afterTransitionOutDone():void
	{
		this.flowManager.transition();
	}

	/**
	 * @public
	 * @method afterTransitionDone
	 */
	public afterTransitionDone():void
	{
		this.flowManager.transitionIn();
	}

	/**
	 * @public
	 * @method afterTransitionInDone
	 */
	public afterTransitionInDone():void
	{
		this.flowManager.complete();
	}
}

export default NormalFlow;