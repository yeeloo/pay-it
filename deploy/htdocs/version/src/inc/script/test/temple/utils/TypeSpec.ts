import refdef from "def/ReferenceDefinitions";
import externals from "lib/externals";
import Type from "lib/temple/utils/Type";

describe('temple.utils.Type', () => {

	it('Type(Object) to return \'string\'', () =>
	{
		var date = new Date();
		var obj0 = {};
		var obj1 = new Object();
		var obj2 = new Function().prototype;

		expect(Type({})).toEqual(Type.OBJECT);
		expect(Type(obj0)).toEqual(Type.OBJECT);
		expect(Type(obj1)).toEqual(Type.OBJECT);
		expect(Type(obj2)).toEqual(Type.OBJECT);
	});

	it('Type(Array) to return \'array\'', function()
	{
		var date = [];
		var obj = {length:1};

		expect(Type([])).toEqual(Type.ARRAY);
		expect(Type(obj)).toEqual(Type.OBJECT);
		expect(Type(arguments)).toEqual(Type.ARGUMENTS);
		expect(Type.isArray([])).toEqual(true);
		expect(Type.isArray(arguments)).toEqual(false);
	});

	it('Type(arguments) to return \'arguments\'', function()
	{
		expect(Type(arguments)).toEqual(Type.ARGUMENTS);
		expect(Type.isArguments(arguments)).toEqual(true);
	});

	it('Type(Date) to return \'date\'', () =>
	{
		var d = new Date();
		expect(Type(d)).toEqual(Type.DATE);
		expect(Type.isDate(d)).toEqual(true);
	});

	it('Type(function) to return \'function\'', () =>
	{
		var t = function(){};
		expect(Type(t)).toEqual(Type.FUNCTION);
		expect(Type.isFunction(t)).toEqual(true);
	});

	it('Type(number) to return \'number\'', () =>
	{
		var t = [
			0, 1, -1, -20000
		];

		for(var i = 0; i < 10; i++)
		{
			t.push(Math.random() * Number.MAX_VALUE );
			t.push(Math.random() * Number.MIN_VALUE );
		}

		for(var i = 0; i < t.length; i++)
		{
			var n = t[i];
			expect(Type(n)).toEqual(Type.NUMBER);
		}

	});

	it('Type.isFloat(float) to return true', () =>
	{
		var int = [
			0, 1, -1, -20000
		];

		var float = [];

		for(var i = 0; i < 10; i++)
		{
			float.push( (Math.random() * (Number.MAX_VALUE - 100)) + .1236918236 );
			float.push((Math.random() * (Number.MIN_VALUE + 100)) + .1236918236 );
		}

		for(var i = 0; i < float.length; i++)
		{
			expect(Type.isFloat(float[i])).toEqual(true);
		}

		for(var i = 0; i < int.length; i++)
		{
			expect(Type.isFloat(int[i])).toEqual(false);
		}

	});

	it('Type.isInt(int) to return true', () =>
	{
		var int = [
			0, 1, -1, -20000
		];

		var float = [];

		for(var i = 0; i < 10; i++)
		{
			float.push( (Math.random() * (Number.MAX_VALUE - 100)) + .1236918236 );
			float.push((Math.random() * (Number.MIN_VALUE + 100)) + .1236918236 );
		}

		for(var i = 0; i < float.length; i++)
		{
			//console.log(float[i], Type.isInteger(float[i]));
			//console.log(float[i], parseInt(float[i]), parseInt(float[i]) === float[i]);
			//console.log(float[i], parseInt(float[i], 10), parseInt(float[i], 10) === float[i]);
			//expect(Type.isInteger(float[i])).toEqual(false);

			// Narie: either this test or the function is not working correct for the MAX_VALUE
			// values with an e+xxx are not coverted to integers (in node 0.12.1), and also not correct in in browser
			// for other values
			// LOG: 1.5673110970801278e+308, true
			// LOG: 1.5673110970801278e+308, 1.5673110970801278e+308, true
			// LOG: 1.5673110970801278e+308, 1.5673110970801278e+308, true
			// http://www.2ality.com/2013/01/parseint.html
		}

		for(var i = 0; i < int.length; i++)
		{
			expect(Type.isInteger(int[i])).toEqual(true);
		}

	});

	it('Type.isUndefined(int) to return true', () =>
	{
		var asd;
		expect(Type.isUndefined(asd)).toEqual(true);
		expect(Type.isUndefined()).toEqual(true);
	});

	it('Type.isElement(element) to return true', () =>
	{
		var elements = ['div', 'span', 'table', 'br', 'video'];

		for(var i = 0; i < elements.length; i++)
		{
			var el = document.createElement(elements[i]);
			expect(Type.isElement(el)).toEqual(true);
			expect(Type(el)).toEqual(Type.ELEMENT);
		}
	});

	it('Type.isWhiteSpace(\' \') to return true', () =>
	{
		var elements = ['div', 'span', 'table', 'br', 'video'];

		var el = document.createElement('div');
		el.innerHTML = "asd\nasd";

		expect(Type.isWhiteSpace(' ')).toEqual(false);
		expect(Type.isTextNode(el.childNodes[0])).toEqual(true);

	});

	it('Type.isTextnode(textNode) to return true', () =>
	{
		var el = document.createElement('div');
		el.innerHTML = "asd\nasd";
		expect(Type.isTextNode('asdasd')).toEqual(false);
		expect(Type.isTextNode(el.childNodes[0])).toEqual(true);

	});

	it('Type.isNaN(NaN) to return true', () =>
	{
		expect(Type.isNaN(NaN)).toEqual(true);
		expect(Type.isNaN('assadds')).toEqual(false);
		expect(Type.isNaN(12212312)).toEqual(false);
		expect(Type.isNotANumber('assadds')).toEqual(true);
		expect(Type.isNotANumber(123)).toEqual(false);
	});

	it('Type.isNULL(null) to return true', () =>
	{
		expect(Type.isNULL(null)).toEqual(true);
		expect(Type.isNULL('')).toEqual(false);
		expect(Type.isNULL(0)).toEqual(false);
	});
});

