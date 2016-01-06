import refdef from "def/ReferenceDefinitions";

import * as Gaia from "../api/Gaia";
import SiteModel from "../core/SiteModel";
import SiteController from "../core/SiteController";
import SiteView from "../core/SiteView";
import GaiaHQ from "../core/GaiaHQ";
import ISitemap from "../interface/ISitemap";
import GaiaEvent from "../events/GaiaEvent";
import GaiaHistoryEvent from "../events/GaiaHistoryEvent";
import PageEvent from "../events/PageEvent";

import BaseEvent from "lib/temple/events/BaseEvent";
import * as utils from "lib/temple/utils/Utils";
import * as ga from "app/util/Analytics";

window['Gaia'] = Gaia;

/**
 * @module Gaia
 * @namespace gaia.core
 * @class GaiaMain
 */
export default class GaiaMain
{
	_model:SiteModel;
	_controller:SiteController;

	/**
	 * @method startGaia
	 * @param {?} siteConfig
	 * @return {void}
	 */
	public startGaia(sitemap:ISitemap):void
	{
		this._model = new SiteModel();
		this._model.load(sitemap);

		this._controller = new SiteController(new SiteView());

		GaiaHQ.birth();

		var gaiaHQ:GaiaHQ = GaiaHQ.getInstance();

		// lower prio than GaiaHistory listener
		gaiaHQ.addEventListener(GaiaEvent.GOTO, <(event:BaseEvent) => any>this._controller.onGoto.bind(this._controller));
		gaiaHQ.addEventListener(GaiaHQ.TRANSITION_OUT, <(event:BaseEvent) => any>this._controller.onTransitionOut.bind(this._controller));
		gaiaHQ.addEventListener(GaiaHQ.TRANSITION_IN, <(event:BaseEvent) => any>this._controller.onTransitionIn.bind(this._controller));
		gaiaHQ.addEventListener(GaiaHQ.TRANSITION, <(event:BaseEvent) => any>this._controller.onTransition.bind(this._controller));
		gaiaHQ.addEventListener(GaiaHQ.PRELOAD, <(event:BaseEvent) => any>this._controller.onPreload.bind(this._controller));
		gaiaHQ.addEventListener(GaiaHQ.COMPLETE, <(event:BaseEvent) => any>this._controller.onComplete.bind(this._controller));

		this._controller.addEventListener(PageEvent.BEFORE_INIT, <any>gaiaHQ.dispatchEvent.bind(gaiaHQ));

		this.onInit();
	}

	public onInit():void
	{
		ga.enableGaiaTracking(Gaia.api, Gaia.router);

		var hq = GaiaHQ.getInstance();

		// higher prio than own HQ listener
		hq.addEventListener(GaiaEvent.GOTO, <(event:BaseEvent) => any>Gaia.history.onGoto.bind(Gaia.history), 1);
		Gaia.history.addEventListener(GaiaHistoryEvent.GOTO, <(event:BaseEvent) => any>hq.onGoto.bind(hq));

		Gaia.router.start();


		// gaia-goto bindings
		$('body')
//      .on('click', '[data-gaia-goto]', (event:JQueryEventObject) =>
//		{
//			event.preventDefault();
//
//			var target = $(event.currentTarget);
//			var value:string = target.attr('data-gaia-goto') || target.attr('href');
//
//			if (value.length > 0)
//			{
//				Gaia.api.goto(value);
//			}
//		})
//		.on('click', '[data-gaia-goto-route]', (event:JQueryEventObject) =>
//		{
//			event.preventDefault();
//
//			var target = $(event.currentTarget);
//			var value:string = target.attr('data-gaia-route') || target.attr('href');
//
//			if (value.length > 0)
//			{
//				Gaia.api.gotoRoute(value);
//			}
//		})
//		.on('click', '[data-gaia-popup]', (event:JQueryEventObject) =>
//		{
//			event.preventDefault();
//
//			var target = $(event.currentTarget);
//			var value:string = target.attr('data-gaia-popup') || target.attr('href');
//
//			if (value.length > 0)
//			{
//				Gaia.api.gotoPopup(value);
//			}
//		})
		.on('tap', '[data-gaia-popup-close]', (event:JQueryEventObject) =>
		{
			// close popups

			event.preventDefault();

			Gaia.api.closePopup();
		})
		.on('tap', 'a[href]', (event:JQueryEventObject) =>
		{
			// check for internal links and pass them to Gaia

			var target = $(event.currentTarget);

			// check requirements:
			// - check for self target
			// - check for other gaia actions
			// - check for url-match
			if (
				(!target.attr('target') || target.attr('target') == '_self') &&
				!target.attr('data-gaia-goto') &&
				!target.attr('data-gaia-popup') &&
				!target.attr('data-gaia-goto-route') &&
				!target.attr('data-gaia-popup-close') &&
				target.attr('href').indexOf($('meta[name="document-base"]').attr('content')) != -1)
			{
				event.preventDefault();

				// get route from URL
				var fullRoute = (target.attr('href').match(new RegExp($('meta[name="document-base"]').attr('content') + '(.*)', 'i')))[1];

				// todo
//				Gaia.api.gotoRoute(fullRoute);
			}
		});
	}
}