import refdef from "def/ReferenceDefinitions";
import EventDispatcher from "lib/temple/events/EventDispatcher";
import ISitemap from "../interface/ISitemap";
import IPageAsset from "lib/gaia/interface/IPageAsset";
import Flow from "../flow/Flow";
import PageAsset from "lib/gaia/assets/PageAsset";
import IPageNode from "lib/gaia/interface/IPageNode";
import IAssetNode from "lib/gaia/interface/IAssetNode";

class SiteModel extends EventDispatcher
{
	static _sitemap:ISitemap;
	static _tree:IPageAsset;
	static _title:string;
	static _delimiter:string;
	static _preloader:string;
	static _preloaderDepth:string;
	static _preloaderDomain:string;
	static _menu:boolean;
	static defaultFlow:Flow = Flow.NORMAL;
	static _history:boolean;
	static _indexFirst:boolean;
	static _indexID:string;
	static _assetPath:string;
	static _domain:string;
	static _version:number;

	constructor()
	{
		super();
	}

	public load(sitemap:ISitemap):void
	{
		SiteModel._sitemap = sitemap;

		if (SiteModel._sitemap.config)
		{
			if (SiteModel._sitemap.config.controllerPath)
			{
				PageAsset.controllerPath = SiteModel._sitemap.config.controllerPath;
			}
			if (SiteModel._sitemap.config.viewModelPath)
			{
				PageAsset.viewModelPath = SiteModel._sitemap.config.viewModelPath;
			}
			if (SiteModel._sitemap.config.templatePath)
			{
				PageAsset.templatePath = SiteModel._sitemap.config.templatePath;
			}
		}

		// Thijs hack: dispatch init event so you can do something with the xml before it is parsed
		//dispatchEvent(new Event(Event.INIT));

		this.parseSite();
		this.parseTree();

		//dispatchEvent(new Event(Event.COMPLETE));
	}

	public static getSitemap():ISitemap
	{
		return SiteModel._sitemap;
	}

	public static getTree():IPageAsset
	{
		return SiteModel._tree;
	}

	public static getTitle():string
	{
		return SiteModel._title;
	}

	public static getIndexFirst():boolean
	{
		return SiteModel._indexFirst;
	}

	public static getIndexID():string
	{
		return SiteModel._indexID;
	}

	public static getVersion():string
	{
		return SiteModel._version.toString();
	}

	private parseSite():void
	{
		SiteModel._title = SiteModel._sitemap.title || "";
		SiteModel._history = !(SiteModel._sitemap.history == false);
		SiteModel._indexFirst = (SiteModel._sitemap.indexFirst == true);
		//SiteModel._assetPath = SiteModel._sitemap.assetPath || "";
		SiteModel._version = SiteModel._sitemap.version;// || FlashVars.getValue("version");
	}

	private parsePopupPage(page:IPageNode, node:IPageNode):void
	{
		if (page.pages)
		{
			for (var j = 0; j < page.pages.length; ++j)
			{
				this.parsePopupPage(page.pages[j], node);
			}
		}
	}

	private getPages(page:any)
	{
		var pages:IPageNode[] = [];
		if (page.pages)
		{
			for (var i:number = 0; i < page.pages.length; ++i)
			{
				pages.push(page.pages[i]);
				pages = pages.concat(this.getPages(page.pages[i]));
			}
		}

		return pages;
	}

	private parseTree():void
	{
		var node:IPageNode = SiteModel._sitemap.pages[0];
		if (node.id != undefined)
		{
			SiteModel._indexID = node.id;
		}

		var popupString = '[]';

		if (typeof SiteModel._sitemap.popups !== 'undefined')
		{
			for (var i = 0; i < SiteModel._sitemap.popups.length; i++)
			{
				var popup = SiteModel._sitemap.popups[i];
				popup.type = "popup";
			}
			popupString = JSON.stringify(SiteModel._sitemap.popups);
		}

		SiteModel._tree = this.parsePage(node, null, popupString);
	}

	private parseChildren(parent:IPageAsset, childNodes:IPageNode[], popupString:string = null):any
	{
		var children:Object = {};
		var len:number = childNodes.length;
		for (var i:number = 0; i < len; i++)
		{
			var node:any = childNodes[i];
			var page:IPageAsset = this.parsePage(node, parent, popupString);
			children[page.id] = page;
		}
		return children;
	}

	private parsePage(node:IPageNode, parent:IPageAsset = null, popupString:string = null):IPageAsset
	{
		SiteModel.validateNode(node, true);

		var isIndex:boolean = (node.id == SiteModel._indexID);

		// merge popups from this page
		if (node.popups)
		{
			for (var i = 0; i < node.popups.length; i++)
			{
				var popup = node.popups[i];
				popup.type = "popup";
			}
			popupString = JSON.stringify(JSON.parse(popupString).concat(node.popups));
		}

		if (!isIndex)
		{
			if (node.type == 'popup' || parent.type == 'popup')
			{
				node.type = 'popup';
			}
		}

		// add popup pages to node
		if (node.type != "popup" && (node.landing || !node.pages || node.pages.length == 0))
		{
			if (!node.pages)
			{
				node.pages = [];
			}

			var copy:IPageNode[] = JSON.parse(popupString);
			for (var j = 0; j < copy.length; ++j)
			{
				this.parsePopupPage(copy[j], node);
			}
			node.pages = node.pages.concat(copy);
			node.landing = true;
		}

		var page:IPageAsset = new PageAsset(node);

		if (!isIndex)
		{
			page.setParent(parent);
		}

		page.data = node.data;
		page.type = node.type;

		if (node.type == 'popup')
		{
			page.type = 'popup';
		}

		// assets
//		if (node.assets && node.assets.length > 0){
//			page.assets = this.parseAssets(node.assets, page);
//		}

		// child pages
		if (node.pages && node.pages.length > 0)
		{
			page.defaultChild = node.defaultChild;
			page.pages = this.parseChildren(page, node.pages, popupString);
			if (!page.pages[page.defaultChild])
			{
				page.defaultChild = node.pages[0].id;
			}
		}
		// terminal page
		else
		{
			page.landing = true;
		}

		return page;
	}

	private parseAssets(nodes:IAssetNode[], page:IPageAsset):any
	{
		var order:number = 0;
		var assets:any = {};
		// ------- TODO --------
		//var len: number = nodes.length;
		//for (var i: number = 0; i < len; i++) 
		//{
		//	var node: any = nodes[i];
		//	SiteModel.validateNode(node);
		//	assets[node.id] = AssetCreator.create(node, page);
		//	AbstractAsset(assets[node.id]).order = ++order;
		//}
		return assets;
	}

	// Site XML Validation
	public static validateNode(node:IPageNode, isPage:boolean = false):void
	{
		var error:string = "*Invalid Site XML* " + (isPage ? "Page " : "Asset ");
		if (node.id == undefined)
		{
			throw new Error(error + "node missing required attribute 'id'");
		}
//		else if (node.controller == undefined)
//		{
//			throw new Error(error + "node missing required attribute 'controller'");
//		}
	}

	private static invalidBinding(value:string):boolean
	{
		return ((value.indexOf("}") > -1 && value.indexOf("{") == -1) || (value.indexOf("{") > -1 && value.indexOf("}") == -1));
	}
}

export default SiteModel;