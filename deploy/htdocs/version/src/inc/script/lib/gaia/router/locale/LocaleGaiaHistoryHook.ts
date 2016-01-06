import * as Gaia from "../../api/Gaia";
import LocaleManager from "../../../temple/locale/LocaleManager";
import GaiaHistoryEvent from "../../events/GaiaHistoryEvent";

import CommonEvent from "lib/temple/events/CommonEvent";

/**
 * @module Temple
 * @namespace gaia.router.locale
 * @class LocaleGaiaHistoryHook
 */
class LocaleGaiaHistoryHook
{
	_internal:boolean;

	constructor()
	{
		Gaia.history.addEventListener(GaiaHistoryEvent.DEEPLINK, () =>
		{
			//if (DEBUG) console.log('GHH > on GaiaHistory change: ', Gaia.router.getLocale());
			this._internal = true;
			LocaleManager.getInstance().setLocale(Gaia.router.getLocale());
			this._internal = false;
		});

		LocaleManager.getInstance().setLocale(Gaia.router.getLocale());

		LocaleManager.getInstance().addEventListener(CommonEvent.CHANGE, () =>
		{
			if(!this._internal)
			{
				Gaia.router.setLocale(LocaleManager.getInstance().getLocale());
			}
		});
	}
}

export default LocaleGaiaHistoryHook;