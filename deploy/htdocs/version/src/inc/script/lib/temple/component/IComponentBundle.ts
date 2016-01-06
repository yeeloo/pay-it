import IComponentController from "lib/temple/component/IComponentController";
import IComponentViewModel from "lib/temple/component/IComponentViewModel";

interface IComponentBundle {
	controller:any;
	viewmodel:any;
	template?:string;
}

export default IComponentBundle;