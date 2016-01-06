import refdef from 'def/ReferenceDefinitions';
import Deeplink from './Deeplink';
import * as Gaia from 'lib/gaia/api/Gaia';
import GaiaEvent from 'lib/gaia/events/GaiaEvent';
import SiteController from 'lib/gaia/core/SiteController';

class PopupQueue
{
	private _queue:Array<{popupId:string; deeplink?:Deeplink}> = [];

	constructor()
	{
		Gaia.api.afterComplete(this.handleAfterComplete);
	}

	public add(popupId:string, deeplink?:Deeplink):void
	{
		this._queue.push({popupId: popupId, deeplink: deeplink});
		this.tryGotoPopup();
	}

	private handleAfterComplete = (event:GaiaEvent) =>
	{
		this.tryGotoPopup();
	}

	private tryGotoPopup():void
	{
		// Do we have a queue and are we currently not transitioning or loading?
		if (this._queue.length && !SiteController.isBusy())
		{
			// Does our current page has this popup
			if (Gaia.api.getPage(Gaia.api.getCurrentBranch()).pages.hasOwnProperty(this._queue[0].popupId))
			{
				Gaia.api.gotoPopup(this._queue[0].popupId, this._queue.shift().deeplink);
			}
		}

	}
}

export default PopupQueue;