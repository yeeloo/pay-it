import refdef from "def/ReferenceDefinitions";
import * as utils from "lib/temple/utils/Utils";
import ko = require('knockout');
import EventDispatcher from "lib/temple/events/EventDispatcher";
import BaseEvent from "lib/temple/events/BaseEvent";
import * as Gaia from "../api/Gaia";
import GaiaHistory from "../core/GaiaHistory";
import IPageAsset from "../interface/IPageAsset";
import IPageNode from "../interface/IPageNode";
import IPageController from "../interface/IPageController";
import IPageViewModel from "../interface/IPageViewModel";
import GaiaEvent from "../events/GaiaEvent";
import PageEvent from "../events/PageEvent";
import GaiaHistoryEvent from "../events/GaiaHistoryEvent";
import AssetEvent from "../events/AssetEvent";
import Log from "../../temple/utils/Log";
import StringUtils from "../../temple/utils/types/StringUtils";

/**
 * PageAsset
 *
 * @module Gaia
 * @namespace gaia.assets
 * @class PageAsset
 * @extend temple.events.EventDispatcher
 */
class PageAsset extends EventDispatcher implements IPageAsset
{
	public static viewModelPath:string = 'app/page/';
	public static controllerPath:string = 'app/page/';
	public static templatePath:string = 'app/../../template/'; // relative to this file

	public static viewModelMobilePath:string = 'mobile/page/';
	public static controllerMobilePath:string = 'mobile/page/';
	public static templateMobilePath:string = 'app/../../template/mobile/'; // relative to this file

	private _parent:PageAsset;
	public defaultChild:string;
	public landing:boolean;
	public active:boolean;

	private _node:IPageNode;
	public id:string;
	public title:string;
	public container:string;
	public controllerName:string;
	public viewModelName:string;
	public template:string;
	public type:string;
	public data:any;
	public partials:{
		app?: string[];
		mobile?: string[];
	};

	public pages:{
		[index: string]: PageAsset;
	};
	public assets:{
		[index: string]: PageAsset;
	};

	public isTransitionedIn:boolean;

	private _controller:IPageController;

	_onProgressDelegate:(event:BaseEvent, data?:any) => any;
	_onCompleteDelegate:(event:BaseEvent, data?:any) => any;
	_onErrorDelegate:(event:BaseEvent, data?:any) => any;

	_onGaiaHistoryDelegate:(event:BaseEvent, data?:any) => any;
	_onTransitionCompleteDelegate:(event:BaseEvent, data?:any) => any;
	_onTransitionInCompleteDelegate:(event:BaseEvent, data?:any) => any;
	_onTransitionOutCompleteDelegate:(event:BaseEvent, data?:any) => any;

	private _log:Log;

	constructor(node:IPageNode)
	{
		super();

		this._node = node;

		// net data by node
		this.id = node.id;
		var defaultFile = this.id + '/' + this.id.charAt(0).toUpperCase() + this.id.replace(/\-[a-z0-9]/g,function (x)
		{
			return x.charAt(1).toUpperCase();
		}).substr(1);

		// create Log object with id of page as namespace
		this._log = new Log(`lib.gaia.assets.PageAsset.${StringUtils.camelCase(this.id)}`);

		var folder = (this._node.folder || '');

		this.title = node.title || node.id;
		this.data = node.data || {};
		this.container = node.container;
		this.partials = node.partials || {};

		// get paths
		this.template = this.getFileValue(node.template, PageAsset.templatePath, PageAsset.templateMobilePath, folder, 'default.html', this.id, false, '.html');
		this.controllerName = this.getFileValue(node.controller, PageAsset.controllerPath, PageAsset.controllerMobilePath, folder, 'DefaultPageController', defaultFile + 'PageController');
		this.viewModelName = this.getFileValue(node.viewModel, PageAsset.viewModelPath, PageAsset.viewModelMobilePath, folder, 'DefaultPageViewModel', defaultFile + 'PageViewModel');

		// default landing = false.
		if (typeof node.landing == 'undefined')
		{
			this.landing = false;
		}
		else
		{
			this.landing = node.landing;
		}

		this.pages = {};
		this.assets = {};
	}

	private getFileValue(value:any, path:string, pathMobile:string, folder:string, defaultFile:string, autoFile:string, isMobileValue:boolean = false, fileExtension:string = ''):string
	{
//		console.log('getFileValue: ', arguments);

		if (typeof value === 'object')
		{
			return this.getFileValue((isMobile ? value.mobile : value.app), path, pathMobile, folder, defaultFile, autoFile, isMobile, fileExtension);
		}
		// mobile, create both using convention
		else if (value == 'mobile')
		{
			return (isMobile ? pathMobile : path) + folder + autoFile + fileExtension;
		}
		// missing, create using convention
		else if (typeof value === 'undefined')
		{
			return (isMobileValue ? pathMobile : path) + folder + autoFile + fileExtension;
		}
		// if not default, create the path specified
		else if (value != 'default')
		{
			return (isMobileValue ? pathMobile : path) + folder + value;
		}
		else if (value == 'default')
		{
			return (isMobileValue ? pathMobile : path) + defaultFile;
		}

		return '';
	}

	init():void
	{
		this._onGaiaHistoryDelegate = <(event:BaseEvent, data?:any) => any>this.onDeeplink.bind(this);
		this._onTransitionCompleteDelegate = <(event:BaseEvent, data?:any) => any>this.onTransitionComplete.bind(this);
		this._onTransitionInCompleteDelegate = <(event:BaseEvent, data?:any) => any>this.onTransitionInComplete.bind(this);
		this._onTransitionOutCompleteDelegate = <(event:BaseEvent, data?:any) => any>this.onTransitionOutComplete.bind(this);
	}

