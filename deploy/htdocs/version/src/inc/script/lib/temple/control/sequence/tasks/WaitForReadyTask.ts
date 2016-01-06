import AbstractTask from "lib/temple/control/sequence/tasks/AbstractTask";

class WaitForReadyTask extends AbstractTask
{
	public isReady:boolean;

	public ready():void
	{
		this.isReady = true;
		if (this.isExecuting())
		{
			this.done();
		}
	}

	public executeTaskHook():void
	{
		if (this.isReady)
		{
			this.done();
		}
	}
}

export default WaitForReadyTask;