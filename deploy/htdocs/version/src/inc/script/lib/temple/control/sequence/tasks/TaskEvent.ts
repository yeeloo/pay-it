import BaseEvent from "lib/temple/events/BaseEvent";
import ITask from "lib/temple/control/sequence/tasks/ITask";

class TaskEvent extends BaseEvent
{
	public static DONE:string = "TaskEvent.done";
	public static START:string = "TaskEvent.start";
	public static ERROR:string = "TaskEvent.error";
	public static UPDATE:string = "TaskEvent.update";

	/**
	 * @param type the type of the event
	 * @param task the task that <i>originally</i> generated the event (explicitly, instead of using event.target)
	 * @param message an optional message, mainly used with error event types.
	 */
	constructor(type:string, public task:ITask, public message:string = null)
	{
		super(type);
	}
}

export default TaskEvent;