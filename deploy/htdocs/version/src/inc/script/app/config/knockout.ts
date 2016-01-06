///<reference path="../../def/definitions.d.ts" />

define([
	'knockout',
	'vendor/knockout-punches/knockout.punches',
	'lib/knockout/knockout.gaia',
	'lib/knockout/stringTemplateEngine',
	'lib/knockout/knockout.component'
], (ko) =>
{
	ko.punches.interpolationMarkup.enable();
	ko.punches.attributeInterpolationMarkup.enable();
	ko.punches.textFilter.enableForBinding('text');
	ko.punches.textFilter.enableForBinding('foreach');

	// Custom filter can be used like "| append: 'xyz'"
	ko.filters['filter'] = (value, search) =>
	{
		return ko.unwrap(value).filter((element) =>
		{
			return ko.unwrap(element).indexOf(ko.unwrap(search)) != -1;
		});
	};

	// live binding
	ko.bindingHandlers['live'] = {
		preprocess: (value, name, addBindingsCallback) =>
		{
			addBindingsCallback('value', value);
			addBindingsCallback('valueUpdate', "['afterkeydown', 'keyup', 'input']");
		}
	};

	// allowBindings binding
	ko.bindingHandlers.allowBindings = {
		isBound: false,
		init: function(element, valueAccessor) {
			// Let bindings proceed as normal *only if* my value is false
			var shouldAllowBindings = ko.utils.unwrapObservable(valueAccessor());

			this.isBound = shouldAllowBindings;

			return { controlsDescendantBindings: !shouldAllowBindings };
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var shouldAllowBindings = ko.utils.unwrapObservable(valueAccessor());

			if (shouldAllowBindings && !this.isBound)
			{
				this.isBound = true;
				ko['applyBindingsToDescendants'](bindingContext, element);
			}
		}
	};
	ko.virtualElements.allowedBindings['allowBindings'] = true;


	// render <x-foobar data="baz"><x-foobar> as shortcut for <div data-bind=template: {name: 'foobar', data: baz }"></div>
	ko.punches.utils.setNodePreprocessor((node) =>
	{
		if (node.nodeType !== 1)
		{
			return;
		}

		var name = node.tagName.toLowerCase();
		if (name.substr(0, 2) == 'x-')
		{
			var templateName = name.substr(2);
			var data = $(node).attr('data');
			var template = $('#' + templateName)[0];

			if (template)
			{
				var $newNode = $('<div/>');
				$newNode.attr('data-bind', "template: {name: '" + templateName + "'" + (data ? ', data: ' + data : '') + '}');

				$(node).replaceWith($newNode);
			}
		}
	});


	// extending ko.punches for adding short-hand localizeText {{lt:text.to.be.localized}}
	var wrapExpresssion = ko.punches['interpolationMarkup']['wrapExpresssion'];

	ko.punches['interpolationMarkup']['wrapExpresssion'] = function(expressionText)
	{
		// test if string is compatible with short hand localizeText lt:text.to.be.localized
		if(/^lt:[\w\.]+/.test(expressionText)){

			expressionText = expressionText.replace(/^lt:/, '');

			return [
				document.createComment("ko localizedText: '" + expressionText + "'"),
				document.createComment("/ko")
			];
		} else {
			return wrapExpresssion(expressionText);
		}
	}
});

