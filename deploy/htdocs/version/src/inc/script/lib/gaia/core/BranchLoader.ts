import EventDispatcher from "lib/temple/events/EventDispatcher";
import BaseEvent from "lib/temple/events/BaseEvent";
import CommonEvent from "lib/temple/events/CommonEvent";
import * as utils from "lib/temple/utils/Utils";

import BranchIterator from "../core/BranchIterator";
import IPageAsset from "../interface/IPageAsset";
import GaiaEvent from "../events/GaiaEvent";
import BranchLoaderEvent from "../events/BranchLoaderEvent";
import AssetEvent from "../events/AssetEvent";

class BranchLoader extends EventDispatcher
{
	private percLoaded:number;
	private eachPerc:number;
	private current:number;
	private loaded:number;
	private total:number;

	private loadedFiles:number;
	private totalFiles:number;
	private actualLoaded:number;
	private actualTotal:number;

	private _currentAsset:IPageAsset;

	constructor()
	{
		super();
	}

	public loadBranch(branch:string):void
	{
		this.percLoaded = this.eachPerc = this.loaded = this.total = this.loadedFiles = this.totalFiles = this.actualLoaded = this.actualTotal = 0;
		this.total = 0;
		this.totalFiles = BranchIterator.init(branch);

		this.actualTotal = this.getActualTotal(branch);
		this.totalFiles = BranchIterator.init(branch);
		this.current = -1;
		this.eachPerc = 1 / this.actualTotal;

		if (this.hasEventListener(BranchLoaderEvent.START))
		{
			this.dispatchEvent(new BranchLoaderEvent(BranchLoaderEvent.START));
		}
		this.loadNext();
	}

	public getCurrentAsset():IPageAsset
	{
		return this._currentAsset;
	}

	public interrupt():void
	{
		//this._currentAsset.abort();
		//this._currentAsset.destroy();
		this.total = this.loaded;
		this.totalFiles = this.loadedFiles;
		this.actualTotal = this.actualLoaded;
		this.dispatchComplete();
	}

	private loadNext():void
	{
		this._currentAsset = BranchIterator.next();
		if (this._currentAsset && !this._currentAsset.active)
		{
			this._currentAsset._onProgressDelegate = <(event:BaseEvent) => any>this.onProgress.bind(this);
			this._currentAsset._onCompleteDelegate = <(event:BaseEvent) => any>this.onComplete.bind(this);
			this._currentAsset._onErrorDelegate = <(event:BaseEvent) => any>this.onError.bind(this);

			this._currentAsset.addEventListener(AssetEvent.ASSET_PROGRESS, this._currentAsset._onProgressDelegate);
			this._currentAsset.addEventListener(AssetEvent.ASSET_COMPLETE, this._currentAsset._onCompleteDelegate);
			this._currentAsset.addEventListener(AssetEvent.ASSET_ERROR, this._currentAsset._onErrorDelegate);

			this._currentAsset.init();
			this.dispatchEvent(new BranchLoaderEvent(BranchLoaderEvent.LOAD_PAGE, this._currentAsset));
		}
		else
		{
			this.next(true);
		}
	}

	private onProgress(event:AssetEvent):void
	{
		if (isNaN(event.perc))
		{
			event.perc = 0;
		}
		this.percLoaded = Math.round(((this.actualLoaded * this.eachPerc) + (this.eachPerc * event.perc)) * 1000) / 1000;
		this.dispatchProgress();
	}

	private onComplete(event:AssetEvent):void
	{
		this.removeAssetListeners(event.asset);
		this.next();
	}

	private onError(event:AssetEvent):void
	{
		this.removeAssetListeners(this._currentAsset);
		this.next();
	}

	private next(skip:boolean = false):void
	{
		++this.loadedFiles;
		if (!skip)
		{
			++this.actualLoaded;
		}
		if (this.loadedFiles < this.totalFiles)
		{
			this.percLoaded = Math.round(Math.min(1, (this.actualLoaded * this.eachPerc)) * 1000) / 1000;
			this.loadNext();
		}
		else
		{
			this.total = this.loaded;
			this.totalFiles = this.loadedFiles;
			this.actualTotal = this.actualLoaded;
			this.dispatchComplete();
		}
	}

	private dispatchProgress():void
	{
		this.dispatchEvent(new AssetEvent(AssetEvent.ASSET_PROGRESS, this._currentAsset, this.actualLoaded - 1, this.actualTotal, this.percLoaded, false));
	}

	private dispatchComplete():void
	{
		this.dispatchEvent(new CommonEvent(CommonEvent.COMPLETE));
	}

	private removeAssetListeners(asset:IPageAsset):void
	{
		asset.removeEventListener(AssetEvent.ASSET_PROGRESS, asset._onProgressDelegate);
		asset.removeEventListener(AssetEvent.ASSET_COMPLETE, asset._onCompleteDelegate);
		asset.removeEventListener(AssetEvent.ASSET_ERROR, asset._onErrorDelegate);
	}

	private getActualTotal(branch:string):number
	{
		var count:number = 0;
		BranchIterator.init(branch);
		while (true)
		{
			var asset = BranchIterator.next();
			if (asset == null)
			{
				break;
			}
			else if (!asset.active)
			{
				count++;
			}
		}
		return count;
	}
}

export default BranchLoader;