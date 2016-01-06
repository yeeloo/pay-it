import Destructible from "../../core/Destructible";
import IRectangle from "../../geom/IRectangle";
import ThrottleDebounce from "../ThrottleDebounce";

/**
 * This is an enum for use in {{#crossLink "temple.utils.ui.ElementResizer"}}ElementResizer{{/crossLink}}
 * @namespace temple.utils.ui
 * @class ScaleMode
 * @enum
 */
export enum ScaleMode {
	/**
	 * Resizes the element to fill its bounds
	 * @property COVER
	 */
	COVER,
	/**
	 * Resizes the element to fit to its bounds
	 * @property CONTAIN
	 */
	CONTAIN,
	/**
	 * Only applies alignment, does not scale the rectangle
	 * @property ALIGN_ONLY
	 */
	ALIGN_ONLY
}

/**
 * An implementation of `background-size: cover/contain` in TypeScript.
 *
 * After initializing this class, run {{#crossLink "temple.utils.ui.ElementResizer/update"}}{{/crossLink}} to
 * resize the element based on its settings. It is also possible to have it auto-update on window resize by calling the
 * {{#crossLink "temple.utils.ui.ElementResizer/autoResize"}}{{/crossLink}} function after initializing.
 *
 * If you want to do a one-off resize, * use the static method
 * {{#crossLink "temple.utils.ui.ElementResizer/resize"}}ElementResizer.resize{{/crossLink}}, or if you just want to get
 * the x/y and width/height of an arbitrary rectangle, use
 * {{#crossLink "temple.utils.ui.ElementResizer/getRect"}}ElementResizer.getRect{{/crossLink}}, which returns an
 * IRectangle
 *
 * Updating any of the public properties will automatically resize the element
 *
 * @namespace temple.utils.ui
 * @extends temple.core.Destructible
 * @class ElementResizer
 * @author Stuart van Beek <stuart@mediamonks.com>
 * @constructor
 * @param _element {HTMLElement} The element to resize
 * @param _elementWidth {number} element width/x ratio, e.g. for a 100x200 element you can either pass 100 or 1 as width
 * @param _elementHeight {number} element height/y ratio, e.g. for a 100x200 element you can either pass 200 or 2 as height
 * @param [_sizingType=COVER] {temple.utils.ui.ScaleMode} Sizing type, defaults to COVER
 * @param [_boundsContainer] {HTMLElement} The container to fit/fill the element to, defaults to its parent
 * @param [_alignmentX=0.5] {number} X alignment of the resulting element, where 0 = left and 1 = right
 * @param [_alignmentY=0.5] {number} Y alignment of the resulting element, where 0 = top and 1 = bottom
 * @param [_maxWidth] {number} Maxmimum width of the element, respects the X alignment
 * @param [_maxHeight] {number} Maxmimum height of the element, respects the Y alignment
 *
 * @returns {temple.utils.ui.ElementResizer}
 */
export default class ElementResizer extends Destructible
{
	/**
	 * Resize an element once based on ratio, scalemode, alignment and max size. This method wraps
	 * {{#crossLink "temple.utils.ui.ElementResizer/getRect"}}ElementResizer.getRect{{/crossLink}}, but applies CSS to
	 * the element.
	 *
	 * @public
	 * @static
	 * @method resize
	 *
	 * @param element {HTMLElement} Element on which to apply the width/height left/right styles to.
	 * @param elementWidth {number} element width/x ratio, e.g. for a 100x200 element you can either pass 100 or 1 as width
	 * @param elementHeight {number} element height/y ratio, e.g. for a 100x200 element you can either pass 200 or 2 as height
	 * @param [scaleMode=COVER] {temple.utils.ui.ScaleMode} Scale mode (COVER or RESIZE)
	 * @param [boundsContainer] {HTMLElement} Container which it will respect the bounds of.
	 * @param [alignmentX=0.5] {number} X alignment of the resulting element, where 0 = left and 1 = right
	 * @param [alignmentY=0.5] {number} Y alignment of the resulting element, where 0 = top and 1 = bottom
	 * @param [maxWidth] {number} Maxmimum width of the element
	 * @param [maxHeight] {number} Maxmimum height of the element
	 *
	 * @returns {temple.geom.IRectangle}
	 */
	public static resize(element:HTMLElement,
	                     elementWidth:number,
	                     elementHeight:number,
	                     scaleMode:ScaleMode = ScaleMode.COVER,
	                     boundsContainer:HTMLElement = element.parentElement,
	                     alignmentX:number = 0.5,
	                     alignmentY:number = 0.5,
	                     maxWidth?:number,
	                     maxHeight?:number):IRectangle
	{
		if(boundsContainer.parentElement == void 0)
		{
			throw new Error('ElementResizer: element has no container, unable to calculate scaling');
		}

		// this method just wraps getRect, and creates an IRectangle for it using the bounds container element
		let rect = ElementResizer.getRect(
			elementWidth,
			elementHeight,
			scaleMode,
			{x: 0, y: 0, width: boundsContainer.clientWidth, height: boundsContainer.clientHeight},
			alignmentX,
			alignmentY,
			maxWidth,
			maxHeight
		);

		// and finally applies the result to the element
		element.style.top = `${rect.y.toString()}px`;
		element.style.left = `${rect.x.toString()}px`;
		element.style.width = `${rect.width.toString()}px`;
		element.style.height = `${rect.height.toString()}px`;

		return rect;
	}

