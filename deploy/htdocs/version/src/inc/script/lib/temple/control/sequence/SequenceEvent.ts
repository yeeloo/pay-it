import BaseEvent from "lib/temple/events/BaseEvent";
import ITask from "lib/temple/control/sequence/tasks/ITask";

/**
 * SequenceEvent is an event that will be dispatched by a Sequence.
 * Since a sequence holds tasks to be executed, it has a reference to the task that is responsible for generating the event.
 *
 * @author Rolf Vreijdenberger
 */
class SequenceEvent extends BaseEvent
{
	/**
	 * sequence error, abort sequence
	 */
	public static ERROR:string = "SequenceEvent.error";

	/**
	 * task error, do not abort sequence
	 */
	public static ERROR_NON_BLOCKING:string = "SequenceEvent.errorNonBlocking";

	/**
	 * sequence is done
	 */
	public static DONE:string = "SequenceEvent.done";

	/**
	 * ready for the next task in sequence
	 */
	public static NEXT:string = "SequenceEvent.next";

	/**
	 * sequence started
	 */
	public static START:string = "SequenceEvent.start";
	public static UPDATE:string = "SequenceEvent.update";

	/**
	 * @param type the type of the event
	 * @param task the task that is relevant for the context of the event.
	 * @param message an optional message, mainly used with error event types.
	 */
    constructor(type:string, public task:ITask, public message:string = null)
	{
		super(type);
	}
}

export default SequenceEvent;