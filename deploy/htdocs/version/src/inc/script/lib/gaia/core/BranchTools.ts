import IPageAsset from "lib/gaia/interface/IPageAsset";
import SiteModel from "lib/gaia/core/SiteModel";

/**
 * @module Gaia
 * @namespace gaia.core
 * @class BranchTools
 */
class BranchTools
{
	/**
	 * Gets the page belonging to the given branch.
	 * Starts with the index page and recursively checks the children until the branch is resolved or no subpage is found
	 *
	 * @static
	 * @method getPage
	 * @param {string} branch
	 * @returns {PageAsset}
	 */
	public static getPage(branch:string):IPageAsset
	{
		// strip the querystring from the branch
		branch.split('?').shift();

		// split into segments
		var branchArray:string[] = branch.split("/");

		// if not started with index/, add it to the array
		if (branchArray[0] != SiteModel.getIndexID())
		{
			branchArray.unshift(SiteModel.getIndexID());
		}

		// get the starting point
		var page:IPageAsset = SiteModel.getTree();

		// iterate over all branch segments
		for (var i:number = 1; i < branchArray.length; i++)
		{
			// if we can find a subpage with the correct id
			if (page.pages && page.pages[branchArray[i]])
			{
				// continue searcing from the subpage
				page = page.pages[branchArray[i]];
			}
			else
			{
				// no valid subpage is found, the rest is deeplink
				break;
			}
		}

		return page;
	}

	/**
	 * Gets a valid branch defined in the sitemap from the given branch
	 *
	 * @static
	 * @method getValidBranch
	 * @param {string} branch
	 * @param {boolean} getDefault
	 * @returns {string}
	 */
	public static getValidBranch(branch:string, getDefault:boolean = true):string
	{
		// use the page resolver to get a valid branch
		var validBranch = BranchTools.getPage(branch).getBranch();

		// checks if there is a subpage and we are not landing on this page
		return getDefault ? BranchTools.getDefaultChildBranch(validBranch) : validBranch;
	}

	/**
	 * Checks if the branch path is valid and returns the branch.
	 * When not valid, return the valid branch
	 *
	 * @static
	 * @method getFullBranch*
	 * @param {string} branch
	 * @returns {string}
	 */
	public static getFullBranch(branch:string):string
	{
		var validBranch:string = BranchTools.getValidBranch(branch);

		// when valid branch is in the branch, this branch is valid (with an optional deeplink)
		if (branch.indexOf(validBranch) > -1)
		{
			return branch;
		}
		else
		{
			// when the branch is not valid, return the validBranch
			return validBranch;
		}
	}

	/**
	 * Returns the deeplink part of a branch
	 *
	 * @static
	 * @method getBranchDeeplink
	 * @param branch
	 * @returns {string}
	 */
	public static getBranchDeeplink(branch:string):string
	{
		var validBranch:string = BranchTools.getValidBranch(branch);

		return branch.substr(validBranch.length);
	}

	/**
	 * Returns all pages in the branch path.
	 * Useful for transitioning all pages.
	 *
	 * @static
	 * @method getPagesOfBranch
	 * @param branch
	 * @returns {*[]}
	 */
	public static getPagesOfBranch(branch:string):IPageAsset[]
	{
		branch = BranchTools.getValidBranch(branch);

		// get path segments
		var branchArray:string[] = branch.split("/");
		var pageArray:any[] = [];

		// get starting page
		var page:IPageAsset = SiteModel.getTree();
		pageArray.push(page);

		// push all subpages in this branch
		for (var i:number = 1; i < branchArray.length; i++)
		{
			pageArray.push(page = page.pages[branchArray[i]]);
		}

		return pageArray;
	}

	/**
	 * Checks if a page has a default child branch.
	 *
	 * @static
	 * @method getDefaultChildBranch
	 * @param branch
	 * @returns {string}
	 */
	public static getDefaultChildBranch(branch:string):string
	{
		// gets the page for this branch
		var page:IPageAsset = BranchTools.getPage(branch);

		// if we can land on this page or there are no default childs, return the original branch
		if (page.landing || page.defaultChild == null)
		{
			return branch;
		}
		else
		{
			// call this function recursively for the default child
			return BranchTools.getDefaultChildBranch(page.pages[page.defaultChild].getBranch());
		}
	}

	/**
	 * Returns a valid valid branch to the popupId
	 *
	 * @static
	 * @method getPopupBranch
	 * @param popupId
	 * @param branch The 'current' branch path
	 * @returns {string}
	 */
	public static getPopupBranch(popupId:string, branch:string):string
	{
		var validBranch = BranchTools.getValidBranch(branch, false);

		var currentBranchArray:string[] = validBranch.split('/');

		// first remove all the current popup segments
		while (this.getPage(currentBranchArray.join('/')).type == 'popup')
		{
			currentBranchArray.pop();
		}

		// then add the passed popupId to the valid branch
		return currentBranchArray.join('/') + (popupId ? '/' + popupId : '');
	}

	/**
	 * It has support for absolute paths, starting with a /, or relative paths. You can also use ./ or ../ to go a level up.
	 * The starting / is optional
	 * Starting with a . makes it relative
	 *
	 * Starting with 'index/home/detail'
	 * index/home       >> index/home
	 * /index/home      >> index/home
	 * .                >> index/home/detail
	 * ./foo            >> index/home/detail/foo
	 * ..               >> index/home
	 * ../foo           >> index/home/foo
	 *
	 * @param branch {string} The branch to resolve relative to the current branch
	 * @param resolveFromBranch {string} The branch to resolve from
	 * @returns {string}
	 */
	public static resolveBranch(branch:string, resolveFromBranch:string):string
	{
		// add support for relative paths
		if (branch.charAt(0) == '.')
		{
			var currentPath:string[] = resolveFromBranch.split('/');
			var instructions:string[] = branch.split('/');

			for (var i = 0; i < instructions.length; ++i)
			{
				switch (instructions[i])
				{
					// current, do nothing
					case '.':
					{
						break;
					}
					// parent, remove last
					case '..':
					{
						currentPath.pop();
						break;
					}
					// add child
					default:
					{
						if (instructions[i] != '')
						{
							currentPath.push(instructions[i]);
						}
						break;
					}
				}
			}

			branch = currentPath.join('/')
		}

		if (branch.charAt(0) == '/')
		{
			branch = branch.substr(1);
		}

		return branch;
	}

}

export default BranchTools;