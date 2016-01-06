import refdef from "def/ReferenceDefinitions";

import CommonEvent from "lib/temple/events/CommonEvent";
import ITextFormatter from "./formatter/ITextFormatter";

import KOElementManager from "./element/KOElementManager";
import HTMLElementData from "./element/data/HTMLElementData";

import ImageElementManager from "./element/ImageElementManager";
import BackgroundImageElementManager from "./element/BackgroundImageElementManager";
import ImageElementData from "./element/data/ImageElementData";

import LowerCaseFormatter from "./formatter/LowerCaseFormatter";
import UpperCaseFormatter from "./formatter/UpperCaseFormatter";
import MaxCharsFormatter from "./formatter/MaxCharsFormatter";
import ReplaceFormatter from "./formatter/ReplaceFormatter";
import PluralFormatter from "./formatter/PluralFormatter";
import CustomFormatter from "./formatter/CustomFormatter";

import ko = require('knockout');

/**
 * Regexp to fetch translation-id's and their value
 *
 *     <([^\s]+).*data-bind=".*localizedText:\s*(["']?)([a-zA-Z0-9_-]+)\2\s*".*>(.*)</\1>
 *
 * group 3 or group 5 = ID
 * group 6 = original value
 *
 *     <([^\s]+)[^>]*data-bind="[^"]*localizedText:\s*(?:(["']?)([a-zA-Z0-9_-]+)\2|[^"]*id:\s*(["']?)([a-zA-Z0-9_-]+)\4)[^"]*"[^>]*>(.*?)</\1>
 *
 *     <([^\s]+)[^>]*
 *         data-bind="[^"]*
 *             localizedText:\s*(?:
 *                 (["']?)([a-zA-Z0-9_-]+)\2 |
 *                 [^"]*id:\s*(["']?)([a-zA-Z0-9_-]+)\4
 *             )
 *         [^"]*"
 *     [^>]*>(.*?)</\1>
 *
 * @module Temple
 * @namespace temple.locale
 * @class LocaleKnockoutBinding
 */
class LocaleKnockoutBinding
{
	constructor()
	{
		ko.bindingHandlers.localizedText = {
			init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
			{
				this._formatterString = '';

				// sets up the config object
				this.getConfig = function (va):any[]
				{
					var config:any = ko.utils.unwrapObservable(va());

					if (typeof config === 'string')
					{
						config = [
							{
								'id': config
							}
						]
					}

					if (!(config instanceof Array))
					{
						config = [
							config
						];
					}

					return config;
				};

				// gets and checks the HTML propertiy
				this.getAttr = function (el, config:{html:KnockoutObservable<any>; attr:KnockoutObservable<string>;} ):string
				{
					var attr:any = 'text';

					if ((ko.utils.unwrapObservable(config.html) == true
						|| ko.utils.unwrapObservable(config.attr) == 'html')
						&& el.nodeType == 8)
					{
//						console.error('html is not supported in virtual elements: ', el);
						return 'text';
					}

					if (config.hasOwnProperty('attr'))
					{
						attr = ko.utils.unwrapObservable(config.attr);
					}
					else if (config.hasOwnProperty('html'))
					{
						attr = ko.utils.unwrapObservable(config.html);
					}

					if (typeof attr == 'boolean')
					{
						attr = attr ? 'html' : 'text';
					}

					return attr;
				};

				// constructs formatters based on config
				this.getFormatters = function (config):Array<ITextFormatter>
				{
					if (typeof config.formatters !== 'undefined')
					{
						var formatters = [];

						for (var i = 0; i < config.formatters.length; i++)
						{
							var formatter = config.formatters[i];

							var options:any = ko.utils.unwrapObservable(formatter.options);

							if (typeof options == 'object')
							{
								options = ko.toJS(formatter.options);
							}

							switch (formatter.name)
							{
								case 'lowercase':
								{
									formatters.push(new LowerCaseFormatter());
									break;
								}
								case 'uppercase':
								{
									formatters.push(new UpperCaseFormatter());
									break;
								}
								case 'maxchars':
								{
									formatters.push(new MaxCharsFormatter(options.maxChars, options.readMoreChars, options.splitOnWord));
									break;
								}
								case 'replace':
								{
									formatters.push(new ReplaceFormatter(options.replacements));
									break;
								}
								case 'plural':
								{
									formatters.push(new PluralFormatter(options.replacements));
									break;
								}
								case 'custom':
								{
									formatters.push(new CustomFormatter(options.func));
									break;
								}
							}
						}

						return formatters;
					}
					else
					{
						return [];
					}
				};

				var configs = this.getConfig(valueAccessor);

				for (var i = 0; i < configs.length; i++)
				{
					var config = configs[i];
					var attr = this.getAttr(element, config);

					KOElementManager.getInstance().add(element, <string> ko.utils.unwrapObservable(config.id), attr, []);
				}


				return { controlsDescendantBindings: true };
			},

			update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
			{
				var configs = this.getConfig(valueAccessor);

				for (var i = 0; i < configs.length; i++)
				{
					var config = configs[i];
					var attr = this.getAttr(element, config);

					var data = KOElementManager.getInstance().getDataForElement(element, attr);

					if (data)
					{
						data.id = <string> ko.utils.unwrapObservable(config.id);
						data.attr = attr;
						data.formatters = this.getFormatters(config);

						KOElementManager.getInstance().updateElement(data);
					}
				}
			}
		};

		ko.virtualElements.allowedBindings['localizedText'] = true;

		ko.bindingHandlers.localizedImage = {
			init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
			{
				var value = ko.utils.unwrapObservable(valueAccessor());
				if (typeof value === 'string')
				{
					ImageElementManager.getInstance().add(element, <string> value);
				}
				else
				{
					ImageElementManager.getInstance().add(element);
				}

				return { controlsDescendantBindings: true };
			},

			update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
			{
				var data = <ImageElementData>ImageElementManager.getInstance().getDataForElement(element);

				ImageElementManager.getInstance().updateElement(data);
			}
		};

		ko.bindingHandlers.localizedBgImage = {
			init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
			{
				var value = ko.utils.unwrapObservable(valueAccessor());
				if (typeof value === 'string')
				{
					BackgroundImageElementManager.getInstance().add(element, <string> value);
				}
				else
				{
					BackgroundImageElementManager.getInstance().add(element);
				}

				return { controlsDescendantBindings: true };
			},

			update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
			{
				var data = <ImageElementData>BackgroundImageElementManager.getInstance().getDataForElement(element);

				BackgroundImageElementManager.getInstance().updateElement(data);
			}
		};
	}
}

export default LocaleKnockoutBinding;