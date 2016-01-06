import BaseEvent from "lib/temple/events/BaseEvent";
import EventDispatcher from "lib/temple/events/EventDispatcher";
import IEventDispatcher from "lib/temple/events/IEventDispatcher";
import ITask from "lib/temple/control/sequence/tasks/ITask";
import TaskEvent from "lib/temple/control/sequence/tasks/TaskEvent";

class AbstractTask extends EventDispatcher implements ITask
{
    public progress:number = 0;
    public total:number = 0;

	private _executing:boolean = false;

	/**
	 * Subclasses of Task can have context passed in via their constructor (references to other objects, or other kinds of data).
	 * These subclasses can also be listened to for specific events, and can have a fatter interface than their superclasses (to retrieve context for example, or to query the state of the task).
	 *
	 * When a Task is executed, it should retrieve the necessary information at runtime from the context that was provided to the Task at construction time.
	 *
	 * This is also the way in which a concrete Command should work.
	 *
	 * @see temple.common.interfaces.IExecutable
	 * @see temple.control.Sequence
	 */
	constructor()
	{
		super();
	}

	/**
	 * the method that starts it all. Call this method once to start the execution of the task.
	 * In order to be able to use the Task in an environment that supports Commands, the ICommand interface has been implemented.
	 */
	public execute():void
	{
		//example implementation
		if (this.isExecuting())
		{
			throw new Error("already executing");
		}
		else
		{
			this._executing = true;
			if (this.hasEventListener(TaskEvent.START)) this.dispatchEvent(new TaskEvent(TaskEvent.START, this));
			this.executeTaskHook();
		}
	}

	/**
	 * is this Task currently executing?
	 *
	 * This method might be used by subclasses to control their own functionality.
	 * A class might not want it's execute() method to be called multiple times while it is executing.
	 */
	public isExecuting():boolean
	{
		return this._executing;
	}

	/**
	 * override this method in a subclass to implement your own Task logic here.
	 * It is a hook, which means that it can and should be used in a subclass when necessary.
	 * It is part of the template method pattern in execute().
	 *
	 * Whenever a task is done executing, it must call the done() method or the error() method!!! Don't forget!!!
	 * When this is not done, the sequence will not continue!
	 * the overriden method should <i>not</i> call super.executeTaskHook().
	 *
	 * A class might not want it's execute() method to be called multiple times while it is executing.
	 * A Sequence will not do this anyway, but the client that created the task might...
	 * If this is the case, it should set it's own executing state in this method.
	 * It could alter it's own behavior by checking isExecuting() first.
	 * stub code is provided in this method.
	 */
	public executeTaskHook():void
	{
		this.fail("The method executeTaskHook needs to be overriden in " + toString());
	}

	/**
	 * this method should always be called when a subclass of Task is done executing.
	 * Don't forget to do this as it is essential for the whole sequence to continue.
	 * An example where this could be called is when doing a succesful asynchronous call on URLLoader in a subclass .
	 */
	public done():void
	{
		this._executing = false;
		if (this.hasEventListener(TaskEvent.DONE)) this.dispatchEvent(new TaskEvent(TaskEvent.DONE, this));
	}

	/**
	 * this method should always be called when a subclass of Task should end or has ended because of an error.
	 * Don't forget to do this as it is essential for the Sequence to continue.
	 * An example where this could be called is when doing an asynchronous call on URLLoader that generates an error in a subclass.
	 * @param message the message we want to give about the error.
	 */
	public fail(message?:string):void
	{
		this._executing = false;
		if (this.hasEventListener(TaskEvent.ERROR)) this.dispatchEvent(new TaskEvent(TaskEvent.ERROR, this, message));
	}
}

export default AbstractTask;