import refdef from "def/ReferenceDefinitions";
import IDestructible from "lib/temple/core/IDestructible";
import FlowManager from "./FlowManager";

class AbstractFlow implements IDestructible
{
	public flowManager:FlowManager;

	constructor(flowManager:FlowManager)
	{
		this.flowManager = flowManager;
	}

	public isDestructed():boolean
	{
		return this.flowManager != null;
	}

	public destruct():void
	{
		this.flowManager = null;
	}
}

export default AbstractFlow;