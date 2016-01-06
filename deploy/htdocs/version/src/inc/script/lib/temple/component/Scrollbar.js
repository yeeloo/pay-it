var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/core/Destructible"], function (require, exports, Destructible_1) {
    /**
     * @class Scrollbar
     * @extend temple.core.Destructible
     */
    var Scrollbar = (function (_super) {
        __extends(Scrollbar, _super);
        /**
         * @class Scrollbar
         * @constructor
         * @param {JQuery} $element
         */
        function Scrollbar($element) {
            _super.call(this);
            this.$element = $element;
            this._barEnabled = true;
            this._barVisible = true;
            this._knobPos = 0;
            this._roundStep = 0;
            this.hideScrollbar = true;
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
        Scrollbar.prototype.addEvents = function () {
            var _this = this;
            $(window).on('resize.' + this.eventNamespace, function () {
                _this.update();
                _this.onScroll();
            });
            this.$content.on('scroll.' + this.eventNamespace, function () {
                _this.showKnob();
                _this.onScroll();
                _this.startHideTimer();
            });
            this.$content.on('mouseup.' + this.eventNamespace, function () {
                _this.$element.scrollLeft(0);
            });
            this.$bar.on('mouseenter.' + this.eventNamespace, function () {
                _this._barHover = true;
                _this.showKnob();
                _this.clearTimer();
            });
            this.$bar.on('mouseleave.' + this.eventNamespace, function (event) {
                _this._barHover = false;
                _this.startHideTimer();
            });
            this.$bar.on('mousedown.' + this.eventNamespace, function (event) {
                event.preventDefault();
            });
            this.$bar.on('click.' + this.eventNamespace, function (event) {
                event.preventDefault();
                _this.onBarClick(event);
            });
            this.$knob.on(this.mouse.down + '.' + this.eventNamespace, function (event) {
                event.preventDefault();
                var originalEvent = event['originalEvent'];
                _this._knobDown = true;
                _this._mousePos = originalEvent.touches ? originalEvent.touches[0].pageY : event.pageY;
                _this._roundStep = _this._knobPos;
                $(document).on(_this.mouse.move + '.' + _this.eventNamespace, _this.onMouseMove.bind(_this));
                $(document).on(_this.mouse.up + '.' + _this.eventNamespace, function (event) {
                    if (_this._knobDown) {
                        if (!Scrollbar.TOUCHSUPPORT) {
                            _this.onMouseMove(event);
                        }
                        _this._knobDown = false;
                        _this._mousePos = null;
                        _this._knobPos = parseInt(_this.$knob.css('top').replace('px', ''));
                        $(document).off(_this.mouse.up + '.' + _this.eventNamespace);
                        $(document).off(_this.mouse.move + '.' + _this.eventNamespace);
                        _this.startHideTimer();
                    }
                });
            });
            $(window).on('mouseleave.' + this.eventNamespace, function () {
                _this.$element.scrollLeft(0);
            });
            this.update();
            this._barVisible = false;
            TweenLite.to(this.$bar[0], 0, { css: { 'opacity': 0 } });
        };
        /**
         * @method checkHeight
         * @return void
         */
        Scrollbar.prototype.checkHeight = function () {
            if (this.$content[0].scrollHeight <= this.$element.height()) {
                this._barEnabled = false;
                this.$bar.addClass('hide');
                this.hideKnob();
            }
            else {
                this._barEnabled = true;
                this.$bar.removeClass('hide');
            }
        };
        /**
         * @method resizeKnob
         * @return void
         */
        Scrollbar.prototype.update = function () {
            this.checkHeight();
            this.resizeKnob();
            this.onScroll();
            if (this.$content.hasClass('show-scrollbar') && this._barEnabled) {
                TweenLite.to(this.$bar[0], .35, { css: { 'opacity': 1 } });
            }
        };
        /**
         * @method resizeKnob
         * @return void
         */
        Scrollbar.prototype.onMouseMove = function (event) {
            if (this._knobDown) {
                var pageCoord = event.originalEvent['touches'] ? event.originalEvent['touches'][0].pageY : event.pageY, max = this.$bar.height() - this.$knob.height(), maxScroll = this.$content[0].scrollHeight - this.$element.height(), newPosition = Math.min(max, Math.max(0, this._knobPos + (pageCoord - this._mousePos)));
                this.$knob.css({ 'top': newPosition });
                if (newPosition != this._knobPos) {
                    //this._lastPos = newPosition;
                    var restBarHeight = this.$bar.height() - this.$knob.height(), percentage = (newPosition / restBarHeight);
                    this.$content.scrollTop((this.$content[0].scrollHeight - this.$element.height()) * percentage);
                }
                else if (newPosition == 0 && this.$content.scrollTop() != 0) {
                    this.$content.scrollTop(0);
                }
                else if (newPosition >= max && this.$content.scrollTop() < maxScroll) {
                    this.$content.scrollTop(maxScroll);
                }
            }
        };
        /**
         * @method onScroll
         * @return void
         */
        Scrollbar.prototype.onScroll = function () {
            if (this._knobDown) {
                return;
            }
            var scrollPos = this.$content.scrollTop(), overflowHeight = this.$content[0].scrollHeight - this.$element.height(), scrollPercentage = (scrollPos / overflowHeight) * 100;
            var barUseHeight = this.$bar.height() - this.$knob.height();
            this._knobPos = (barUseHeight / 100) * scrollPercentage;
            this.$knob.css({ 'top': this._knobPos });
        };
        /**
         * @method onBarClick
         * @param {any} event
         * @return void
         */
        Scrollbar.prototype.onBarClick = function (event) {
            var pageCoord = event.originalEvent['touches'] ? event.originalEvent['touches'][0].pageY : event.pageY, barClickPos = pageCoord - this.$bar.offset().top;
            if (barClickPos < this._knobPos) {
                this.pageUp();
            }
            else if (barClickPos > this._knobPos + this.$knob.height()) {
                this.pageDown();
            }
        };
        /**
         * @method pageUp
         * @return void
         */
        Scrollbar.prototype.pageUp = function () {
            //console.log('Page Up');
            this.$content.scrollTop(Math.max(0, this.$content.scrollTop() - this.$element.height()));
        };
        /**
         * @method pageDown
         * @return void
         */
        Scrollbar.prototype.pageDown = function () {
            //console.log('Page Down');
            this.$content.scrollTop(this.$content.scrollTop() + this.$element.height());
        };
        /**
         * @method showKnob
         * @return void
         */
        Scrollbar.prototype.showKnob = function () {
            if (!this._barVisible && this._barEnabled && this.hideScrollbar) {
                this._barVisible = true;
                TweenLite.to(this.$bar[0], .35, { css: { 'opacity': 1 } });
            }
        };
        /**
         * @method hideKnob
         * @return void
         */
        Scrollbar.prototype.hideKnob = function () {
            if (this._barVisible && this._barEnabled && this.hideScrollbar) {
                this._barVisible = false;
                TweenLite.to(this.$bar[0], .35, { css: { 'opacity': 0 } });
            }
        };
        /**
         * @method startHideTimer
         * @return void
         */
        Scrollbar.prototype.startHideTimer = function () {
            this.clearTimer();
            if (!this._barHover && !this._knobDown) {
                this._hideTimer = setTimeout($.proxy(this.hideKnob, this), 800);
            }
        };
        /**
         * @method clearTimer
         * @return void
         */
        Scrollbar.prototype.clearTimer = function () {
            clearTimeout(this._hideTimer);
        };
        /**
         * @method resizeKnob
         * @return void
         */
        Scrollbar.prototype.resizeKnob = function () {
            if (this.$element.height() > 0 && this.$content[0].scrollHeight > 0) {
                this.$knob.css({ 'height': Math.max(20, this.$bar.height() * (this.$element.height() / this.$content[0].scrollHeight)) });
            }
        };
        /**
         * @inheritDoc
         */
        Scrollbar.prototype.destruct = function () {
            $(window).off('.' + this.eventNamespace);
            $(document).off('.' + this.eventNamespace);
            this.$content.off('.' + this.eventNamespace);
            this.$element.off('.' + this.eventNamespace);
            this.$bar.off('.' + this.eventNamespace);
            this.$knob.off('.' + this.eventNamespace);
            _super.prototype.destruct.call(this);
        };
        Scrollbar.COUNT = 0;
        Scrollbar.TOUCHSUPPORT = (typeof (window['ontouchstart']) !== 'undefined') ? true : false;
        return Scrollbar;
    })(Destructible_1.default);
    exports.Scrollbar = Scrollbar;
});
