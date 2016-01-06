import refdef from "def/ReferenceDefinitions";
import ko = require('knockout');

//interface KnockoutBindingHandlers
//{
//	tap:KnockoutBindingHandler;
//	swipeleft:KnockoutBindingHandler;
//	swiperight:KnockoutBindingHandler;
//	swipeup:KnockoutBindingHandler;
//	swipedown:KnockoutBindingHandler;
//}

//declare module ko
//{
//	export var bindingHandlers:KnockoutBindingHandlers;
//}

ko.bindingHandlers['tap'] = {
	'init': function (element, valueAccessor, allBindingsAccessor, viewModel)
	{
		$(element).on(typeof(window['ontouchstart']) != 'undefined' ? 'tap' : 'click', (e) =>
		{
			e.preventDefault();
			valueAccessor().call(viewModel, viewModel, e)
		});
	}
};

ko.bindingHandlers['swipeleft'] = {
	'init': function (element, valueAccessor, allBindingsAccessor, viewModel)
	{
		$(element).on('swipeleft', (e) =>
		{
			e.preventDefault();
			valueAccessor().call(viewModel, viewModel, e)
		});
	}
};

ko.bindingHandlers['swiperight'] = {
	'init': function (element, valueAccessor, allBindingsAccessor, viewModel)
	{
		$(element).on('swiperight', (e) =>
		{
			e.preventDefault();
			valueAccessor().call(viewModel, viewModel, e)
		});
	}
};

ko.bindingHandlers['swipeup'] = {
	'init': function (element, valueAccessor, allBindingsAccessor, viewModel)
	{
		$(element).on('swipeup', (e) =>
		{
			e.preventDefault();
			valueAccessor().call(viewModel, viewModel, e)
		});
	}
};

ko.bindingHandlers['swipedown'] = {
	'init': function (element, valueAccessor, allBindingsAccessor, viewModel)
	{
		$(element).on('swipedown', (e) =>
		{
			e.preventDefault();
			valueAccessor().call(viewModel, viewModel, e)
		});
	}
};

export class knocktouch
{
	public fool:number = 0;

	constructor()
	{
	}
}