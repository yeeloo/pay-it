import IPageController from "lib/gaia/interface/IPageController";
import IPageViewModel from "lib/gaia/interface/IPageViewModel";
import IDestructible from "lib/temple/core/IDestructible";
import Destructible from "lib/temple/core/Destructible";

/**
 * AbstractPageViewModel
 *
 * @module Gaia
 * @namespace gaia.assets
 * @class AbstractPageViewModel
 * @extends temple.core.Destructible
 */
class AbstractPageViewModel extends Destructible implements IPageViewModel
{
	controller:IPageController;

	_subscriptions:Array<KnockoutSubscription> = [];
	_destructibles:Array<IDestructible> = [];


	constructor()
	{
        super();
	}

	public setController(value:IPageController):void
	{
		this.controller = value;
	}

	destruct():void
	{
		this.controller = null;

		if (this._subscriptions)
		{
			while (this._subscriptions.length)
			{
				this._subscriptions.shift().dispose();
			}
			this._subscriptions = null;
		}
		if (this._destructibles)
		{
			while (this._destructibles.length)
			{
				this._destructibles.shift().destruct();
			}
			this._destructibles = null;
		}

	}
}

export default AbstractPageViewModel;