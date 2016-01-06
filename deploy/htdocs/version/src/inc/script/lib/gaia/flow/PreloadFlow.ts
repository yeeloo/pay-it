import refdef from "def/ReferenceDefinitions";
import AbstractFlow from "./AbstractFlow";
import IFlow from "./IFlow";
import Flow from "./Flow";

/**
 * @class PreloadFlow
 */
class PreloadFlow extends AbstractFlow implements IFlow
{
	private _flow:Flow = Flow.PRELOAD

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
		this.flowManager.transitionOut();
	}

	/**
	 * @public
	 * @method afterTransitionOutDone
	 */
	public afterTransitionOutDone():void
	{
		this.flowManager.preload();
	}

	/**
	 * @public
	 * @method afterPreloadDone
	 */
	public afterPreloadDone():void
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

export default PreloadFlow;