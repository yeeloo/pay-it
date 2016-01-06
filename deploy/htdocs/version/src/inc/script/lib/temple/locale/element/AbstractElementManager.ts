import AbstractElementData from "./data/AbstractElementData";
import LocaleManager from "lib/temple/locale/LocaleManager";

import CommonEvent from "lib/temple/events/CommonEvent";

/**
 * @module Temple
 * @namespace temple.locale.element
 * @class AbstractElementManager
 */
class AbstractElementManager
{
	/**
	 * @protected
	 */
	public _localeManager:LocaleManager;

	/**
	 * @protected
	 */
	public _elements:Array<AbstractElementData>;

	constructor()
	{
		this._elements = [];
		this._localeManager = LocaleManager.getInstance();
		this._localeManager.addEventListener(CommonEvent.UPDATE, () =>
		{
			for (var i = 0; i < this._elements.length; i++)
			{
				this.updateElement(this._elements[i]);
			}
		});
	}

	/**
	 * @public
	 * @method addElement
	 * @param {AbstractElementData} data
	 */
	public addElement(data:AbstractElementData)
	{
		this._elements.push(data);

		if (this._localeManager.isReady())
		{
			this.updateElement(data);
		}
	}

	/**
	 * @public
	 * @method updateElement
	 * @param {AbstractElementData} data
	 */
	public updateElement(data:AbstractElementData):void
	{
	}

	/**
	 * @public
	 * @method getDataForElement
	 * @param {any} element
	 * @returns {AbstractElementData}
	 */
	public getDataForElement(element:any):AbstractElementData
	{
		for (var i = 0; i < this._elements.length; i++)
		{
			if (this._elements[i].element == element)
			{
				return this._elements[i];
			}
		}

		return null;
	}
}

export default AbstractElementManager;