import IComponentViewModel from "lib/temple/component/IComponentViewModel";
import IEventDispatcher from "lib/temple/events/IEventDispatcher";

interface IComponentController extends IEventDispatcher
{
	viewModel:IComponentViewModel;
	element: HTMLElement;

	setTemplate(template:string): void;
	setViewModel(viewModel:IComponentViewModel): void;

	init(): void;
}

export default IComponentController;