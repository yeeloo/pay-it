var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/events/EventDispatcher", "lib/temple/control/sequence/SequenceEvent", "lib/temple/control/sequence/tasks/TaskEvent", "../../utils/Log"], function (require, exports, EventDispatcher_1, SequenceEvent_1, TaskEvent_1, Log_1) {
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
    var Sequence = (function (_super) {
        __extends(Sequence, _super);
        /**
         * Subclasses of Task can have context passed in via their constructor (references to other objects, or other kinds of data).
         * These subclasses can also be listened to for specific events outside of the sequence, and can have a fatter interface than their superclasses (to retrieve context for example, or to query the state of the task).
         *
         * @method constructor
         * @param {string} name a name of the Sequence, used to identify the Sequence. The name is added in the toString() method.
         * @param {boolean} abortOnError a flag if a whole task sequence should stop executing if an error occurs in a task.
         * @param {string} debug
         */
        function Sequence(name, abortOnError) {
            if (name === void 0) { name = null; }
            if (abortOnError === void 0) { abortOnError = true; }
            _super.call(this);
            //holds the tasks in a list
            this._tasks = [];
            //flag if we should abort executing the sequence if an error occurs in a task
            this._abortOnError = false;
            //flag to see if the sequence is executing at the moment
            this._executing = false;
            //is the sequence paused or not?
            this._isPaused = false;
            //flag variable to check whether the first task has executed
            this._firstTask = true;
            // the total number of tasks
            this._total = 0;
            this._log = new Log_1.default('lib.temple.control.sequence.Sequence');
            this._name = name;
            this._abortOnError = abortOnError;
        }
        /**
         * Name of the Sequence, used to identify the Sequence. The name is added in the toString() method.
         *
         * @method getName
         * @return {string}
         */
        Sequence.prototype.getName = function () {
            return this._name;
        };
        /**
         * @method add
         * @param {ITask} task the Task to add to the sequence of tasks to execute
         * @return {Sequence}
         */
        Sequence.prototype.add = function (task) {
            if (this._tasks) {
                this._total++;
                this._tasks.push(task);
            }
            return this;
        };
        /**
         * @method remove
         * @param {ITask} task the Task to remove from the sequence of tasks to execute
         * @return {boolean}
         */
        Sequence.prototype.remove = function (task) {
            var index;
            if (this._tasks && (index = this._tasks.indexOf(task)) != -1) {
                this._tasks.splice(index, 1);
                return true;
            }
            return false;
        };
        /**
         * the method that starts it all. Call this method once to start the execution of the sequence and it's tasks.
         * In order to be able to use the Sequence in an environment that supports Commands, the ICommand interface has been implemented.
         * Whenever a sequence of commands is being executed, calling this method again will produce no result.
         *
         * @method execute
         * @return {void}
         */
        Sequence.prototype.execute = function () {
            if (this.isDestructed()) {
                this._log.error("Sequence is destructed");
            }
            else if (this.isExecuting()) {
                this._log.warn("Sequence has already started");
            }
            else {
                this._log.info("Executing");
                //set a flag
                this._executing = true;
                //dispatch an event for when the sequence starts
                if (this.hasEventListener(TaskEvent_1.default.START))
                    this.dispatchEvent(new SequenceEvent_1.default(SequenceEvent_1.default.START, null, "Sequence has started"));
                this.tryNextTask();
            }
        };
        /**
         * what is the length of the sequence.
         * The (remaining) tasks in the sequence.
         *
         * @method getLength
         * @return {number}
         */
        Sequence.prototype.getLength = function () {
            return this._tasks ? this._tasks.length : 0;
        };
        /**
         * Returns the number of (total) tasks
         *
         * @method getTotal
         * @return {number}
         */
        Sequence.prototype.getTotal = function () {
            return this._total;
        };
        /**
         * check if this sequence contains a specific task.
         *
         * @method contains
         * @param {ITask} task
         * @return {boolean}
         */
        Sequence.prototype.contains = function (task) {
            return this._tasks ? this._tasks.indexOf(task) != -1 : false;
        };
        /**
         * is this Task currently executing it's task or it's subtasks?
         *
         * @method isExecuting
         * @return {boolean}
         */
        Sequence.prototype.isExecuting = function () {
            return this._executing;
        };
        /**
         * is the sequence paused or not?
         *
         * @method isPaused
         * @return {boolean}
         */
        Sequence.prototype.isPaused = function () {
            return this._isPaused;
        };
        /**
         * @inheritDoc
         *
         * pause the sequence flow (not the currently executing task).
         * use resume() to continue the flow.
         *
         * @method pause
         * @return {void}
         */
        Sequence.prototype.pause = function () {
            this._isPaused = true;
        };
        /**
         * @inheritDoc
         * @method resume
         * @return {void}
         */
        Sequence.prototype.resume = function () {
            this._isPaused = false;
            this.tryNextTask();
        };
        /**
         * the currently executing task, or the task that has finished executing as the SequenceEvent.NEXT event is dispatched.
         *
         * @method getCurrent
         * @return {ITask}
         */
        Sequence.prototype.getCurrent = function () {
            return this._current;
        };
        /**
         * A List of the tasks remaining in this sequence to be executed.
         * A client can and may directly manipulate this list of Task items, but will lose type safety.
         * While a client should normally not wish to manipulate this list directly, it might be convenient for power users.
         * This method will probably be used when listening to the SequenceEvent.NEXT event.
         */
        Sequence.prototype.getTasks = function () {
            return this._tasks;
        };
        Sequence.prototype.getTryCatchTaskExecution = function () {
            return this._tryCatchTaskExecution;
        };
        Sequence.prototype.setTryCatchTaskExecution = function (value) {
            this._tryCatchTaskExecution = value;
        };
        /**
         * the sequence handler.
         */
        Sequence.prototype.executeNextTask = function () {
            //this check is a little redundant, as we are checking this in tryNextTask also, but there is an edge case, see the else statement.
            if (!this._isPaused && this._tasks && this._tasks.length) {
                //remove the task from the list
                var task = this._tasks.shift();
                task.addEventListener(TaskEvent_1.default.DONE, this.handleDone.bind(this));
                task.addEventListener(TaskEvent_1.default.ERROR, this.handleError.bind(this));
                task.addEventListener(TaskEvent_1.default.UPDATE, this.handleUpdate.bind(this));
                if (this._current) {
                    //first time around, getCurrent is null.
                    //now, destroy the task. we destroy the task here, because the data inside the task can be manipulated/retrieved by the client in the event handler for SequenceEvent.NEXT
                    this._current.destruct();
                }
                this._current = task;
                if (this._log) {
                    this._log.log("Executing ", task);
                    if (this._tryCatchTaskExecution) {
                        try {
                            task.execute();
                        }
                        catch (error) {
                            this._log.error(error.message);
                            if (this._abortOnError) {
                                //arghhhh, stop right now!!!
                                this._executing = false;
                                if (this.hasEventListener(SequenceEvent_1.default.ERROR)) {
                                    this.dispatchEvent(new SequenceEvent_1.default(SequenceEvent_1.default.ERROR, task, error.message));
                                }
                                else {
                                    throw new Error('Unhandled error: "' + error.message + '"');
                                }
                                //destroy the task here.. this means we can get data from the task via the previous event dispatched before destroying the task
                                task.destruct();
                            }
                            else {
                                if (this.hasEventListener(SequenceEvent_1.default.ERROR_NON_BLOCKING))
                                    this.dispatchEvent(new SequenceEvent_1.default(SequenceEvent_1.default.ERROR_NON_BLOCKING, task, error.message));
                                //well, an error is not nice, but just continue execution of the sequence.
                                this.tryNextTask();
                            }
                        }
                    }
                    else {
                        task.execute();
                    }
                }
                else {
                    //now, execute the task!
                    task.execute();
                }
            }
            else {
            }
        };
        Sequence.prototype.finished = function () {
            this._log.info("finished");
            this._executing = false;
            if (this.hasEventListener(SequenceEvent_1.default.DONE))
                this.dispatchEvent(new SequenceEvent_1.default(SequenceEvent_1.default.DONE, null, "all tasks finished"));
            this.destruct();
        };
        /**
         * TaskEvent handler for errors.
         */
        Sequence.prototype.handleError = function (event) {
            event.task.removeEventListener(TaskEvent_1.default.DONE, this.handleDone);
            event.task.removeEventListener(TaskEvent_1.default.ERROR, this.handleError);
            event.task.removeEventListener(TaskEvent_1.default.UPDATE, this.handleUpdate);
            if (this._abortOnError) {
                //arghhhh, stop right now!!!
                this._executing = false;
                if (this.hasEventListener(SequenceEvent_1.default.ERROR)) {
                    this.dispatchEvent(new SequenceEvent_1.default(SequenceEvent_1.default.ERROR, event.task, event.message));
                }
                else {
                    throw new Error('Unhandled error: "' + event.message + '"');
                }
                //destroy the task here.. this means we can get data from the task via the previous event dispatched before destroying the task
                event.task.destruct();
                this.destruct();
            }
            else {
                if (this.hasEventListener(SequenceEvent_1.default.ERROR_NON_BLOCKING))
                    this.dispatchEvent(new SequenceEvent_1.default(SequenceEvent_1.default.ERROR_NON_BLOCKING, event.task, event.message));
                //well, an error is not nice, but just continue execution of the sequence.
                this.tryNextTask();
            }
        };
        /**
         * this checks the right conditions for a task to be executed
         * while there are tasks and we are not paused, execute them, else we are totally done!
         */
        Sequence.prototype.tryNextTask = function () {
            //when we are paused, just stop...
            if (!this._isPaused && this._tasks) {
                //check if there are tasks to execute
                if (this._tasks.length != 0) {
                    //check if this is the first task
                    if (this._firstTask) {
                        this._firstTask = false;
                    }
                    else {
                        //no, this is not the first task.
                        //dispatch an event. the SequenceEvent.NEXT event might be used to manipulate the task or the sequence
                        //or to get data from the task in the event listener
                        //feed the event with the next task we will execute
                        if (this.hasEventListener(SequenceEvent_1.default.NEXT))
                            this.dispatchEvent(new SequenceEvent_1.default(SequenceEvent_1.default.NEXT, this._current));
                    }
                    this.executeNextTask();
                }
                else {
                    //no tasks left, dispatch final next event to give the client a change to access the latest executed task in the event handler by calling sequence.getCurrent()
                    if (this.hasEventListener(SequenceEvent_1.default.NEXT))
                        this.dispatchEvent(new SequenceEvent_1.default(SequenceEvent_1.default.NEXT, null));
                    if (this._current) {
                        //null check for the edge case when we try to execute a Sequence that was never filled.
                        this._current.destruct();
                    }
                    //we're done
                    this.finished();
                }
            }
        };
        /**
         * TaskEvent handler for when a task is done.
         * These events come from tasks that have been added to the present task in a sequence.
         */
        Sequence.prototype.handleDone = function (event) {
            this._log.log("done: ", event.task);
            event.task.removeEventListener(TaskEvent_1.default.DONE, this.handleDone);
            event.task.removeEventListener(TaskEvent_1.default.ERROR, this.handleError);
            this.tryNextTask();
        };
        Sequence.prototype.handleUpdate = function (event) {
            if (this.hasEventListener(SequenceEvent_1.default.UPDATE))
                this.dispatchEvent(new SequenceEvent_1.default(SequenceEvent_1.default.UPDATE, this._current));
        };
        /**
         * cleans up this sequence.
         */
        Sequence.prototype.destruct = function () {
            if (this._current) {
                this._current.destruct();
                this._current = null;
            }
            if (this._tasks) {
                while (this._tasks.length) {
                    this._tasks.shift().destruct();
                }
                this._tasks = null;
            }
            _super.prototype.destruct.call(this);
        };
        return Sequence;
    })(EventDispatcher_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Sequence;
});
