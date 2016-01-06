import Flow from "./Flow";
import FlowManager from "./FlowManager";

interface IFlow
{
	getFlow():Flow;

	start():void;
	afterPreloadDone():void;
	afterTransitionOutDone():void;
	afterTransitionDone():void;
	afterTransitionInDone():void
}

export default IFlow;