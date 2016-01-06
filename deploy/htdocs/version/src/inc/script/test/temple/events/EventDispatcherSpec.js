define(["require", "exports", "lib/temple/events/BaseEvent", "lib/temple/events/EventDispatcher", "lib/polyfills/polyfills"], function (require, exports, BaseEvent_1, EventDispatcher_1, polyfills_1) {
    polyfills_1.default;
    //import config from "app/config/config";
    describe('EventDispatcher', function () {
        var type1 = "a";
        var type2 = "b";
        var event1 = new BaseEvent_1.default(type1);
        var event2 = new BaseEvent_1.default(type2);
        var dispatcher;
        var output;
        var handler1 = function (event) {
            output += "1" + event.type;
        };
        var handler2 = function (event) {
            output += "2" + event.type;
        };
        var handler3 = function (event) {
            output += "3" + event.type;
        };
        beforeEach(function () {
            dispatcher = new EventDispatcher_1.default();
            output = "";
        });
        it('should have executed handler1', function () {
            dispatcher.addEventListener(type1, handler1);
            dispatcher.dispatchEvent(event1);
            expect(output).toBe('1a');
        });
        it('should have executed handler1, handler2 and handler3', function () {
            dispatcher.addEventListener(type1, handler1);
            dispatcher.addEventListener(type1, handler2);
            dispatcher.addEventListener(type1, handler3);
            dispatcher.dispatchEvent(event1);
            expect(output).toBe('1a2a3a');
        });
        it('should have executed handler1, handler2 and handler3 in the right priority', function () {
            dispatcher.addEventListener(type1, handler1);
            dispatcher.addEventListener(type1, handler2, 1);
            dispatcher.addEventListener(type1, handler3, -1);
            dispatcher.dispatchEvent(event1);
            expect(output).toBe('2a1a3a');
        });
        it('should have executed handler1 only once', function () {
            dispatcher.addEventListener(type1, handler1, 0, true);
            dispatcher.dispatchEvent(event1);
            dispatcher.dispatchEvent(event1);
            expect(output).toBe('1a');
        });
        it('should have executed handler1 only once and handler2 twice', function () {
            dispatcher.addEventListener(type1, handler1, 0, true);
            dispatcher.addEventListener(type1, handler2);
            dispatcher.dispatchEvent(event1);
            dispatcher.dispatchEvent(event1);
            expect(output).toBe('1a2a2a');
        });
        it('should have executed handler1 twice and handler2 once', function () {
            dispatcher.addEventListener(type1, handler1);
            var handler = dispatcher.addEventListener(type1, handler2);
            dispatcher.addEventListener(type1, function (event) {
                handler.destruct();
            }, 1);
            dispatcher.dispatchEvent(event1);
            dispatcher.dispatchEvent(event1);
            expect(output).toBe('1a2a1a');
        });
        it('should have handled the second event within the first', function () {
            dispatcher.addEventListener(type1, handler1);
            dispatcher.addEventListener(type1, function (event) {
                dispatcher.dispatchEvent(event2);
            });
            dispatcher.addEventListener(type1, handler2);
            dispatcher.addEventListener(type2, handler1);
            dispatcher.addEventListener(type2, handler2);
            dispatcher.dispatchEvent(event1);
            expect(output).toBe('1a1b2b2a');
        });
    });
});
