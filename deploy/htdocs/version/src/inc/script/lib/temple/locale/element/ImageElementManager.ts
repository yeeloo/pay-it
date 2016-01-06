import AbstractElementManager from "./AbstractElementManager";
import ImageElementData from "./data/ImageElementData";
import Log from "../../utils/Log";

let _log:Log = new Log('lib.temple.locale.element.ImageElementManager');

/**
 * @module Temple
 * @namespace temple.locale.element
 * @extend temple.locale.element.AbstractElementManager
 * @class ImageElementManager
 */
class ImageElementManager extends AbstractElementManager
{
	static _instance:ImageElementManager;

	/**
	 * @public
	 * @static
	 * @method getInstance
	 * @returns {ImageElementManager}
	 */
	static getInstance():ImageElementManager
	{
		if (typeof ImageElementManager._instance === 'undefined')
		{
			ImageElementManager._instance = new ImageElementManager();
		}
		return ImageElementManager._instance;
	}

	constructor()
	{
		super();
	}

	/**
	 * @public
	 * @method add
	 * @param {HTMLElement} element
	 * @param {string} url
	 */
	public add(element:HTMLElement, url:string = null)
	{
		if (!element || typeof element === 'undefined')
		{
			_log.error('no element ', element);
			return;
		}

		if (!url)
		{
			var src = $(element).attr('src');

			if (src)
			{
				url = src.replace(/\/([a-z]{2}_[A-Z]{2})\//gi, '/{locale}/');
			}
		}

		if (!element || typeof element === 'undefined')
		{
			_log.error('missing url', element);
			return;
		}

		_log.log('>>> URL: ', url);

		super.addElement(new ImageElementData(element, url));
	}

	/**
	 * @public
	 * @method updateElement
	 * @param {ImageElementData} data
	 */
	public updateElement(data:ImageElementData):void
	{
		$(data.element).attr('src', data.url.replace('{locale}', this._localeManager.getLocale()));
	}
}

export default ImageElementManager;