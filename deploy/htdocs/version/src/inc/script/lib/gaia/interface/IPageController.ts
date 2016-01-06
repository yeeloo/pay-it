import IComponentController from "lib/temple/component/IComponentController";

import IPageAsset from "../interface/IPageAsset";
import GaiaHistoryEvent from "../events/GaiaHistoryEvent";

interface IPageController extends IComponentController
{
	page: IPageAsset;

	transition(): void;
	transitionIn(): void;
	transitionInComplete(): void;
	transitionOut(): void;
	transitionOutComplete(): void;

	onDeeplink(event:GaiaHistoryEvent): void;
}

export default IPageController;