import refdef from 'def/ReferenceDefinitions';
import BaseEvent from 'lib/temple/events/BaseEvent';
import IPageAsset from '../interface/IPageAsset';

class AssetEvent extends BaseEvent
{
	public static ASSET_COMPLETE:string = "AssetEvent.ASSET_COMPLETE";
	public static ASSET_PROGRESS:string = "AssetEvent.ASSET_PROGRESS";
	public static ASSET_ERROR:string = "AssetEvent.ASSET_ERROR";

	constructor(type:string, public asset:IPageAsset = null, public loaded:number = 0, public total:number = 0, public perc:number = 0, public bytes:boolean = false)
	{
		super(type);
	}
}

export default AssetEvent;