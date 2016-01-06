var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../api/Gaia", "../core/BranchTools", "../core/SiteModel", "../flow/FlowManager", "../events/GaiaEvent", "../events/GotoEventItem", "../router/RouteResultItem", "lib/temple/events/EventDispatcher", "lib/temple/events/CommonEvent", "lib/temple/events/BaseEvent", "../../temple/utils/Log"], function (require, exports, Gaia, BranchTools_1, SiteModel_1, FlowManager_1, GaiaEvent_1, GotoEventItem_1, RouteResultItem_1, EventDispatcher_1, CommonEvent_1, BaseEvent_1, Log_1) {
    /**
     * @module Gaia
     * @namespace gaia.core
     * @class GaiaHQ
     * @extends temple.events.EventDispatcher
     */
    var GaiaHQ = (function (_super) {
        __extends(GaiaHQ, _super);
        function GaiaHQ() {
            _super.call(this);
            this._log = new Log_1.default('lib.gaia.core.GaiaHQ');
            this.uniqueID = 0;
            this.listeners = [];
            this.listeners['beforeGoto'] = {};
            this.listeners['afterGoto'] = {};
            this.listeners['beforeTransitionOut'] = {};
            this.listeners['afterTransitionOut'] = {};
            this.listeners['beforePreload'] = {};
            this.listeners['afterPreload'] = {};
            this.listeners['beforeTransition'] = {};
            this.listeners['afterTransition'] = {};
            this.listeners['beforeTransitionIn'] = {};
            this.listeners['afterTransitionIn'] = {};
            this.listeners['afterComplete'] = {};
            this.flowManager = new FlowManager_1.default(this);
        }
        GaiaHQ.birth = function () {
        };
        /**
         *
         * @returns {GaiaHQ}
         */
        GaiaHQ.getInstance = function () {
            if (GaiaHQ._instance == null) {
                GaiaHQ._instance = new GaiaHQ();
            }
            return GaiaHQ._instance;
        };
        // Called by GaiaImpl
        GaiaHQ.prototype.addListener = function (eventName, target, hijack, onlyOnce) {
            if (this.listeners[eventName] != null) {
                var listener = this.generateListener(eventName, target);
                if (!listener.hijack && hijack) {
                    listener._onHijackCompleteDelegate = this.onHijackComplete.bind(this);
                    listener.addEventListener(CommonEvent_1.default.COMPLETE, listener._onHijackCompleteDelegate);
                }
                else if (listener.hijack && !hijack) {
                    listener.removeEventListener(CommonEvent_1.default.COMPLETE, listener._onHijackCompleteDelegate);
                }
                listener.hijack = hijack;
                listener.completed = !hijack;
                listener.onlyOnce = onlyOnce;
                this.addEventListener(eventName, listener.target);
                return (hijack) ? listener.completeCallback.bind(listener) : null;
            }
            else {
                this._log.log("GaiaHQ Error! addListener: " + eventName + " is not a valid event");
                return null;
            }
        };
        GaiaHQ.prototype.removeListener = function (eventName, target) {
            if (this.listeners[eventName] != undefined) {
                for (var id in this.listeners[eventName]) {
                    if (this.listeners[eventName].hasOwnProperty(id)) {
                        if (this.listeners[eventName][id].target == target) {
                            this.removeListenerByID(eventName, id);
                            break;
                        }
                    }
                }
            }
            else {
                this._log.log("GaiaHQ Error! removeListener: " + eventName + " is not a valid event");
            }
        };
        // This method is the beginning of the event chain
        GaiaHQ.prototype.goto = function (routeResult, flow, queryString, replace) {
            if (flow === void 0) { flow = null; }
            if (queryString === void 0) { queryString = null; }
            if (replace === void 0) { replace = false; }
            if (!routeResult) {
                routeResult = new RouteResultItem_1.default([{
                        branch: 'index',
                        deeplink: {}
                    }], Gaia.router.assemble('index'));
            }
            // todo: move this checks somewhere else?
            if (routeResult[0].branch.substr(0, SiteModel_1.default.getIndexID().length) != SiteModel_1.default.getIndexID()) {
                routeResult[0].branch = SiteModel_1.default.getIndexID() + "/" + routeResult[0].branch;
            }
            routeResult[0].branch = BranchTools_1.default.getValidBranch(routeResult[0].branch);
            this.gotoEventObj = new GotoEventItem_1.default();
            this.gotoEventObj.routeResult = routeResult;
            //if (route)
            //{
            //	var providedResult:IRouteResultItem = Gaia.router.resolvePage(route);
            //
            //	// if result of provided route doesn't match the goto object, the route has become invalid
            //	if (!providedResult.equals(this.gotoEventObj.routeResult))
            //	{
            //		route = null
            //	}
            //}
            this.gotoEventObj.flow = flow;
            this.gotoEventObj.queryString = queryString;
            this.gotoEventObj.replace = replace;
            this.beforeGoto();
        };
        GaiaHQ.prototype.onGoto = function (event) {
            this.goto(event.routeResult);
        };
        // EVENT HIJACKS
        // GOTO BEFORE / AFTER
        GaiaHQ.prototype.beforeGoto = function () {
            this.onEvent(GaiaEvent_1.default.BEFORE_GOTO);
        };
        GaiaHQ.prototype.beforeGotoDone = function () {
            this.gotoEventObj.type = GaiaEvent_1.default.GOTO;
            this.dispatchGaiaEvent();
        };
        GaiaHQ.prototype.afterGoto = function () {
            this.onEvent(GaiaEvent_1.default.AFTER_GOTO);
        };
        GaiaHQ.prototype.afterGotoDone = function () {
            this.flowManager.afterGoto();
        };
        // TRANSITION OUT BEFORE / AFTER
        GaiaHQ.prototype.beforeTransitionOut = function () {
            this.onEvent(GaiaEvent_1.default.BEFORE_TRANSITION_OUT);
        };
        GaiaHQ.prototype.beforeTransitionOutDone = function () {
            this.dispatchEvent(new BaseEvent_1.default(GaiaHQ.TRANSITION_OUT));
        };
        GaiaHQ.prototype.afterTransitionOut = function () {
            this.onEvent(GaiaEvent_1.default.AFTER_TRANSITION_OUT);
        };
        GaiaHQ.prototype.afterTransitionOutDone = function () {
            this.flowManager.afterTransitionOutDone();
        };
        // PRELOAD BEFORE / AFTER
        GaiaHQ.prototype.beforePreload = function () {
            this.onEvent(GaiaEvent_1.default.BEFORE_PRELOAD);
        };
        GaiaHQ.prototype.beforePreloadDone = function () {
            this.dispatchEvent(new BaseEvent_1.default(GaiaHQ.PRELOAD));
        };
        GaiaHQ.prototype.afterPreload = function () {
            this.onEvent(GaiaEvent_1.default.AFTER_PRELOAD);
        };
        GaiaHQ.prototype.afterPreloadDone = function () {
            this.flowManager.afterPreloadDone();
        };
        // TRANSITION IN BEFORE / AFTER
        GaiaHQ.prototype.beforeTransition = function () {
            this.onEvent(GaiaEvent_1.default.BEFORE_TRANSITION);
        };
        GaiaHQ.prototype.beforeTransitionDone = function () {
            this.dispatchEvent(new BaseEvent_1.default(GaiaHQ.TRANSITION));
        };
        GaiaHQ.prototype.afterTransition = function () {
            this.onEvent(GaiaEvent_1.default.AFTER_TRANSITION);
        };
        GaiaHQ.prototype.afterTransitionDone = function () {
            this.flowManager.afterTransitionDone();
        };
        // TRANSITION IN BEFORE / AFTER
        GaiaHQ.prototype.beforeTransitionIn = function () {
            this.onEvent(GaiaEvent_1.default.BEFORE_TRANSITION_IN);
        };
        GaiaHQ.prototype.beforeTransitionInDone = function () {
            this.dispatchEvent(new BaseEvent_1.default(GaiaHQ.TRANSITION_IN));
        };
        GaiaHQ.prototype.afterTransitionIn = function () {
            this.onEvent(GaiaEvent_1.default.AFTER_TRANSITION_IN);
        };
        GaiaHQ.prototype.afterTransitionInDone = function () {
            this.flowManager.afterTransitionInDone();
        };
        // AFTER COMPLETE
        GaiaHQ.prototype.afterComplete = function () {
            this.dispatchEvent(new BaseEvent_1.default(GaiaHQ.COMPLETE));
            this.onEvent(GaiaEvent_1.default.AFTER_COMPLETE);
        };
        GaiaHQ.prototype.afterCompleteDone = function () {
            // we're done
        };
        // WHEN GAIA EVENTS OCCUR THEY ARE ROUTED THROUGH HERE FOR HIJACKING
        GaiaHQ.prototype.onEvent = function (eventName) {
            var eventHasListeners = false;
            var eventHasHijackers = false;
            for (var id in this.listeners[eventName]) {
                if (this.listeners[eventName].hasOwnProperty(id)) {
                    if (this.listeners[eventName][id] != null) {
                        eventHasListeners = true;
                        var listener = this.listeners[eventName][id];
                        if (listener.onlyOnce) {
                            listener.dispatched = true;
                        }
                        if (listener.hijack) {
                            eventHasHijackers = true;
                        }
                    }
                }
            }
            this.gotoEventObj.type = eventName;
            if (eventHasListeners) {
                this.dispatchGaiaEvent();
            }
            if (!eventHasHijackers) {
                this[eventName + "Done"]();
            }
            this.removeOnlyOnceListeners(eventName);
        };
        // GENERATES AN EVENT HIJACKER
        GaiaHQ.prototype.generateListener = function (eventName, target) {
            // prevent duplicate listeners
            for (var id in this.listeners[eventName]) {
                if (this.listeners[eventName].hasOwnProperty(id)) {
                    if (this.listeners[eventName][id].target == target) {
                        this.removeEventListener(eventName, target);
                        return this.listeners[eventName][id];
                    }
                }
            }
            // new listener
            var listener = new GaiaHQListener();
            listener.event = eventName;
            listener.target = target;
            this.listeners[eventName][String(++this.uniqueID)] = listener;
            return listener;
        };
        // REMOVES EVENT LISTENERS BY THEIR UNIQUE ID
        GaiaHQ.prototype.removeListenerByID = function (eventName, id) {
            this.listeners[eventName][id].removeEventListener(CommonEvent_1.default.COMPLETE, this.onHijackComplete);
            this.removeEventListener(eventName, this.listeners[eventName][id].target);
            delete this.listeners[eventName][id];
        };
        // REMOVES EVENT LISTENERS THAT ONLY LISTEN ONCE
        GaiaHQ.prototype.removeOnlyOnceListeners = function (eventName) {
            for (var id in this.listeners[eventName]) {
                if (this.listeners[eventName].hasOwnProperty(id)) {
                    var listener = this.listeners[eventName][id];
                    if (listener.onlyOnce && listener.dispatched && !listener.hijack) {
                        this.removeListenerByID(eventName, id);
                    }
                }
            }
        };
        // RESET COMPLETED HIJACKERS AFTER ALL HIJACKERS ARE COMPLETE AND REMOVE ONLY ONCE HIJACKERS
        GaiaHQ.prototype.resetEventHijackers = function (eventName) {
            for (var id in this.listeners[eventName]) {
                if (this.listeners[eventName].hasOwnProperty(id)) {
                    if (this.listeners[eventName][id].hijack) {
                        if (!this.listeners[eventName][id].onlyOnce) {
                            this.listeners[eventName][id].completed = false;
                        }
                        else {
                            this.removeListenerByID(eventName, id);
                        }
                    }
                }
            }
        };
        // EVENT RECEIVED FROM EVENT HIJACKERS WHEN WAIT FOR COMPLETE CALLBACK IS CALLED
        GaiaHQ.prototype.onHijackComplete = function (event) {
            var allDone = true;
            var eventName = event.target.event;
            for (var id in this.listeners[eventName]) {
                if (this.listeners[eventName].hasOwnProperty(id)) {
                    if (!this.listeners[eventName][id].completed) {
                        allDone = false;
                        break;
                    }
                }
            }
            if (allDone) {
                this.resetEventHijackers(eventName);
                this[eventName + "Done"]();
            }
        };
        GaiaHQ.prototype.dispatchGaiaEvent = function () {
            var evt = new GaiaEvent_1.default(this.gotoEventObj.type, this.gotoEventObj.routeResult, this.gotoEventObj.external, this.gotoEventObj.src, this.gotoEventObj.flow, this.gotoEventObj.window, null, this.gotoEventObj.replace);
            this.dispatchEvent(evt);
        };
        GaiaHQ.TRANSITION_OUT = "transitionOut";
        GaiaHQ.TRANSITION_IN = "transitionIn";
        GaiaHQ.TRANSITION = "transition";
        GaiaHQ.PRELOAD = "preload";
        GaiaHQ.COMPLETE = "complete";
        return GaiaHQ;
    })(EventDispatcher_1.default);
    var GaiaHQListener = (function (_super) {
        __extends(GaiaHQListener, _super);
        function GaiaHQListener() {
            _super.call(this);
        }
        GaiaHQListener.prototype.completeCallback = function (destroy) {
            if (destroy === void 0) { destroy = false; }
            this.completed = true;
            if (destroy) {
                this.onlyOnce = true;
            }
            this.dispatchEvent(new CommonEvent_1.default(CommonEvent_1.default.COMPLETE));
        };
        return GaiaHQListener;
    })(EventDispatcher_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GaiaHQ;
});
