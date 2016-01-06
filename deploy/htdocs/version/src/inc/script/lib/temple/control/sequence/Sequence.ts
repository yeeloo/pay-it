import BaseEvent from "lib/temple/events/BaseEvent";
import EventDispatcher from "lib/temple/events/EventDispatcher";
import IEventDispatcher from "lib/temple/events/IEventDispatcher";
import SequenceEvent from "lib/temple/control/sequence/SequenceEvent";
import ITask from "lib/temple/control/sequence/tasks/ITask";
import TaskEvent from "lib/temple/control/sequence/tasks/TaskEvent";
import Log from "../../utils/Log";

/**
 * Error event from a Sequence. The error message can be retrieved from the event.
 * This event occurs when a Sequence finishes with an Error, which it does when it should abortOnError.
 * The DONE event is not dispatched when ERROR is dispatched.
 * The NEXT event is not dispatched when ERROR is dispatched.
 *
 * Whenever a nonblocking error occurs, the sequence will just continue.
 * for nonblocking error detection use the ERROR_NON_BLOCKING event type
 *
 * @eventType nl.dpdk.commands.tasks.SequenceEvent.ERROR
 */
//[Event(name="SequenceEvent.error", type="temple.control.sequence.SequenceEvent")]

/**
 * Error event from a Task that should not abort on error. The error message can be retrieved from the event.
 * a client can listen to this event from a specific subclass,
 * to have more fine grained control over where exactly the error happened.
 * Whenever a nonblocking error occurs, the sequence will just continue executing.
 * This event is dispatched just before trying to execute a possible next task in the sequence, and therefore just before the NEXT event might be called.
 *
 * @eventType nl.dpdk.commands.tasks.SequenceEvent.ERROR_NON_BLOCKING
 */
//	[Event(name="SequenceEvent.errorNonBlocking", type="temple.control.sequence.SequenceEvent")]

/**
 * When a Sequence has totally finished executing all it's tasks, it's DONE event is dispatched
 *
 * @eventType nl.dpdk.commands.tasks.SequenceEvent.DONE
 */
//	[Event(name="SequenceEvent.done", type="temple.control.sequence.SequenceEvent")]

/**
 * When a Sequence begins, it's START event type is dispatched.
 * this event is not called on sequence.resume(), only on sequence.execute().
 *
 * @eventType nl.dpdk.commands.tasks.SequenceEvent.START
 */
//	[Event(name="SequenceEvent.start", type="temple.control.sequence.SequenceEvent")]

/**
 * When a SequenceEvent has multipe tasks, it's NEXT event type is dispatched for each task just before the sequence tries to go to the next task.
 * This might be used as a hook to use an interrupt on a task.
 * sequence.getCurrent() will return the task that has just finished executing, the SequenceEvent.getTask() will hold the task that will be executed next.
 * sequence.setPaused() might be called in the event handler for this event type and the next task will not be executed then.
 * This event is very powerful to manipulate the data in a Task that has just executed, since the task.destroy() method has not yet been called and all data is still intact in the task.
 * IMPORTANT: the event itself contains the task that has just executed with the task.destroy() method not yet called.
 * IMPORTANT: the sequence.getCurrent() method contains the Task that has just finished executing with the task.destroy() method not yet called!
 * IMPORTANT: this event will not fire for the first task that executes. SequenceEvent.START is used for that.
 * IMPORTANT: this event will also fire just before SequenceEvent.DONE to give the client the means to manipulate the final executed task in the Sequence via sequence.getCurrent().
 * IMPORTANT: the real 'next' task that will be executed can be retrieved from sequence.getTasks().get(0);
 *
 * @eventType nl.dpdk.commands.tasks.SequenceEvent.NEXT
 */
//	[Event(name="SequenceEvent.next", type="temple.control.sequence.SequenceEvent")]

/**
 * @module Temple
 */

