import DefaultPageController from 'app/page/DefaultPageController';
import IndexPageViewModel from 'app/page/index/IndexPageViewModel';

import ko = require('knockout');
import * as Gaia from 'lib/gaia/api/Gaia';
import DataManager from 'app/data/DataManager';

class IndexPageController extends DefaultPageController
{
	viewModel: IndexPageViewModel; 
	
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
	
	/**
	 *	Destruct your page objects here
	 *	- call destruct() on your own objects
	 *	- clear global event listeners (window.resize, window.scroll, window.keydown, etc)
	 *	- clear timeouts/intervals
	 *	- do null-checks on your objects before destructing them, and set them to null afterwards
	 */
	destruct()
	{
		// Put your cleaning here
		
		// always call this last
		super.destruct();
	}
}

export default IndexPageController;