	getBranch():string
	{
		if (this._parent != null)
		{
			return this._parent.getBranch() + "/" + this.id;
		}
		return this.id;
	}

	getContent():IPageController
	{
		return this._controller;
	}

	getData(key?:string, inherit:boolean = false):any
	{
		// return complete object
		if (!key)
		{
			if (inherit && this.getParent())
			{
				return $.extend({}, this.getParent().getData(key, inherit), this.data);
			}
			else
			{
				return this.data;
			}
		}

		// if no data, check possible with parent (else return null)
		if (key && !this.data)
		{
			if (inherit && this.getParent())
			{
				return this.getParent().getData(key, inherit);
			}

			return null;
		}

		// return key
		if (key in this.data) return this.data[key];

		// return parent key
		if (inherit && this.getParent())
		{
			return this.getParent().getData(key, inherit);
		}

		return null;
	}

	public setParent(value:PageAsset):void
	{
		if (this._parent == null)
		{
			this._parent = value;
		}
	}

	public getParent():PageAsset
	{
		return this._parent;
	}

	public preload():void
	{
		this.active = true;

		var fileList = [
			this.viewModelName,
			this.controllerName
		];

		if (!ko.templates.hasOwnProperty(this.id) && !document.getElementById(this.id))
		{
			fileList.push('text!' + this.template);
		}

		var partialIds:string[] = [];
		var partials = this.partials[isMobile ? 'mobile' : 'app'] || [];
		for (var i = 0; i < partials.length; i++)
		{
			var partial = partials[i];
			var partialId = partial.split('/').pop().split('.').shift();
			if (!ko.templates[partialId] && !document.getElementById(partialId))
			{
				fileList.push('text!' + (this._node.template == 'mobile' && isMobile ? PageAsset.templateMobilePath : PageAsset.templatePath) + partial);
				partialIds.push(partialId);
			}
		}

		require(fileList, (viewModel:any, controller:any, template:string, ...args) =>
		{
			// store partials
			for (var i = 0; i < args.length; i++)
			{
				ko.templates[partialIds[i]] = args[i];
			}

			this._controller = <IPageController>(new (controller.default)());

			this.onComplete();

			if (template)
			{
				this._controller.setTemplate(template);
			}
			this._controller.setViewModel(<IPageViewModel>(new (viewModel.default)()));

			this.dispatchEvent(new AssetEvent(AssetEvent.ASSET_COMPLETE, this));
		});
	}

	public initPage():void
	{
		if (!this.isTransitionedIn)
		{
			this._controller.init();
		}
	}

	public transition():void
	{
		this._log.log('transition');
		this._controller.transition();
	}

	public transitionIn():void
	{
		this._log.log('transitionIn');

		if (!this.isTransitionedIn)
		{
			//initAssets();
			this._controller.transitionIn();
		}
		else
		{
			this.onTransitionInComplete();
		}
	}

	public transitionOut():void
	{
		this._log.log('transitionOut');

		Gaia.history.removeEventListener(GaiaHistoryEvent.DEEPLINK, this._onGaiaHistoryDelegate);

		if (this.isTransitionedIn)
		{
			this._controller.transitionOut();
		}
		else
		{
			this.onTransitionOutComplete();
		}
	}

	// EVENT LISTENERS
	private onTransitionComplete(event:Event = null):void
	{
		this._log.log('onTransitionComplete');

		this.dispatchEvent(new PageEvent(PageEvent.TRANSITION_COMPLETE));
	}

	private onTransitionInComplete(event:Event = null):void
	{
		this._log.log('onTransitionInComplete');

		this.isTransitionedIn = true;
		this.dispatchEvent(new PageEvent(PageEvent.TRANSITION_IN_COMPLETE));
	}

	private onTransitionOutComplete(event:BaseEvent = null):void
	{
		this._log.log('onTransitionOutComplete');

		this.destroy();

		this.dispatchEvent(new PageEvent(PageEvent.TRANSITION_OUT_COMPLETE));
	}

	onComplete():void
	{
		this.decorate();

		Gaia.history.addEventListener(GaiaHistoryEvent.DEEPLINK, this._onGaiaHistoryDelegate);

		this.isTransitionedIn = false;
		//super.onComplete(event);
		//_loader.content.visible = true;
	}

	// GaiaHistory sends deeplink events to active pages
	private onDeeplink(event:GaiaHistoryEvent):void
	{
		// only call on current or child page
		if (event.routeResult[0].branch.indexOf(this.getBranch()) == 0)
		{
			this._controller.onDeeplink(event);
		}
	}

	private decorate():void
	{
		this._controller.addEventListener(PageEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
		this._controller.addEventListener(PageEvent.TRANSITION_IN_COMPLETE, this._onTransitionInCompleteDelegate);
		this._controller.addEventListener(PageEvent.TRANSITION_OUT_COMPLETE, this._onTransitionOutCompleteDelegate);
		this._controller.page = this;
	}

	public destroy():void
	{
		this.isTransitionedIn = false;

		if (this._controller)
		{
			this._controller.destruct();
			this._controller = null;
		}

		Gaia.history.removeEventListener(GaiaHistoryEvent.DEEPLINK, this._onGaiaHistoryDelegate);

		this.active = false;
	}
}

export default PageAsset;
