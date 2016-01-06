import DefaultPageViewModel from "app/page/DefaultPageViewModel";
import DataManager from "app/data/DataManager";
import ko = require('knockout');
import IRecordData = require('../../data/vo/IRecordData');
import IPayeeData = require('../../data/vo/IPayeeData');

class HomePageViewModel extends DefaultPageViewModel
{
	// declare observables/computed
	//private date = new Date();
	public month:KnockoutObservable<string> = ko.observable('');
	public utilities:KnockoutObservable<number> = ko.observable(0);

	public payee:KnockoutObservableArray<IPayeeData> = ko.observableArray<IPayeeData>(DataManager.getInstance().payeeModel.getAll());
	public selected:KnockoutObservable<number> = ko.observable(0);

	public monthlyDetails:KnockoutObservable<IRecordData> = ko.observable(DataManager.getInstance().recordModel.getLatest());

	constructor()
	{
		super();
		this.month(this.monthlyDetails().month);
		this.utilities(this.monthlyDetails().utilities);
	}

	/*private getCurrentMonth():string
	{
		let month:string = (this.date.getMonth() + 1) < 10? "0" + (this.date.getMonth() + 1) : "" + (this.date.getMonth() + 1);
		return this.date.getFullYear() + "" + month;
	}*/

	destruct()
	{

		super.destruct();
	}
}

export default HomePageViewModel;