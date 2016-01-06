import refdef from "def/ReferenceDefinitions";
import ko = require('knockout');
import * as Gaia from "lib/gaia/api/Gaia";
import BranchTools from "lib/gaia/core/BranchTools";
import Log from "../temple/utils/Log";

class KnockoutGaiaGoto
{
	static documentBase:string = $('meta[name="document-base"]').attr('content');

	static init(element, valueAccessor:() => any, allBindings, vm, bindingContext):any
	{
		/**
		 * Value should be:
		 * - a string with the base branch, or
		 * - an array with the 2 parameters for Gaia.api.goto [branch: string, deeplink: object]
		 */
		var value = valueAccessor();
		var $element = $(element);
		var branch = '';
		var deeplink:any = {};

		if (typeof value === 'string')
		{
			branch = BranchTools.getValidBranch(value);
			deeplink = {};

			if (branch.length < value.length)
			{
				Log.error('Temple.Knockout.GaiaGoto', 'string syntax with deeplink is not supported anymore for "' + value + '", use [branch, {}]');
			}
		}
		else
		{
			branch = value[0];
			deeplink = value[1];
		}

		var route = Gaia.router.assemble(branch, deeplink) || '/';

		$element.attr('href', KnockoutGaiaGoto.documentBase + route.substr(1));

		$(element).on('click', (event:JQueryEventObject) =>
		{
			event.preventDefault();

			if (typeof value === 'string')
			{
				Gaia.api.goto(BranchTools.getValidBranch(value));
			}
			else
			{
				Gaia.api.goto(value[0], value[1]);
			}

		});

		return {};
	}
}

ko.bindingHandlers['gaiaGoto'] = KnockoutGaiaGoto;
ko.virtualElements.allowedBindings['gaiaGoto'] = true;


class KnockoutGaiaGotoRoute
{
	static documentBase:string = $('meta[name="document-base"]').attr('content');

	static init(element, valueAccessor:() => any, allBindings, vm, bindingContext):any
	{
		/**
		 * Value should be:
		 * - a valid route string
		 */
		var value = valueAccessor();
		var $element = $(element);

		$element.attr('href', KnockoutGaiaGotoRoute.documentBase + (value.charAt(0) == '/' ? value.substr(1) : value));

		$(element).on('click', (event:JQueryEventObject) =>
		{
			event.preventDefault();

			// todo
			Gaia.api.gotoRoute(value);
		});

		return {};
	}
}

ko.bindingHandlers['gaiaGotoRoute'] = KnockoutGaiaGotoRoute;
ko.virtualElements.allowedBindings['gaiaGotoRoute'] = true;


class KnockoutGaiaPopup
{
	static documentBase:string = $('meta[name="document-base"]').attr('content');

	static init(element, valueAccessor:() => any, allBindings, vm, bindingContext):any
	{
		/**
		 * Value should be:
		 * - a string with the popupId, or
		 * - an array with the 2 parameters for Gaia.api.gotoPopup [popupId: string, deeplink: object]
		 */
		var value = valueAccessor();
		var $element = $(element);
		var branch = '';
		var deeplink:any = {};

		if (typeof value === 'string')
		{
			branch = BranchTools.getPopupBranch(value, Gaia.api.getCurrentBranch());
			deeplink = {};

			if (branch.length < value.length)
			{
				Log.error('Temple.Knockout.GaiaPopup', 'string syntax with deeplink is not supported anymore for "' + value + '", use [branch, {}]');
			}
		}
		else
		{
			branch = BranchTools.getPopupBranch(value[0], Gaia.api.getCurrentBranch());
			deeplink = value[1];
		}

		var route = Gaia.router.assemble(branch, deeplink) || '/';


		$element.attr('href', KnockoutGaiaPopup.documentBase + route.substr(1));

		$(element).on('click', (event:JQueryEventObject) =>
		{
			event.preventDefault();

			if (typeof value === 'string')
			{
				Gaia.api.gotoPopup(value);
			}
			else
			{
				Gaia.api.gotoPopup(value[0], value[1]);
			}
		});

		return {};
	}
}

ko.bindingHandlers['gaiaPopup'] = KnockoutGaiaPopup;
ko.virtualElements.allowedBindings['gaiaPopup'] = true;