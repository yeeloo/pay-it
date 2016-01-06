import refdef from "def/ReferenceDefinitions";
import EventDispatcher from "lib/temple/events/EventDispatcher";
import ConfigManager from "lib/temple/config/ConfigManager";
import configManagerInstance from "lib/temple/config/configManagerInstance";
import AssetID from "app/config/AssetID";
import IManifest from "./resourcemanager/IManifest";
import BaseEvent from "lib/temple/events/BaseEvent";
import DataEvent from "../events/DataEvent";
import Log from "../utils/Log";

/**
 * ResourceManager
 *
 * @module Temple
 * @namespace temple.net
 * @class ResourceManager
 * @author Mient-jan Stelling
 */
class ResourceManager extends EventDispatcher
{
	public static EVENT_ONLOAD_IMAGE = 'onload_image';

	public static cm:ConfigManager = configManagerInstance;

	/**
	 * RegularExpression for checking if a string contains a image path (jpg, png only).
	 *
	 * @todo make a faster regex with less overhead.
	 * @static
	 * @property isImageRegExp
	 * @type RegEx
	 */
	public static isImageRegExp = /[\w\/]+.jpg|[\w\/]+.png$/;

	/**
	 * RegularExpression for checking if a string contains a audio path (mp3, ogg only).
	 *
	 * @todo make a faster regex with less overhead.
	 * @static
	 * @property isAudioRegExp
	 * @type RegEx
	 */
	public static isAudioRegExp = /\.mp3$|\.ogg$/;

	/**
	 * creates and returns a new HTMLImageElement
	 *
	 * @static
	 * @method getImageElement
	 * @param {string} src
	 * @param {function} callback
	 * @returns HTMLImageElement
	 */
	public static getImageElement(src:string, callback?:(img?:HTMLImageElement) => any):HTMLImageElement
	{
		if(DEBUG && typeof(src) != 'string')
		{
			debugger;
		}

		var img = <HTMLImageElement> document.createElement('img');
		img.onload = function(ev:Event)
		{
			callback.call(null, this);
		};
		img.src = src;
		return img
	}

	/**
	 * Creates and returns a HTMLImageElement
	 *
	 * @static
	 * @method getImageElementByID
	 * @param string id ConfigManager var identifier
	 * @param Function callback Called when image is loaded.
	 * @returns {HTMLImageElement}
	 */
	public static getImageElementByID(id:AssetID, callback?:(img?:HTMLImageElement) => any):HTMLImageElement
	{
		return ResourceManager.getImageElement(ResourceManager.cm.getURL(AssetID[id]), callback);
	}

	/**
	 * @static
	 * @method getManifest
	 * @param list
	 * @returns {IManifest[]}
	 */
	public static getManifestByAssetIDList(list:AssetID[]):IManifest[]
	{
		var cm = configManagerInstance;
		var manifest = [];
		for(var i = 0; i < list.length; i++)
		{
			var src = cm.getURL(AssetID[list[i]]);
			manifest.push({
				id: ResourceManager.hashCode(src),
				src: src
			});
		}

		return manifest;
	}

	/**
	 * @static
	 * @method getManifest
	 * @param list
	 * @returns {IManifest[]}
	 */
	public static getManifestBySrcList(list:string[]):IManifest[]
	{
		var manifest = [];
		for(var i = 0; i < list.length; i++)
		{
			var src = list[i];
			manifest.push({
				id: ResourceManager.hashCode(src),
				src: src
			});
		}

		return manifest;
	}