	/**
	 * Resize an element once based on ratio, scalemode, alignment and max size.
	 *
	 * @public
	 * @static
	 * @method getRect
	 *
	 * @param elementWidth {number} element width/x ratio, e.g. for a 100x200 element you can either pass 100 or 1 as width
	 * @param elementHeight {number} element height/y ratio, e.g. for a 100x200 element you can either pass 200 or 2 as height
	 * @param [scaleMode=COVER] {temple.utils.ui.ScaleMode} Scale mode (COVER or RESIZE)
	 * @param [boundsContainer] {IRectangle} Container which it will respect the bounds of. x/y properties can be set to
	 * 0 since they are not used (the interface requires them)
	 * @param [alignmentX=0.5] {number} X alignment of the resulting rectangle, where 0 = left and 1 = right
	 * @param [alignmentY=0.5] {number} Y alignment of the resulting rectangle, where 0 = top and 1 = bottom
	 * @param [maxWidth] {number} Maxmimum width of the element, respects the X alignment
	 * @param [maxHeight] {number} Maxmimum height of the element, respects the Y alignment
	 *
	 * @returns {temple.geom.IRectangle}
	 */
	public static getRect(elementWidth:number,
	                      elementHeight:number,
	                      scaleMode:ScaleMode = ScaleMode.COVER,
	                      boundsContainer?:IRectangle,
	                      alignmentX:number = 0.5,
	                      alignmentY:number = 0.5,
	                      maxWidth?:number,
	                      maxHeight?:number):IRectangle
	{
		if(boundsContainer == void 0)
		{
			throw new Error('ElementResizer: no bounds container supplied, unable to calculate scaling');
		}

		let targetWidth;
		let targetHeight;

		// get needed scale to fit in bounds with cover
		if (scaleMode == ScaleMode.CONTAIN || scaleMode == ScaleMode.COVER)
		{
			var boundRatioX = boundsContainer.width / elementWidth;
			var boundRatioY = boundsContainer.height / elementHeight;
			var scale = 1;
		}


		// get scale for bounds container
		switch(scaleMode)
		{
			case ScaleMode.CONTAIN:
			{
				scale = boundRatioX < boundRatioY ? boundRatioX : boundRatioY;
				break;
			}

			case ScaleMode.COVER:
			{
				scale = boundRatioX > boundRatioY ? boundRatioX : boundRatioY;
				break;
			}

			case ScaleMode.ALIGN_ONLY:
			{
				targetWidth = elementWidth;
				targetHeight = elementHeight;
				break;
			}

			default:
			{
				throw new Error('ElementResizer: invalid ScaleMode');
			}
		}

		if (scaleMode == ScaleMode.CONTAIN || scaleMode == ScaleMode.COVER)
		{
			// get needed scale to fit in max with contain
			if (maxWidth || maxHeight)
			{
				let scaleMaxRatioX = scale;
				let scaleMaxRatioY = scale;
				if (maxWidth)
				{
					scaleMaxRatioX = maxWidth / elementWidth;
				}
				if (maxHeight)
				{
					scaleMaxRatioY = maxHeight / elementHeight;
				}
				let scaleMax = scaleMaxRatioX < scaleMaxRatioY ? scaleMaxRatioX : scaleMaxRatioY;
				scale = Math.min(scale, scaleMax);
			}

			// do the actual scale
			targetWidth = elementWidth * scale;
			targetHeight = elementHeight * scale;
		}

		// and do alignment
		return {
			width: targetWidth,
			height: targetHeight,
			x: (boundsContainer.width - targetWidth) * alignmentX,
			y: (boundsContainer.height - targetHeight) * alignmentY
		};
	}

