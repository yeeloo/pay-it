import AbstractElementManager from "./AbstractElementManager";
import EaselTextData from "./data/EaselTextData";
import IEaselTextElement from "./data/IEaselTextElement";

/**
 * @module Temple
 * @namespace temple.locale.element
 * @extend temple.locale.element.AbstractElementManager
 * @class EaselTextManager
 */
class EaselTextManager extends AbstractElementManager
{
	private static _instance:EaselTextManager;

	/**
	 * @public
	 * @static
	 * @method getInstance
	 * @returns {EaselTextManager}
	 */
	public static getInstance():EaselTextManager
	{
		if(typeof EaselTextManager._instance === 'undefined')
		{
			EaselTextManager._instance = new EaselTextManager();
		}

		return EaselTextManager._instance;
	}

	/**
	 * @protected
	 */
	public _elements:EaselTextData[];

	constructor()
	{
		super();
	}

	/**
	 * @public
	 * @method add
	 * @param {createjs.Text} element
	 * @param {string} id
	 * @param {string} key
	 */
	public add(element:IEaselTextElement, id:string, key:string)
	{
		super.addElement(new EaselTextData(element, id, key));
	}

	/**
	 * @public
	 * @method updateElement
	 * @param {EaselTextData} data
	 */
	public updateElement(data:EaselTextData):void
	{
		var text = this._localeManager.getString(data.id);
		this.setText(data, text);
	}

	/**
	 * @public
	 * @method getDataForElement
	 * @param {createjs.Text} element
	 * @returns {EaselTextData}
	 */
	public getDataForElement(element:IEaselTextElement):EaselTextData
	{
		for(var i = 0; i < this._elements.length; i++)
		{
			if(this._elements[i].element == element)
			{
				return <EaselTextData> this._elements[i];
			}
		}

		return null;
	}

	/**
	 * @public
	 * @method replaceIdByKey
	 * @param {string} key
	 * @param {string} id
	 * @returns {boolean}
	 */
	public replaceIdByKey(key:string, id:string):boolean
	{
		var success = false;

		for(var i = 0; i < this._elements.length; i++)
		{
			if(this._elements[i].key == key)
			{
				this._elements[i].id = id;

				if(this._localeManager.isReady())
				{
					this.updateElement(this._elements[i]);
				}

				success = true;
			}
		}

		return success;
	}

	/**
	 * @todo This still needs a lot of work, there are major issues with the fact that we do not know how every specific
	 *  browser positions canvas text. There should be a matrix that caches and corrects the inconsistencies of every
	 *  browser. And a adjusts it accordingly.
	 *
	 * @public
	 * @method setText
	 * @param {EaselTextData} data
	 * @param {string} text
	 */
	public setText(data:EaselTextData, text:string)
	{
		data.element.text = text;
		//		var element = <createjs.Text> data.element;
		//		var bounds = element.getBounds();
		//		var tbounds = element.getTransformedBounds();
		//		var width = element.getMeasuredWidth();
		//		var height = element.getMeasuredHeight();
		//		height += element.getMeasuredLineHeight();
		//		width = element.getBounds().width;

		//		setTimeout(this._timeoutCache.bind(this, data.element, tbounds.width + 20, tbounds.height + 20), 200 );
		//		data.element.uncache();
	}

	/**
	 * @todo This still needs a lot of work, there are major issues with the fact that we do not know how every specific
	 * browser positions canvas text. There should be a matrix that caches and corrects the inconsistencies of every
	 * browser. And a adjusts it accordingly so every browser shows text in the same way.
	 *
	 * @private
	 * @method _timeoutCache
	 * @param {createjs.Text} element
	 * @param {number} width
	 * @param {number} height
	 */
	private _timeoutCache(element:IEaselTextElement, width:number, height:number):void
	{
		// "start", "end", "left", "right", and "center"

		switch(element.textAlign)
		{
			case 'start':
			{
				break;
			}
			case 'end':
			{
				break;
			}
			case 'left':
			{
				element.cache(0, 0, width, height);
				break;
			}
			case 'right':
			{
				element.cache(0, 0, width, height);
				break;
			}
			case 'center':
			{
				element.cache(-width / 2, 0, width, height);
				break;
			}
		}
	}
}

export default EaselTextManager;