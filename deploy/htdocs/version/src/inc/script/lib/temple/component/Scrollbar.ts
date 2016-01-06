import refdef from "def/ReferenceDefinitions";

import Destructible from "lib/temple/core/Destructible";

/**
 * @class Scrollbar
 * @extend temple.core.Destructible
 */
export class Scrollbar extends Destructible
{

	static COUNT:number = 0;
	static TOUCHSUPPORT:boolean = (typeof(window['ontouchstart']) !== 'undefined') ? true : false;

	// Elements
	$content:JQuery;
	$bar:JQuery;
	$knob:JQuery;

	mouse:any;

	_barEnabled:boolean = true;
	_barHover:boolean;
	_barVisible:boolean = true;

	_hideTimer:number;

	_knobPos:number = 0;
	_knobDown:boolean;
	_mousePos:number;
	_roundStep:number = 0;

	hideScrollbar:boolean = true;

	/**
	 * @class Scrollbar
	 * @constructor
	 * @param {JQuery} $element
	 */
	constructor(public $element:JQuery)
	{
		super();

		this.$content = this.$element.find('.scroll-content');
		this.$bar = this.$element.find('.scroll-bar').last();
		this.$knob = this.$element.find('.scroll-bar .knob').last();

		this.mouse = {
			down: 'touchstart mousedown',
			up: 'touchend mouseup',
			move: 'touchmove mousemove'
		};

//		this.$bar.o

		this.hideScrollbar = this.$content.hasClass('show-scrollbar') ? false : true;

		this.$element.data('scrollbar', this);

		this.addEvents();
	}

	/**
	 * adds default events to elements
	 *
	 * @method addEvents
	 */
	public addEvents()
	{
		$(window).on('resize.' + this.eventNamespace, () =>
		{
			this.update();
			this.onScroll();
		});

		this.$content.on('scroll.' + this.eventNamespace, () =>
		{
			this.showKnob();
			this.onScroll();
			this.startHideTimer();
		});

		this.$content.on('mouseup.' + this.eventNamespace, () =>
		{
			this.$element.scrollLeft(0);
		});

		this.$bar.on('mouseenter.' + this.eventNamespace, () =>
		{
			this._barHover = true;
			this.showKnob();
			this.clearTimer();
		});


		this.$bar.on(<string> 'mouseleave.' + this.eventNamespace, (event:JQueryMouseEventObject) =>
		{
			this._barHover = false;
			this.startHideTimer();
		});

		this.$bar.on('mousedown.' + this.eventNamespace, (event:JQueryMouseEventObject) =>
		{
			event.preventDefault();
		});

		this.$bar.on('click.' + this.eventNamespace, (event:JQueryMouseEventObject) =>
		{
			event.preventDefault();
			this.onBarClick(event);
		});

		this.$knob.on(this.mouse.down + '.' + this.eventNamespace, (event:JQueryMouseEventObject) =>
		{
			event.preventDefault();

			let originalEvent = <TouchEvent> event['originalEvent'];

			this._knobDown = true;
			this._mousePos = originalEvent.touches ? originalEvent.touches[0].pageY : event.pageY;
			this._roundStep = this._knobPos;

			$(document).on(this.mouse.move + '.' + this.eventNamespace, <any> this.onMouseMove.bind(this));
			$(document).on(this.mouse.up + '.' + this.eventNamespace, (event:JQueryMouseEventObject) =>
			{
				if (this._knobDown)
				{
					if (!Scrollbar.TOUCHSUPPORT)
					{
						this.onMouseMove(event);
					}

					this._knobDown = false;
					this._mousePos = null;
					this._knobPos = parseInt(this.$knob.css('top').replace('px', ''));

					$(document).off(this.mouse.up + '.' + this.eventNamespace);
					$(document).off(this.mouse.move + '.' + this.eventNamespace);

					this.startHideTimer();
				}
			});
		});

		$(window).on('mouseleave.' + this.eventNamespace, () =>
		{
			this.$element.scrollLeft(0);
		});

		this.update();

		this._barVisible = false;
		TweenLite.to(this.$bar[0], 0, { css: { 'opacity': 0 }});
	}

	/**
	 * @method checkHeight
	 * @return void
	 */
	public checkHeight():void
	{
		if (this.$content[0].scrollHeight <= this.$element.height())
		{
			this._barEnabled = false;
			this.$bar.addClass('hide');
			this.hideKnob();
		}
		else
		{
			this._barEnabled = true;
			this.$bar.removeClass('hide');
		}
	}

	/**
	 * @method resizeKnob
	 * @return void
	 */
	public update():void
	{
		this.checkHeight();
		this.resizeKnob();
		this.onScroll();

		if (this.$content.hasClass('show-scrollbar') && this._barEnabled)
		{
			TweenLite.to(this.$bar[0], .35, { css: { 'opacity': 1 }});
		}
	}

