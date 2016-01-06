import DefaultPageController from "../DefaultPageController";
import HomePageViewModel from "app/page/home/HomePageViewModel";

import ko = require('knockout');
import * as Gaia from "lib/gaia/api/Gaia";

class HomePageController extends DefaultPageController
{
	viewModel: HomePageViewModel;
	
	constructor()
	{
		super();
	}

	/**
	 *	After calling super.init, your pages DOM is ready
	 */
	init()
	{
		super.init();
	}

	private togglePayee(index:number)
	{
		this.viewModel.selected(index);
	}

	destruct()
	{
		// Put your cleaning here
		
		// always call this last
		super.destruct();
	}
}

export default HomePageController;