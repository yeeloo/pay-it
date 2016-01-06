import refdef from "def/ReferenceDefinitions";
import AbstractFlow from "./AbstractFlow";
import IFlow from "./IFlow";
import Flow from "./Flow";
import FlowManager from "./FlowManager";

/**
 * @class CrossFlow
 */
class CrossFlow extends AbstractFlow implements IFlow
{
	private _isInDone:boolean = false;
	private _isOutDone:boolean = false;

	private _flow:Flow = Flow.CROSS;

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
		this._isInDone = this._isOutDone = false;
		this.flowManager.preload();
	}

	/**
	 * @public
	 * @method afterPreloadDone
	 */
	public afterPreloadDone():void
	{
		this.flowManager.transition();
		this.flowManager.transitionOut();
		this.flowManager.transitionIn();
	}

	/**
	 * @public
	 * @method afterTransitionDone
	 */
	public afterTransitionDone():void
	{
	}

	/**
	 * @public
	 * @method afterTransitionInDone
	 */
	public afterTransitionInDone():void
	{
		this._isInDone = true;
		this.checkBothDone();
	}

	/**
	 * @public
	 * @method afterTransitionOutDone
	 */
	public afterTransitionOutDone():void
	{
		this._isOutDone = true;
		this.checkBothDone();
	}

	/**
	 * @public
	 * @method checkBothDone
	 */
	private checkBothDone():void
	{
		if (this._isInDone && this._isOutDone)
		{
			this._isInDone = this._isOutDone = false;
			this.flowManager.complete();
		}
	}
}

export default CrossFlow;
