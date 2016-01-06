define(["require", "exports", "lib/temple/utils/Type"], function (require, exports, Type_1) {
    describe('temple.utils.Type', function () {
        it('Type(Object) to return \'string\'', function () {
            var date = new Date();
            var obj0 = {};
            var obj1 = new Object();
            var obj2 = new Function().prototype;
            expect(Type_1.default({})).toEqual(Type_1.default.OBJECT);
            expect(Type_1.default(obj0)).toEqual(Type_1.default.OBJECT);
            expect(Type_1.default(obj1)).toEqual(Type_1.default.OBJECT);
            expect(Type_1.default(obj2)).toEqual(Type_1.default.OBJECT);
        });
        it('Type(Array) to return \'array\'', function () {
            var date = [];
            var obj = { length: 1 };
            expect(Type_1.default([])).toEqual(Type_1.default.ARRAY);
            expect(Type_1.default(obj)).toEqual(Type_1.default.OBJECT);
            expect(Type_1.default(arguments)).toEqual(Type_1.default.ARGUMENTS);
            expect(Type_1.default.isArray([])).toEqual(true);
            expect(Type_1.default.isArray(arguments)).toEqual(false);
        });
        it('Type(arguments) to return \'arguments\'', function () {
            expect(Type_1.default(arguments)).toEqual(Type_1.default.ARGUMENTS);
            expect(Type_1.default.isArguments(arguments)).toEqual(true);
        });
        it('Type(Date) to return \'date\'', function () {
            var d = new Date();
            expect(Type_1.default(d)).toEqual(Type_1.default.DATE);
            expect(Type_1.default.isDate(d)).toEqual(true);
        });
        it('Type(function) to return \'function\'', function () {
            var t = function () { };
            expect(Type_1.default(t)).toEqual(Type_1.default.FUNCTION);
            expect(Type_1.default.isFunction(t)).toEqual(true);
        });
        it('Type(number) to return \'number\'', function () {
            var t = [
                0, 1, -1, -20000
            ];
            for (var i = 0; i < 10; i++) {
                t.push(Math.random() * Number.MAX_VALUE);
                t.push(Math.random() * Number.MIN_VALUE);
            }
            for (var i = 0; i < t.length; i++) {
                var n = t[i];
                expect(Type_1.default(n)).toEqual(Type_1.default.NUMBER);
            }
        });
        it('Type.isFloat(float) to return true', function () {
            var int = [
                0, 1, -1, -20000
            ];
            var float = [];
            for (var i = 0; i < 10; i++) {
                float.push((Math.random() * (Number.MAX_VALUE - 100)) + .1236918236);
                float.push((Math.random() * (Number.MIN_VALUE + 100)) + .1236918236);
            }
            for (var i = 0; i < float.length; i++) {
                expect(Type_1.default.isFloat(float[i])).toEqual(true);
            }
            for (var i = 0; i < int.length; i++) {
                expect(Type_1.default.isFloat(int[i])).toEqual(false);
            }
        });
        it('Type.isInt(int) to return true', function () {
            var int = [
                0, 1, -1, -20000
            ];
            var float = [];
            for (var i = 0; i < 10; i++) {
                float.push((Math.random() * (Number.MAX_VALUE - 100)) + .1236918236);
                float.push((Math.random() * (Number.MIN_VALUE + 100)) + .1236918236);
            }
            for (var i = 0; i < float.length; i++) {
            }
            for (var i = 0; i < int.length; i++) {
                expect(Type_1.default.isInteger(int[i])).toEqual(true);
            }
        });
        it('Type.isUndefined(int) to return true', function () {
            var asd;
            expect(Type_1.default.isUndefined(asd)).toEqual(true);
            expect(Type_1.default.isUndefined()).toEqual(true);
        });
        it('Type.isElement(element) to return true', function () {
            var elements = ['div', 'span', 'table', 'br', 'video'];
            for (var i = 0; i < elements.length; i++) {
                var el = document.createElement(elements[i]);
                expect(Type_1.default.isElement(el)).toEqual(true);
                expect(Type_1.default(el)).toEqual(Type_1.default.ELEMENT);
            }
        });
        it('Type.isWhiteSpace(\' \') to return true', function () {
            var elements = ['div', 'span', 'table', 'br', 'video'];
            var el = document.createElement('div');
            el.innerHTML = "asd\nasd";
            expect(Type_1.default.isWhiteSpace(' ')).toEqual(false);
            expect(Type_1.default.isTextNode(el.childNodes[0])).toEqual(true);
        });
        it('Type.isTextnode(textNode) to return true', function () {
            var el = document.createElement('div');
            el.innerHTML = "asd\nasd";
            expect(Type_1.default.isTextNode('asdasd')).toEqual(false);
            expect(Type_1.default.isTextNode(el.childNodes[0])).toEqual(true);
        });
        it('Type.isNaN(NaN) to return true', function () {
            expect(Type_1.default.isNaN(NaN)).toEqual(true);
            expect(Type_1.default.isNaN('assadds')).toEqual(false);
            expect(Type_1.default.isNaN(12212312)).toEqual(false);
            expect(Type_1.default.isNotANumber('assadds')).toEqual(true);
            expect(Type_1.default.isNotANumber(123)).toEqual(false);
        });
        it('Type.isNULL(null) to return true', function () {
            expect(Type_1.default.isNULL(null)).toEqual(true);
            expect(Type_1.default.isNULL('')).toEqual(false);
            expect(Type_1.default.isNULL(0)).toEqual(false);
        });
    });
});