	private _handleResize:(event:UIEvent) => void;

	/**
	 * @public
	 * @property width {number}
	 */
	public set width(value:number)
	{
		this._elementWidth = value;
		this.update();
	}

	public get width():number
	{
		return this._elementWidth;
	}

	/**
	 * @public
	 * @property height {number}
	 */
	public set height(value:number)
	{
		this._elementHeight = value;
		this.update();
	}

	public get height():number
	{
		return this._elementHeight;
	}

	/**
	 * @public
	 * @property scaleMode {temple.utils.ui.ScaleMode}
	 */
	public set scaleMode(value:ScaleMode)
	{
		this._scaleMode = value;
		this.update();
	}

	public get scaleMode():ScaleMode
	{
		return this._scaleMode;
	}

	/**
	 * @public
	 * @property boundsContainer {HTMLElement}
	 */
	public set boundsContainer(value:HTMLElement)
	{
		if(value == void 0)
		{
			value = this._element.parentElement;
		}

		this._boundsContainer = value;

		this.update();
	}

	public get boundsContainer():HTMLElement
	{
		return this._boundsContainer;
	}

	/**
	 * @public
	 * @property alignmentX {number}
	 */
	public set alignmentX(value:number)
	{
		this._alignmentX = value;

		this.update();
	}

	public get alignmentX():number
	{
		return this._alignmentX;
	}

	/**
	 * @public
	 * @property alignmentY {number}
	 */
	public set alignmentY(value:number)
	{
		this._alignmentY = value;

		this.update();
	}

	public get alignmentY():number
	{
		return this._alignmentY;
	}

	/**
	 * @public
	 * @property maxWidth {number}
	 */
	public set maxWidth(value:number)
	{
		this._maxWidth = value;

		this.update();
	}

	public get maxWidth():number
	{
		return this._maxWidth;
	}

	/**
	 * @public
	 * @property maxHeight {number}
	 */
	public set maxHeight(value:number)
	{
		this._maxHeight = value;

		this.update();
	}

	public get maxHeight():number
	{
		return this._maxHeight;
	}

	constructor(private _element:HTMLElement,
	            private _elementWidth:number,
	            private _elementHeight:number,
	            private _scaleMode:ScaleMode = ScaleMode.COVER,
	            private _boundsContainer:HTMLElement = void 0,
	            private _alignmentX:number = 0.5,
	            private _alignmentY:number = 0.5,
	            private _maxWidth?:number,
	            private _maxHeight?:number)
	{
		super();

		if(this._boundsContainer == void 0)
		{
			if(this._element.parentElement == void 0)
			{
				throw new Error('ElementResizer: element has no container, unable to calculate scaling');
			}

			this._boundsContainer = this._element.parentElement;
		}
	}

	/**
	 * Resize the element based on its registered settings. This method is also called on window resize.
	 *
	 * @public
	 * @method update
	 */
	public update():void
	{
		ElementResizer.resize(
			this._element,
			this._elementWidth,
			this._elementHeight,
			this._scaleMode,
			this._boundsContainer,
			this._alignmentX,
			this._alignmentY,
			this._maxWidth,
			this._maxHeight);
	}

	/**
	 * Enables updating on window resize. Applies a debounce to the event listener, of which the duration can be
	 * configured.
	 *
	 * @public
	 * @method autoResize
	 * @param debounce {number=100} debounce duration in milliseconds
	 */
	public autoResize(debounce:number = 100):void
	{
		if(this._handleResize != void 0)
		{
			window.removeEventListener('resize', this._handleResize);
		}

		if(debounce == void 0 || debounce == 0)
		{
			// register listener without debounce
			this._handleResize = (event:UIEvent) => this.handleResize(event);
		}
		else
		{
			this._handleResize = ThrottleDebounce.debounce(this.handleResize, debounce, this);
		}

		window.addEventListener('resize', this._handleResize);
	}

	/**
	 * Event listener for window.onresize
	 *
	 * @private
	 * @method handleResize
	 * @param event {UIEvent}
	 */
	private handleResize(event:UIEvent):void
	{
		this.update();
	}

	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		if (this._handleResize != void 0)
		{
			window.removeEventListener('resize', this._handleResize);
			this._handleResize = void 0;
		}

		super.destruct();
	}
}