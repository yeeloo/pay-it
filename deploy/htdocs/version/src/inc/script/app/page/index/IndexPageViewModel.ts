import DefaultPageViewModel from 'app/page/DefaultPageViewModel';
import DataManager from 'app/data/DataManager';
import ko = require('knockout');

class IndexPageViewModel extends DefaultPageViewModel
{
	// declare observables/computed
	
	constructor()
	{
		super();
		
		// initiate observables
		
		// initiate computed
	}
	
	/**
	 *	Destruct your data objects here
	 *	- set your observables to null
	 */
	destruct()
	{
		// Put your cleaning here
		
		super.destruct();
	}
}

export default IndexPageViewModel;