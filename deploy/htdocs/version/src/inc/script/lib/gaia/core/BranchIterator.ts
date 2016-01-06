import IPageAsset from "lib/gaia/interface/IPageAsset";
import SiteModel from "lib/gaia/core/SiteModel";

class BranchIterator
{
	private static items:IPageAsset[] = [];
	private static index:number = -1;

	public static init(branch:string):number
	{
		var branchArray:string[] = branch.split("/");
		var page:IPageAsset = SiteModel.getTree();

		BranchIterator.items.length = 0;
		BranchIterator.index = -1;
		BranchIterator.addPage(page);

		for (var i:number = 1; i < branchArray.length; i++)
		{
			BranchIterator.addPage(page = page.pages[branchArray[i]]);
		}

		return BranchIterator.items.length;
	}

	public static next():IPageAsset
	{
		if (++BranchIterator.index < BranchIterator.items.length)
		{
			return BranchIterator.items[BranchIterator.index];
		}
		return null;
	}

	private static addPage(page:IPageAsset):void
	{
		if (page.assets != null)
		{
			//var assets: any[] = page.assetArray;
			//var len: number = assets.length;
			//for (var i: number = 0; i < len; i++)
			//{
			//	items.push(assets[i]);
			//}
		}
		BranchIterator.items.push(page);
	}
}

export default BranchIterator;