var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/events/EventDispatcher", "lib/temple/core/DestructibleHelper", "../events/PageEvent", 'knockout', "../../temple/utils/Log"], function (require, exports, EventDispatcher_1, DestructibleHelper_1, PageEvent_1, ko, Log_1) {
    /**
     * AbstractPageController
     *
     * @module Gaia
     * @namespace gaia.assets
     * @class AbstractPageController
     * @extends temple.events.EventDispatcher
     */
    var AbstractPageController = (function (_super) {
        __extends(AbstractPageController, _super);
        /**
         * Constructor
         *
         * @constructor
         */
        function AbstractPageController() {
            _super.call(this);
            /**
             * instance of {{#crossLink "temple.utils.log.Log"}}Log{{/crossLink}}, used for logging
             *
             * @property _log
             * @type {Log}
             * @protected
             */
            this._log = new Log_1.default('lib.gaia.assets.AbstractPageController');
            this.destructibles = new DestructibleHelper_1.default();
        }
        /**
         * save viewmodel reference, and add a refence back to this page on the viewModel
         *
         * @method setViewModel
         * @param {IViewModel} viewModel
         * @return {void}
         */
        AbstractPageController.prototype.setViewModel = function (viewModel) {
            this.viewModel = viewModel;
            this.viewModel.setController(this);
        };
        /**
         * set the template, so it can be used for KnockOut
         *
         * @method setTemplate
         * @param {string} template
         * @return {void}
         */
        AbstractPageController.prototype.setTemplate = function (template) {
            ko.templates[this.page.id] = template;
        };
        /**
         * always call super.init() when you override this method, or else we don't have a ViewController
         *
         * @method init
         * @return {void}
         */
        AbstractPageController.prototype.init = function () {
            var _this = this;
            // find container to insert this page in
            var container;
            var page = this.page;
            // update the log object with a new namespace based on this page's id
            this._log.setNamespace(this.page.controllerName.replace(/\//ig, '.'));
            while (page.getParent() && !container) {
                // todo, add support for named containers: "[data-gaia-container=" + container + "]"
                var el = page.getParent().getContent().element;
                if (this.page.container) {
                    container = $('[data-gaia-container="' + this.page.container + '"]', el)[0];
                }
                else {
                    container = $('[data-gaia-container]', el)[0];
                }
                page = page.getParent();
            }
            // we need a container div for our page
            container = container || $('[data-gaia-container=' + this.page.container + ']')[0] || $('[data-gaia-container=main]')[0] || $('[data-gaia-container]')[0];
            var holder = document.createElement('div');
            // the template will be loded in this page via data-binding
            $(holder).attr('data-bind', "template: { name: '" + this.page.id + "' }");
            // we need this css-class for our styles
            $(holder).addClass('view view-' + this.page.id.replace(/\./g, '-'));
            // and add it
            container.appendChild(holder);
            // do the KnockOut magic
            ko.applyBindings(this.viewModel, holder);
            // save the refence
            this.element = holder;
            $(this.element).find('[data-gaia-container]').each(function (index, item) {
                if ($(item).attr('data-gaia-container') == '') {
                    $(item).attr('data-gaia-container', _this.page.id);
                }
            });
            // hide it for now, we will show it later in the TransitionManager
            this.element.style.visibility = 'hidden';
        };
        AbstractPageController.prototype.transition = function () {
            this._log.log('transition');
            this.transitionComplete();
        };
        AbstractPageController.prototype.transitionIn = function () {
            this._log.log('transitionIn');
            this.element.style.visibility = 'visible';
            this.transitionInComplete();
        };
        AbstractPageController.prototype.transitionOut = function () {
            this._log.log('transitionOut');
            this.element.style.visibility = 'visible';
            this.transitionOutComplete();
        };
        AbstractPageController.prototype.transitionComplete = function () {
            this._log.log('transitionComplete');
            this.dispatchEvent(new PageEvent_1.default(PageEvent_1.default.TRANSITION_COMPLETE));
        };
        AbstractPageController.prototype.transitionInComplete = function () {
            this._log.log('transitionInComplete');
            this.dispatchEvent(new PageEvent_1.default(PageEvent_1.default.TRANSITION_IN_COMPLETE));
        };
        AbstractPageController.prototype.transitionOutComplete = function () {
            this._log.log('transitionOutComplete');
            this.dispatchEvent(new PageEvent_1.default(PageEvent_1.default.TRANSITION_OUT_COMPLETE));
        };
        AbstractPageController.prototype.onDeeplink = function (event) {
        };
        AbstractPageController.prototype.destruct = function () {
            $(this.element).off('.remove');
            if (this.viewModel) {
                if (typeof this.viewModel.destruct !== "undefined") {
                    this.viewModel.destruct();
                }
                this.viewModel = null;
            }
            this.page = null;
            if (this.element) {
                ko.cleanNode(this.element);
                $(this.element).remove();
                this.element = null;
            }
            if (this.destructibles) {
                this.destructibles.destruct();
                this.destructibles = null;
            }
            _super.prototype.destruct.call(this);
        };
        return AbstractPageController;
    })(EventDispatcher_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractPageController;
});
