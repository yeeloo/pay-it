import IPageAsset from "lib/gaia/interface/IPageAsset";

/**
 * @module Gaia
 * @namespace gaia.core
 * @class BranchManager
 */
class BranchManager
{
	private static activePages:any = {};

	public static addPage(page:IPageAsset):void
	{
		BranchManager.activePages[page.getBranch()] = page;
	}

	public static getTransitionOutArray(newBranch:string):IPageAsset[]
	{
		BranchManager.cleanup();

		newBranch += "/";

		var transitionOutArray:IPageAsset[] = [];

		for (var a in BranchManager.activePages)
		{
			if (BranchManager.activePages.hasOwnProperty(a))
			{
				if (newBranch.indexOf(a + "/") == -1)
				{
					transitionOutArray.push(BranchManager.activePages[a]);
				}
			}
		}

		transitionOutArray.sort(BranchManager.sortByBranchDepth);

		return transitionOutArray;
	}

	public static cleanup():void
	{
		for (var a in BranchManager.activePages)
		{
			if (BranchManager.activePages.hasOwnProperty(a))
			{
				if (!BranchManager.activePages[a].active)
				{
					delete BranchManager.activePages[a];
				}
			}
		}
	}

	private static sortByBranchDepth(a:IPageAsset, b:IPageAsset):number
	{
		var aLen:number = a.getBranch().split("/").length;
		var bLen:number = b.getBranch().split("/").length;

		if (aLen == bLen)
		{
			return 0;

		}

		return aLen < bLen ? -1 : 1;
	}
}

export default BranchManager;