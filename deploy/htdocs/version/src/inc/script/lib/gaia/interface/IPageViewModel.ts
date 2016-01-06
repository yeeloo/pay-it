import IPageController from "lib/gaia/interface/IPageController";
import IComponentViewModel from "lib/temple/component/IComponentViewModel";

interface IPageViewModel extends IComponentViewModel
{
	controller:IPageController;
	setController(value:IPageController):void;
}

export default IPageViewModel;