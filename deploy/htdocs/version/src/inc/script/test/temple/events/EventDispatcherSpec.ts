import BaseEvent from "lib/temple/events/BaseEvent";
import EventDispatcher from "lib/temple/events/EventDispatcher";
import IDestructible from "lib/temple/core/IDestructible";
import polyfills from "lib/polyfills/polyfills";
polyfills;

//import config from "app/config/config";
describe('EventDispatcher', () =>
{
	var type1:string = "a";
	var type2:string = "b";

	var event1:BaseEvent = new BaseEvent(type1);
	var event2:BaseEvent = new BaseEvent(type2);

	var dispatcher:EventDispatcher;
	var output:string;

	var handler1 = (event:BaseEvent)=>
	{
		output += "1" + event.type;
	};

	var handler2 = (event:BaseEvent)=>
	{
		output += "2" + event.type;
	};

	var handler3 = (event:BaseEvent)=>
	{
		output += "3" + event.type;
	};

	beforeEach(function()
	{
		dispatcher = new EventDispatcher();
		output = "";
	});

	it('should have executed handler1', () =>
	{
		dispatcher.addEventListener(type1, handler1);
		dispatcher.dispatchEvent(event1);

		expect(output).toBe('1a');
	});

	it('should have executed handler1, handler2 and handler3', () =>
	{
		dispatcher.addEventListener(type1, handler1);
		dispatcher.addEventListener(type1, handler2);
		dispatcher.addEventListener(type1, handler3);
		dispatcher.dispatchEvent(event1);

		expect(output).toBe('1a2a3a');
	});

	it('should have executed handler1, handler2 and handler3 in the right priority', () =>
	{
		dispatcher.addEventListener(type1, handler1);
		dispatcher.addEventListener(type1, handler2, 1);
		dispatcher.addEventListener(type1, handler3, -1);
		dispatcher.dispatchEvent(event1);

		expect(output).toBe('2a1a3a');
	});

	it('should have executed handler1 only once', () =>
	{
		dispatcher.addEventListener(type1, handler1, 0, true);
		dispatcher.dispatchEvent(event1);
		dispatcher.dispatchEvent(event1);

		expect(output).toBe('1a');
	});

	it('should have executed handler1 only once and handler2 twice', () =>
	{
		dispatcher.addEventListener(type1, handler1, 0, true);
		dispatcher.addEventListener(type1, handler2);
		dispatcher.dispatchEvent(event1);
		dispatcher.dispatchEvent(event1);

		expect(output).toBe('1a2a2a');
	});

	it('should have executed handler1 twice and handler2 once', () =>
	{
		dispatcher.addEventListener(type1, handler1);
		var handler:IDestructible = dispatcher.addEventListener(type1, handler2);

		dispatcher.addEventListener(type1, (event:BaseEvent) =>
		{
			handler.destruct();
		}, 1);


		dispatcher.dispatchEvent(event1);
		dispatcher.dispatchEvent(event1);

		expect(output).toBe('1a2a1a');
	});

	it('should have handled the second event within the first', () =>
	{
		dispatcher.addEventListener(type1, handler1);
		dispatcher.addEventListener(type1, (event:BaseEvent) =>
		{
			dispatcher.dispatchEvent(event2);
		});
		dispatcher.addEventListener(type1, handler2);

		dispatcher.addEventListener(type2, handler1);
		dispatcher.addEventListener(type2, handler2);

		dispatcher.dispatchEvent(event1);

		expect(output).toBe('1a1b2b2a');
	});
});