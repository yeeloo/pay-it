import AbstractElementManager from "./AbstractElementManager";
import HTMLElementData from "./data/HTMLElementData";
import ITextFormatter from "../formatter/ITextFormatter";
import Log from "../../utils/Log";

/**
 * @module Temple
 * @namespace temple.locale.element
 * @extend temple.locale.element.AbstractElementManager
 * @class HTMLElementManager
 */
class HTMLElementManager extends AbstractElementManager
{
	static _instance:HTMLElementManager;

	/**
	 * @public
	 * @static
	 * @method getInstance
	 * @returns {HTMLElementManager}
	 */
	static getInstance():HTMLElementManager
	{
		if(typeof HTMLElementManager._instance === 'undefined')
		{
			HTMLElementManager._instance = new HTMLElementManager();
		}
		return HTMLElementManager._instance;
	}

	constructor()
	{
		super();
	}

	/**
	 * @public
	 * @method add
	 * @param {HTMLElement} element
	 * @param {string} id
	 * @param {boolean} html
	 * @param {ITextFormatters[]} formatters
	 */
	public add(element:HTMLElement, id:string, html:boolean, formatters:Array<ITextFormatter>);

	/**
	 * @public
	 * @method add
	 * @param {HTMLElement} element
	 * @param {string} id
	 * @param {boolean} attr
	 * @param {ITextFormatters[]} formatters
	 */
	public add(element:HTMLElement, id:string, attr:string, formatters:Array<ITextFormatter>);


	/**
	 * @public
	 * @method add
	 * @param {HTMLElement} element
	 * @param {string} id
	 * @param {any} attr
	 * @param {ITextFormatters[]} formatters
	 */
	public add(element:HTMLElement, id:string, attr:any = 'text', formatters:Array<ITextFormatter> = [])
	{
		if(!element || typeof element === 'undefined')
		{
			Log.log('Temple.Locale.Element.HTMLElementManager', 'no element ', element);
			return;
		}

		if(typeof attr === 'boolean')
		{
			attr = attr ? 'html' : 'text';
		}

		super.addElement(new HTMLElementData(element, id, attr, formatters));
	}

	/**
	 * @public
	 * @method getDataForElement
	 * @param {any} element
	 * @param {string} attr
	 * @returns {HTMLElementData}
	 */
	public getDataForElement(element:any, attr:string = null):HTMLElementData
	{
		if(!attr)
		{
			return <HTMLElementData>super.getDataForElement(element);
		}

		for(var i = 0; i < this._elements.length; i++)
		{
			if(this._elements[i].element == element && (<HTMLElementData>this._elements[i]).attr == attr)
			{
				return <HTMLElementData>this._elements[i];
			}
		}

		// fallback
		return <HTMLElementData>super.getDataForElement(element);
	}

	/**
	 * @public
	 * @method updateElement
	 * @param {HTMLElementData} data
	 */
	public updateElement(data:HTMLElementData):void
	{
		var text = this._localeManager.getString(data.id);

		for(var i = 0; i < data.formatters.length; i++)
		{
			text = data.formatters[i].format(text);
		}

		this.setText(data, text);
	}

	/**
	 * @public
	 * @method setText
	 * @param {any} data
	 * @param {string} text
	 */
	public setText(data:any, text:string)
	{
		switch(data.attr)
		{
			case 'text':
			{
				$(data.element).text(text);
				break;
			}
			case 'html':
			{
				$(data.element).html(text);
				break;
			}
			default:
			{
				$(data.element).attr(data.attr, text);
				break;
			}
		}
	}
}

export default HTMLElementManager;