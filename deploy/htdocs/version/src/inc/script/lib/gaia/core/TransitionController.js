var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../events/PageEvent", "lib/temple/events/EventDispatcher", "../../temple/utils/Log"], function (require, exports, PageEvent_1, EventDispatcher_1, Log_1) {
    /**
     * @namespace gaia.core
     * @class TransitionController
     * @extend temple.events.EventDispatcher
     */
    var TransitionController = (function (_super) {
        __extends(TransitionController, _super);
        function TransitionController() {
            _super.call(this);
            // flags
            this._transitionAll = true;
            this._transitionInAll = false;
            this._transitionOutAll = false;
            this._log = new Log_1.default('lib.gaia.core.TransitionController');
            this._onTransitionCompleteDelegate = this.onTransitionComplete.bind(this);
            this._onTransitionInCompleteDelegate = this.onTransitionInComplete.bind(this);
            this._onTransitionOutCompleteDelegate = this.onTransitionOutComplete.bind(this);
        }
        TransitionController.prototype.transitionOut = function (pages) {
            this._log.log('transitionOut', pages);
            this.transitionState |= 2;
            this.isInterrupted = false;
            if (pages.length > 0) {
                this.outPages = pages;
                this.outIndex = pages.length - 1;
                if (this._transitionOutAll) {
                    for (var i = this.outIndex; i > -1; --i) {
                        this.pageOut(this.outPages[i]);
                    }
                }
                else {
                    this.pageOut();
                }
            }
            else {
                this.dispatchEvent(new PageEvent_1.default(PageEvent_1.default.TRANSITION_OUT_COMPLETE));
            }
        };
        TransitionController.prototype.transition = function (oldPages, newPages) {
            this._log.log('transition', oldPages, newPages);
            this.isInterrupted = false;
            this.tPages = oldPages.concat(newPages);
            if (this.tPages.length > 0) {
                this.tIndex = 0;
                if (this._transitionAll) {
                    for (var i = 0; i < this.tPages.length; ++i) {
                        this.pageTransition(this.tPages[i]);
                    }
                }
                else {
                    this.pageTransition();
                }
            }
            else {
                this.dispatchEvent(new PageEvent_1.default(PageEvent_1.default.TRANSITION_COMPLETE));
            }
        };
        TransitionController.prototype.transitionIn = function (pages) {
            this._log.log('transitionIn', pages);
            this.transitionState |= 1;
            this.isInterrupted = false;
            if (pages.length > 0) {
                this.inPages = pages;
                this.inIndex = 0;
                if (this._transitionInAll) {
                    for (var i = 0; i < this.inPages.length; ++i) {
                        this.pageIn(this.inPages[i]);
                    }
                }
                else {
                    this.pageIn();
                }
            }
            else {
                this.dispatchEvent(new PageEvent_1.default(PageEvent_1.default.TRANSITION_IN_COMPLETE));
            }
        };
        //	transition2(oldPages:IPageAsset[], newPages:IPageAsset[]):void
        //	{
        //		this.dispatchEvent(new PageEvent(PageEvent.TRANSITION_COMPLETE));
        //
        //		if( false )
        //		{
        //			var tl:TimelineLite = new TimelineLite();
        //
        //			var duration = 0.6;
        //			var screenWidth = 100;
        //			var screenHeight = 100;
        //
        //			var direction:string = 'top';
        //
        //			var firstNewPage:IPageAsset = newPages[newPages.length - 1];
        //			for( var i:number = 0; i < newPages.length; ++i )
        //			{
        //				if( !newPages[i].isTransitionedIn )
        //				{
        //					firstNewPage = newPages[i];
        //					break;
        //				}
        //			}
        //
        //			if( oldPages.length > 0 )
        //			{
        //				var currentPageInfo = oldPages[0].data;
        //				var newPageInfo = firstNewPage.data;
        //
        //				if( currentPageInfo.level == newPageInfo.level )
        //				{
        //					direction = currentPageInfo.index < newPageInfo.index ? 'right' : 'left';
        //				}
        //				else
        //				{
        //					direction = currentPageInfo.level < newPageInfo.level ? 'bottom' : 'top';
        //				}
        //			}
        //
        //			var fromLeft:number = (direction == 'left' ? -screenWidth : (direction == 'right' ? screenWidth : 0));
        //			var fromTop:number = (direction == 'top' ? -screenHeight : (direction == 'bottom' ? screenHeight : 0));
        //
        //			// out
        //			for( var i:number = 0; i < oldPages.length; ++i )
        //			{
        //				var el:HTMLDivElement = oldPages[i].getContent().element;
        //
        //				el.style.position = 'absolute';
        //
        //				tl.append(TweenLite.to(el, duration,
        //					{ css:               { left: -fromLeft + '%', top: -fromTop + '%' }, onComplete: (p:IPageAsset) =>
        //					{
        //						p.destroy()
        //					}, onCompleteParams: [oldPages[i]], ease: Power4.easeInOut }), -duration);
        //			}
        //
        //
        //			// in
        //			for( var i:number = 0; i < newPages.length; ++i )
        //			{
        //				if( !newPages[i].isTransitionedIn )
        //				{
        //					var el:HTMLDivElement = newPages[i].getContent().element;
        //
        //					var oldPosition:string = el.style.position;
        //
        //					el.style.position = 'absolute';
        //					el.style.left = fromLeft + '%';
        //					el.style.top = fromTop + '%';
        //					el.style.visibility = 'visible';
        //
        //					tl.append(TweenLite.to(el, duration,
        //						{ css:               { left: 0, top: 0 }, ease: Power4.easeInOut, onComplete: (pageEl:HTMLDivElement, oldPosition:string) =>
        //						{
        //							pageEl.style.position = oldPosition;
        //						}, onCompleteParams: <any[]>[el, oldPosition] }), -duration);
        //				}
        //			}
        //
        //			tl.append(() =>
        //			{
        //				this.dispatchEvent(new PageEvent(PageEvent.TRANSITION_COMPLETE));
        //			});
        //		}
        //
        //	}
        TransitionController.prototype.onTransitionOutComplete = function (event) {
            event.target.removeEventListener(PageEvent_1.default.TRANSITION_OUT_COMPLETE, this._onTransitionOutCompleteDelegate);
            this._log.log('transitionOutComplete', event.target.getBranch());
            if (!this.isInterrupted && (--this.outIndex > -1)) {
                if (!this._transitionOutAll) {
                    this.pageOut();
                }
                return;
            }
            this.transitionState &= 1;
            this.isInterrupted = false;
            this.dispatchEvent(event);
        };
        TransitionController.prototype.onTransitionInComplete = function (event) {
            this._log.log('transitionInComplete', event.target.getBranch());
            event.target.removeEventListener(PageEvent_1.default.TRANSITION_IN_COMPLETE, this._onTransitionInCompleteDelegate);
            if (!this.isInterrupted && (++this.inIndex < this.inPages.length)) {
                if (!this._transitionInAll) {
                    this.pageIn();
                }
                return;
            }
            this.transitionState &= 2;
            this.isInterrupted = false;
            this.dispatchEvent(event);
        };
        TransitionController.prototype.onTransitionComplete = function (event) {
            this._log.log('transitionComplete', event.target.getBranch());
            event.target.removeEventListener(PageEvent_1.default.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
            if (!this.isInterrupted && (++this.tIndex < this.tPages.length)) {
                if (!this._transitionAll) {
                    this.pageTransition();
                }
                return;
            }
            this.isInterrupted = false;
            this.dispatchEvent(event);
        };
        TransitionController.prototype.pageOut = function (page) {
            this._log.log('transitionOut', this.outPages[this.outIndex].getBranch());
            if (typeof (page) == 'undefined') {
                page = this.outPages[this.outIndex];
            }
            page.addEventListener(PageEvent_1.default.TRANSITION_OUT_COMPLETE, this._onTransitionOutCompleteDelegate);
            page.transitionOut();
        };
        TransitionController.prototype.pageIn = function (page) {
            this._log.log('transitionIn', this.inPages[this.inIndex].getBranch());
            if (typeof (page) == 'undefined') {
                page = this.inPages[this.inIndex];
            }
            page.addEventListener(PageEvent_1.default.TRANSITION_IN_COMPLETE, this._onTransitionInCompleteDelegate);
            page.transitionIn();
        };
        TransitionController.prototype.pageTransition = function (page) {
            this._log.log('transition', this.tPages[this.tIndex].getBranch());
            if (typeof (page) == 'undefined') {
                page = this.tPages[this.tIndex];
            }
            page.addEventListener(PageEvent_1.default.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
            this.dispatchEvent(new PageEvent_1.default(PageEvent_1.default.BEFORE_INIT, page));
            page.initPage();
            page.transition();
        };
        TransitionController.prototype.interrupt = function () {
            if (!this.isInterrupted && this.transitionState > 0) {
                this.isInterrupted = true;
                var transitionDirection = "";
                if (this.transitionState & 1) {
                    transitionDirection = "IN";
                }
                if (this.transitionState & 2) {
                    transitionDirection += "OUT";
                }
                if (transitionDirection == "INOUT") {
                    transitionDirection = "CROSS";
                }
                this._log.warn('transition interrupt', transitionDirection);
            }
        };
        return TransitionController;
    })(EventDispatcher_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TransitionController;
});