/**
 * Sequence is a manager for multiple tasks that need to be executed serially.
 * It should be used as a sequence manager, and can hold instances of subclasses of Task.
 *
 * When a sequence runs, it discards it's tasks.
 * We are assuming you only want to run a sequence once.
 * To have a sequence loop over and over, use a method to (re)build the sequence and execute it (again in the event handler for when the sequence is done).
 *
 *
 * Complex nested sequences can be formed by using SequenceTask.
 * Different groups of blocking/nonblocking sequences can be put inside tasks.
 * These tasks can then be put in one sequence that will execute them as a whole.
 * As an example, consider the case where some assets should be loaded by different tasks, but when this fails, it is not critical for the application as a whole.
 * Those tasks can be put in a sequence that does not abort when an error occurs and that sequence will be put in a SequenceTask.
 * At the same time, some assets are essential to be loaded, as some other stuff might depend on them. Those assets loading tasks can be put in a different Sequence that does abort inside a SequenceTask.
 * To have the safety that the noncritical tasks do not prevent the critical tasks to be executed when the noncritical fail,
 * and to have the safety that critical tasks will fail the whole process, we will use both SequenceTasks
 * Both SequenceTasks can now be put in a Sequence that will fail on Error and we have achieved our goal of fine grained, nested and complex flow control.
 * example:
 * 	//should fail when something goes wrong
 * 	var crucial: Sequence = new Sequence(true);
 * 	crucial.add(new LoaderTask("veryImportant.swf");
 * 	crucial.add(new LoaderTask("weNeedThis.swf");
 * 	crucial.add(new VeryComplexTask());
 * 	crucial.add(new LoaderTask("andThisToo.swf");
 *
 * 	 //when something goes wrong, we don't mind
 * 	var optional: Sequence = new Sequence(false);
 * 	optional.add(new LoaderTask("unimportant.swf");
 * 	optional.add(new LoaderTask("boringStuff.swf");
 *
 * 	 //now, put those sequences in a SequenceTask
 * 	var crucialTask: Task = new SequenceTask(crucial);
 * 	var optionalTask: Task = new SequenceTask(optional);
 *
 * 	 //create the master sequence that should fail when something important fails
 * 	var master: Sequence = new Sequence(true);
 * 	master.add(new PreloaderTask());
 * 	master.add(new optionalTask());
 * 	master.add(new crucialTask());
 *
 * 	//now start executing the tasks!
 * 	master.addEventListener(SequenceEvent.ERROR, onError);
 * 	master.addEventListener(SequenceEvent.DONE, onDone);
 * 	master.execute();
 * 	 //when unimportant.swf fails to load, the rest of the tasks and sequences will continue and eventually, onDone will be called
 * 	//when weNeedThis.swf fails to load, onError will be triggered and the rest of the stuff will not be handled.
 *
 * @namespace temple.control.sequence
 * @class Sequence
 * @see temple.control.sequence.tasks.ITask
 * @see temple.control.sequence.tasks.SequenceTask
 * @author Rolf Vreijdenberger, Thomas Brekelmans, Oskar van Velden
 * @construct
 */

class Sequence extends EventDispatcher
{
	//holds the tasks in a list
	private _tasks:ITask[] = [];
	//flag if we should abort executing the sequence if an error occurs in a task
	private _abortOnError:boolean = false;
	//flag to see if the sequence is executing at the moment
	private _executing:boolean = false;
	//is the sequence paused or not?
	private _isPaused:boolean = false;
	//the currently executing task
	private _current:ITask;
	//flag variable to check whether the first task has executed
	private _firstTask:boolean = true;
	// the total number of tasks
	private _total:number = 0;

	private _name:string;
	private _tryCatchTaskExecution:boolean;

	private _log:Log = new Log('lib.temple.control.sequence.Sequence');

	/**
	 * Subclasses of Task can have context passed in via their constructor (references to other objects, or other kinds of data).
	 * These subclasses can also be listened to for specific events outside of the sequence, and can have a fatter interface than their superclasses (to retrieve context for example, or to query the state of the task).
	 *
	 * @method constructor
	 * @param {string} name a name of the Sequence, used to identify the Sequence. The name is added in the toString() method.
	 * @param {boolean} abortOnError a flag if a whole task sequence should stop executing if an error occurs in a task.
	 * @param {string} debug
	 */
	constructor(name:string = null, abortOnError:boolean = true)
	{
		super();

		this._name = name;
		this._abortOnError = abortOnError;
	}

	/**
	 * Name of the Sequence, used to identify the Sequence. The name is added in the toString() method.
	 *
	 * @method getName
	 * @return {string}
	 */
	public getName():string
	{
		return this._name;
	}

	/**
	 * @method add
	 * @param {ITask} task the Task to add to the sequence of tasks to execute
	 * @return {Sequence}
	 */
	public add(task:ITask):Sequence
	{
		if (this._tasks)
		{
			this._total++;
			this._tasks.push(task);
		}
		return this;
	}

	/**
	 * @method remove
	 * @param {ITask} task the Task to remove from the sequence of tasks to execute
	 * @return {boolean}
	 */
	public remove(task:ITask):boolean
	{
		var index:number;
		if (this._tasks && (index = this._tasks.indexOf(task)) != -1)
		{
			this._tasks.splice(index, 1);
			return true;
		}
		return false;
	}