	/**
	 * Convert string to (h\d+)
	 * @param str
	 * @returns {*}
	 */
	public static hashCode(str):string
	{
		var hash = 0, i, chr, len;
		if(str.length == 0)
		{
			return 'h' + hash;
		}
		for(i = 0, len = str.length; i < len; i++)
		{
			chr = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return 'h' + hash;
	}

	/**
	 *
	 */
	private static _instance:ResourceManager;

	/**
	 * @static
	 * @method getInstance
	 * @returns {ResourceManager}
	 */
	public static getInstance():ResourceManager
	{
		if(!ResourceManager._instance)
		{
			ResourceManager._instance = new ResourceManager();
		}

		return ResourceManager._instance;
	}

	private _assets:{[url:string]:any} = {};

	constructor()
	{
		super();

		if(ResourceManager._instance)
		{
			throw new Error('ResourceManager is a singleton. use getInstance();');
		}

		if(typeof createjs != 'undefined'
			&& typeof createjs.Sound != 'undefined')
		{
			createjs.Sound.addEventListener("fileload", (event:createjs.Event) => this.handleFileLoad(event));
		}
	}

	/**
	 * @method load
	 * @param {any[]} list
	 * @return void
	 */
	public load(assetList:any[], onProcess:(event:createjs.Event) => void = null, onComplete:(event:createjs.Event) => void = null):void
	{
		if(typeof createjs == 'undefined' && typeof createjs.LoadQueue == 'undefined')
		{
			throw new Error('can not us resource manager, createjs.LoadQueue is not loaded.')
		}

		var type = typeof assetList[0];
		var manifest:IManifest[];

		switch(type)
		{
			case 'number':
			{
				manifest = ResourceManager.getManifestByAssetIDList(<AssetID[]> assetList);
				break;
			}
			case 'string':
			{
				manifest = ResourceManager.getManifestBySrcList(<string[]> assetList );
				break;
			}
		}

		for(var i = 0; i < manifest.length; i++)
		{
			if(this._assets[manifest[i].id])
			{
				manifest.splice(i, 1);
			}
		}

		var loader = new createjs.LoadQueue(false);

		if(typeof createjs != 'undefined' && typeof createjs.Sound != 'undefined')
		{
			loader.installPlugin(<any> createjs.Sound);
		}

		loader.addEventListener("error", (event:createjs.Event) => this.handleLoadError(event));
		loader.addEventListener("progress", (event:createjs.Event) =>
		{
			if(onProcess)
			{
				onProcess(event);
			}
			this.handleProgress(event);
		});

		loader.addEventListener("fileload", (event:createjs.Event) => this.handleFileLoad(event));
		loader.addEventListener("complete", (event:createjs.Event) =>
		{
			if(onComplete)
			{
				onComplete(event);
			}
			this.handleComplete(event);
		});

		loader.loadManifest(manifest);
	}

	/**
	 * Load images in async
	 *
	 * @method loadImagesAsync
	 * @param assetList
	 * @param onProgress Gives the progress of how many images are loaded. Will not give back 100 when a image is not
	 *          able to load for example when the src of image is incorrect.
	 * @param list
	 * @returns {[id:string]:HTMLImageElement}
	 */
	public loadImagesAsync(assetList:any[], onProgress:(percent:number) => any = null, list:{[id:string]:HTMLImageElement
	} = {}):void
	{
		var type = typeof assetList[0];
		var manifest:IManifest[];

		switch(type)
		{
			case 'number':
			{
				manifest = ResourceManager.getManifestByAssetIDList(<AssetID[]> assetList);
				break;
			}
			case 'string':
			{
				manifest = ResourceManager.getManifestBySrcList(<string[]> assetList );
				break;
			}
		}
		var assets = 0;

		if(onProgress)
		{
			var loaded = 0;
			var onLoad = () =>
			{
				loaded++;
				onProgress(loaded / assets * 100);
			}
		}

		for(var i = 0; i < manifest.length; i++)
		{
			if(!ResourceManager.isImageRegExp.test(manifest[i].src))
			{
				throw "loadasynch only has support for images " + manifest[i].id + " does not contain a image resource.";
			}

			if(!this._assets[manifest[i].id])
			{
				assets++;
				this._assets[manifest[i].id] = ResourceManager.getImageElement(manifest[i].src, onLoad);
			} else {

			}

			list[manifest[i].id] = this._assets[manifest[i].id];
		}

		if( assets == loaded ){
			assets++;
			onLoad();
		}
	}

	private handleLoadError(event:createjs.Event)
	{
		Log.error('Temple.Net.ResourceManager', "Error loading", event);
	}

	private handleFileLoad(event:createjs.Event)
	{
		this._assets[ResourceManager.hashCode(event.item.src)] = event.result;
	}

	private handleComplete(event:createjs.Event)
	{
		this.dispatchEvent(new BaseEvent('complete'));
	}

	private handleProgress(event:createjs.Event)
	{
		this.dispatchEvent(new DataEvent<createjs.Event>('progress', event));
	}

	/**
	 * Returns
	 *
	 * @method getByID
	 * @param id
	 * @returns {*}
	 */
	public getByID(id:string):any
	{
		var src = configManagerInstance.getURL(id);

		if(this._assets[ResourceManager.hashCode(src)] == void 0)
		{
			if(ResourceManager.isImageRegExp.test(src))
			{
				this._assets[src] = ResourceManager.getImageElement(src);
			}
		}

		return this._assets[src];
	}

	/**
	 * Returns
	 *
	 * @method getByID
	 * @param id
	 * @returns {*}
	 */
	public getByAssetID(id:AssetID):any
	{
		return this.getByID(AssetID[id]);
	}


	/**
	 * Returns
	 *
	 * @method getByID
	 * @param id
	 * @returns {*}
	 */
	public getByImageByAssetID(id:AssetID, onLoad:(e:DataEvent<HTMLImageElement>) => any):any
	{
		var strId = AssetID[id];
		var src = configManagerInstance.getURL(strId);

		return this.getByImageBySrc(src, onLoad)
	}

	public getByImageBySrc(src:string, onLoad:(e:DataEvent<HTMLImageElement>) => any):any
	{
		var hashCode = ResourceManager.hashCode(src);
		var eventId = ResourceManager.EVENT_ONLOAD_IMAGE + '.' + hashCode;

		if(this._assets[hashCode] == void 0)
		{
			this.addEventListener(eventId, <(e:BaseEvent) => any> onLoad, null, true);
			this._assets[hashCode] = ResourceManager.getImageElement(
				src,
				(img:HTMLImageElement) => this.dispatchEvent( new DataEvent<HTMLImageElement>(eventId, img) )
			);
		}
		else
		{
			var asset = this._assets[hashCode];
			var hasContent = !!(asset && (asset.complete || asset['getContext'] || asset.readyState >= 2));

			if(!hasContent)
			{
				this.addEventListener(eventId, <(e:DataEvent<HTMLImageElement>) => any> onLoad, null, true);
			}
			else
			{
				onLoad.call(null, new DataEvent<HTMLImageElement>(eventId, asset));
			}
		}

		return this._assets[hashCode];
	}


}

export  = ResourceManager;