	/**
	 * @method resizeKnob
	 * @return void
	 */
	public onMouseMove(event):void
	{
		if (this._knobDown)
		{
			var pageCoord = event.originalEvent['touches'] ? event.originalEvent['touches'][0].pageY : event.pageY,
				max:number = this.$bar.height() - this.$knob.height(),
				maxScroll:number = this.$content[0].scrollHeight - this.$element.height(),
				newPosition:number = Math.min(max, Math.max(0, this._knobPos + (pageCoord - this._mousePos)));

			this.$knob.css({ 'top': newPosition });

			if (newPosition != this._knobPos)
			{
				//this._lastPos = newPosition;
				var restBarHeight:number = this.$bar.height() - this.$knob.height(),
					percentage:number = (newPosition / restBarHeight);

				this.$content.scrollTop((this.$content[0].scrollHeight - this.$element.height()) * percentage);
			}
			else if (newPosition == 0 && this.$content.scrollTop() != 0)
			{
				this.$content.scrollTop(0);
			}
			else if (newPosition >= max && this.$content.scrollTop() < maxScroll)
			{
				this.$content.scrollTop(maxScroll);
			}
		}
	}

	/**
	 * @method onScroll
	 * @return void
	 */
	public onScroll():void
	{
		if (this._knobDown)
		{
			return;
		}

		var scrollPos:number = this.$content.scrollTop(),
			overflowHeight:number = this.$content[0].scrollHeight - this.$element.height(),
			scrollPercentage:number = (scrollPos / overflowHeight) * 100;

		var barUseHeight:number = this.$bar.height() - this.$knob.height();

		this._knobPos = (barUseHeight / 100) * scrollPercentage;
		this.$knob.css({ 'top': this._knobPos });
	}

	/**
	 * @method onBarClick
	 * @param {any} event
	 * @return void
	 */
	public onBarClick(event:any):void
	{
		var pageCoord = event.originalEvent['touches'] ? event.originalEvent['touches'][0].pageY : event.pageY,
			barClickPos:number = pageCoord - this.$bar.offset().top;

		if (barClickPos < this._knobPos)
		{
			this.pageUp();
		}
		else if (barClickPos > this._knobPos + this.$knob.height())
		{
			this.pageDown();
		}
	}

	/**
	 * @method pageUp
	 * @return void
	 */
	public pageUp():void
	{
		//console.log('Page Up');
		this.$content.scrollTop(Math.max(0, this.$content.scrollTop() - this.$element.height()));
	}

	/**
	 * @method pageDown
	 * @return void
	 */
	public pageDown():void
	{
		//console.log('Page Down');
		this.$content.scrollTop(this.$content.scrollTop() + this.$element.height());
	}

	/**
	 * @method showKnob
	 * @return void
	 */
	public showKnob():void
	{
		if (!this._barVisible && this._barEnabled && this.hideScrollbar)
		{
			this._barVisible = true;
			TweenLite.to(this.$bar[0], .35, { css: { 'opacity': 1 }});
		}
	}

	/**
	 * @method hideKnob
	 * @return void
	 */
	public hideKnob():void
	{
		if (this._barVisible && this._barEnabled && this.hideScrollbar)
		{
			this._barVisible = false;
			TweenLite.to(this.$bar[0], .35, { css: { 'opacity': 0 }});
		}
	}

	/**
	 * @method startHideTimer
	 * @return void
	 */
	public startHideTimer():void
	{
		this.clearTimer();

		if (!this._barHover && !this._knobDown)
		{
			this._hideTimer = setTimeout($.proxy(this.hideKnob, this), 800);
		}
	}

	/**
	 * @method clearTimer
	 * @return void
	 */
	public clearTimer():void
	{
		clearTimeout(this._hideTimer);
	}

	/**
	 * @method resizeKnob
	 * @return void
	 */
	public resizeKnob():void
	{
		if (this.$element.height() > 0 && this.$content[0].scrollHeight > 0)
		{
			this.$knob.css({ 'height': Math.max(20, this.$bar.height() * (this.$element.height() / this.$content[0].scrollHeight)) });
		}
	}

	/**
	 * @inheritDoc
	 */
	public destruct()
	{
		$(window).off('.' + this.eventNamespace);
		$(document).off('.' + this.eventNamespace);
		this.$content.off('.' + this.eventNamespace);
		this.$element.off('.' + this.eventNamespace);
		this.$bar.off('.' + this.eventNamespace);
		this.$knob.off('.' + this.eventNamespace);

		super.destruct();
	}
}