	/**
	 * the method that starts it all. Call this method once to start the execution of the sequence and it's tasks.
	 * In order to be able to use the Sequence in an environment that supports Commands, the ICommand interface has been implemented.
	 * Whenever a sequence of commands is being executed, calling this method again will produce no result.
	 *
	 * @method execute
	 * @return {void}
	 */
	public execute():void
	{
		if (this.isDestructed())
		{
			this._log.error("Sequence is destructed");
		}
		else if (this.isExecuting())
		{
			this._log.warn("Sequence has already started");
		}
		else
		{
			this._log.info("Executing");

			//set a flag
			this._executing = true;
			//dispatch an event for when the sequence starts
			if (this.hasEventListener(TaskEvent.START)) this.dispatchEvent(new SequenceEvent(SequenceEvent.START, null, "Sequence has started"));
			this.tryNextTask();
		}
	}

	/**
	 * what is the length of the sequence.
	 * The (remaining) tasks in the sequence.
	 *
	 * @method getLength
	 * @return {number}
	 */
	public getLength():number
	{
		return this._tasks ? this._tasks.length : 0;
	}

	/**
	 * Returns the number of (total) tasks
	 *
	 * @method getTotal
	 * @return {number}
	 */
	public getTotal():number
	{
		return this._total;
	}

	/**
	 * check if this sequence contains a specific task.
	 *
	 * @method contains
	 * @param {ITask} task
	 * @return {boolean}
	 */
	public contains(task:ITask):boolean
	{
		return this._tasks ? this._tasks.indexOf(task) != -1 : false;
	}

	/**
	 * is this Task currently executing it's task or it's subtasks?
	 *
	 * @method isExecuting
	 * @return {boolean}
	 */
	public isExecuting():boolean
	{
		return this._executing;
	}

	/**
	 * is the sequence paused or not?
	 *
	 * @method isPaused
	 * @return {boolean}
	 */
	public isPaused():boolean
	{
		return this._isPaused;
	}

	/**
	 * @inheritDoc
	 *
	 * pause the sequence flow (not the currently executing task).
	 * use resume() to continue the flow.
	 *
	 * @method pause
	 * @return {void}
	 */
	public pause():void
	{
		this._isPaused = true;
	}

	/**
	 * @inheritDoc
	 * @method resume
	 * @return {void}
	 */
	public resume():void
	{
		this._isPaused = false;
		this.tryNextTask();
	}

	/**
	 * the currently executing task, or the task that has finished executing as the SequenceEvent.NEXT event is dispatched.
	 *
	 * @method getCurrent
	 * @return {ITask}
	 */
	public getCurrent():ITask
	{
		return this._current;
	}

	/**
	 * A List of the tasks remaining in this sequence to be executed.
	 * A client can and may directly manipulate this list of Task items, but will lose type safety.
	 * While a client should normally not wish to manipulate this list directly, it might be convenient for power users.
	 * This method will probably be used when listening to the SequenceEvent.NEXT event.
	 */
	public getTasks():ITask[]
	{
		return this._tasks;
	}

	public getTryCatchTaskExecution():boolean
	{
		return this._tryCatchTaskExecution;
	}

	public setTryCatchTaskExecution(value:boolean):void
	{
		this._tryCatchTaskExecution = value;
	}

	/**
	 * the sequence handler.
	 */
	private executeNextTask():void
	{
		//this check is a little redundant, as we are checking this in tryNextTask also, but there is an edge case, see the else statement.
		if (!this._isPaused && this._tasks && this._tasks.length)
		{
			//remove the task from the list
			var task = this._tasks.shift();
			task.addEventListener(TaskEvent.DONE, <(event:TaskEvent) => void>this.handleDone.bind(this));
			task.addEventListener(TaskEvent.ERROR, <(event:TaskEvent) => void>this.handleError.bind(this));
			task.addEventListener(TaskEvent.UPDATE, <(event:TaskEvent) => void>this.handleUpdate.bind(this));

			if (this._current)
			{
				//first time around, getCurrent is null.
				//now, destroy the task. we destroy the task here, because the data inside the task can be manipulated/retrieved by the client in the event handler for SequenceEvent.NEXT
				this._current.destruct();
			}
			this._current = task;

			if (this._log)
			{
				this._log.log("Executing ", task);

				if (this._tryCatchTaskExecution)
				{
					try
					{
						task.execute();
					}
					catch (error)
					{
						this._log.error(error.message);

						if (this._abortOnError)
						{
							//arghhhh, stop right now!!!
							this._executing = false;
							if (this.hasEventListener(SequenceEvent.ERROR))
							{
								this.dispatchEvent(new SequenceEvent(SequenceEvent.ERROR, task, error.message));
							}
							else
							{
								throw new Error('Unhandled error: "' + error.message + '"');
							}
							//destroy the task here.. this means we can get data from the task via the previous event dispatched before destroying the task
							task.destruct();
						}
						else
						{
							if (this.hasEventListener(SequenceEvent.ERROR_NON_BLOCKING)) this.dispatchEvent(new SequenceEvent(SequenceEvent.ERROR_NON_BLOCKING, task, error.message));
							//well, an error is not nice, but just continue execution of the sequence.
							this.tryNextTask();
						}
					}
				}
				else
				{
					task.execute();
				}
			}
			else
			{
				//now, execute the task!
				task.execute();
			}
		}
		else
		{
			//this might happen if someone directly manipulated the tasks list from outside of this class by clearing the whole thing in the NEXT event handler,
			//or when pausing from the NEXT event handler.
			//edge case that is very unlikely, no need to fix this, I assume you know what you are doing then as those are power functionalities.
			//trace(toString() + ".executeNextTask(): whoops, there is nothing to be done here... but someone is calling us....");
		}
	}

