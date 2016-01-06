import IComponentController from "lib/temple/component/IComponentController";
import IDestructible from "lib/temple/core/IDestructible";

interface IComponentViewModel extends IDestructible
{
	controller:IComponentController;
	setController(controller:IComponentController);
}

export default IComponentViewModel;