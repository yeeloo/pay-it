import refdef from 'def/ReferenceDefinitions';
import BaseEvent from 'lib/temple/events/BaseEvent';
import IPageAsset from '../interface/IPageAsset';

class BranchLoaderEvent extends BaseEvent
{
	public static LOAD_PAGE:string = "BranchLoaderEvent.LOAD_PAGE";
	public static LOAD_ASSET:string = "BranchLoaderEvent.LOAD_ASSET";
	public static START:string = "BranchLoaderEvent.START";
	public static COMPLETE:string = "BranchLoaderEvent.COMPLETE";

	constructor(type:string, public asset:IPageAsset = null)
	{
		super(type);
	}
}

export default BranchLoaderEvent;