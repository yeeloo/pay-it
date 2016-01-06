import HTMLElementManager from "./HTMLElementManager";
import ko = require('knockout');

/**
 * @module Temple
 * @namespace temple.locale.element
 * @extend temple.locale.element.AbstractElementManager
 * @class KOElementManager
 */
class KOElementManager extends HTMLElementManager
{
	static _instance:KOElementManager;

	/**
	 * @public
	 * @static
	 * @method getInstance
	 * @returns {KOElementManager}
	 */
	static getInstance():KOElementManager
	{
		if (typeof KOElementManager._instance === 'undefined')
		{
			KOElementManager._instance = new KOElementManager();
		}
		return KOElementManager._instance;
	}

	constructor()
	{
		super();
	}

	/**
	 * @public
	 * @method setText
	 * @param {any} data
	 * @param {string} text
	 */
	setText(data:any, text:string)
	{
		switch (data.attr)
		{
			case 'text':
			{
				ko.utils.setTextContent(data.element, text);
				break;
			}
			case 'html':
			{
				ko.utils.setHtml(data.element, text);
				break;
			}
			default:
			{
				super.setText(data, text);
				break;
			}
		}
	}
}

export default KOElementManager;