	private finished():void
	{
		this._log.info("finished");

		this._executing = false;
		if (this.hasEventListener(SequenceEvent.DONE)) this.dispatchEvent(new SequenceEvent(SequenceEvent.DONE, null, "all tasks finished"));
		this.destruct();
	}

	/**
	 * TaskEvent handler for errors.
	 */
	private handleError(event:TaskEvent):void
	{
		event.task.removeEventListener(TaskEvent.DONE, this.handleDone);
		event.task.removeEventListener(TaskEvent.ERROR, this.handleError);
		event.task.removeEventListener(TaskEvent.UPDATE, this.handleUpdate);

		if (this._abortOnError)
		{
			//arghhhh, stop right now!!!
			this._executing = false;
			if (this.hasEventListener(SequenceEvent.ERROR))
			{
				this.dispatchEvent(new SequenceEvent(SequenceEvent.ERROR, event.task, event.message));
			}
			else
			{
				throw new Error('Unhandled error: "' + event.message + '"');
			}
			//destroy the task here.. this means we can get data from the task via the previous event dispatched before destroying the task
			event.task.destruct();
			this.destruct();
		}
		else
		{
			if (this.hasEventListener(SequenceEvent.ERROR_NON_BLOCKING)) this.dispatchEvent(new SequenceEvent(SequenceEvent.ERROR_NON_BLOCKING, event.task, event.message));
			//well, an error is not nice, but just continue execution of the sequence.
			this.tryNextTask();
		}
	}

	/**
	 * this checks the right conditions for a task to be executed
	 * while there are tasks and we are not paused, execute them, else we are totally done!
	 */
	private tryNextTask():void
	{
		//when we are paused, just stop...
		if (!this._isPaused && this._tasks)
		{
			//check if there are tasks to execute
			if (this._tasks.length != 0)
			{
				//check if this is the first task
				if (this._firstTask)
				{
					this._firstTask = false;
				}
				else
				{
					//no, this is not the first task.
					//dispatch an event. the SequenceEvent.NEXT event might be used to manipulate the task or the sequence
					//or to get data from the task in the event listener
					//feed the event with the next task we will execute
					if (this.hasEventListener(SequenceEvent.NEXT)) this.dispatchEvent(new SequenceEvent(SequenceEvent.NEXT, this._current));
				}
				this.executeNextTask();
			}
			else
			{
				//no tasks left, dispatch final next event to give the client a change to access the latest executed task in the event handler by calling sequence.getCurrent()
				if (this.hasEventListener(SequenceEvent.NEXT)) this.dispatchEvent(new SequenceEvent(SequenceEvent.NEXT, null));
				if (this._current)
				{
					//null check for the edge case when we try to execute a Sequence that was never filled.
					this._current.destruct();
				}
				//we're done
				this.finished();
			}
		}
	}

	/**
	 * TaskEvent handler for when a task is done.
	 * These events come from tasks that have been added to the present task in a sequence.
	 */
	private handleDone(event:TaskEvent):void
	{
		this._log.log("done: ", event.task);

		event.task.removeEventListener(TaskEvent.DONE, this.handleDone);
		event.task.removeEventListener(TaskEvent.ERROR, this.handleError);
		this.tryNextTask();
	}

    private handleUpdate(event:TaskEvent):void
    {
       if (this.hasEventListener(SequenceEvent.UPDATE))  this.dispatchEvent(new SequenceEvent(SequenceEvent.UPDATE, this._current));
    }

	/**
	 * cleans up this sequence.
	 */
	public destruct():void
	{
		if (this._current)
		{
			this._current.destruct();
			this._current = null;
		}

		if (this._tasks)
		{
			while (this._tasks.length)
			{
				this._tasks.shift().destruct();
			}
			this._tasks = null;
		}
		super.destruct();
	}
}

export default Sequence;