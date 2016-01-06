import IDestructible from "lib/temple/core/IDestructible";
import BaseEvent from "lib/temple/events/BaseEvent";

/**
 * The IEventDispatcher interface defines methods for adding or removing event listeners, checks whether specific types of event listeners are registered, and dispatches events.
 */
interface IEventDispatcher extends IDestructible
{
	dispatchEvent(event:BaseEvent):boolean;

	dispatch(type:string, data?:any):boolean;

	addEventListener(type:string, listener:(event:BaseEvent) => any, priority?:number, once?:boolean):IDestructible;

	hasEventListener(type:string):boolean;

	removeEventListener(type:string, handler:(event:BaseEvent) => any):void;

	removeAllEventListeners(type?:string):void;
}

export default IEventDispatcher;