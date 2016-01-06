import IDestructible from "lib/temple/core/IDestructible";
import Flow from "../flow/Flow";
import GaiaEvent from "../events/GaiaEvent";
import PageEvent from "../events/PageEvent";
import IPageAsset from "../interface/IPageAsset";
import IRoute from "../interface/IRoute";

interface IGaia
{
	goto(branch:string, deeplink?:{[param:string]: any;}, flow?:Flow, replace?:boolean):void;
	gotoDeeplink(deeplink?:{[param:string]: any;}, replace?:boolean):void;

	// data-gaia-goto-route
	gotoRoute(route:string, replace?:boolean):void;

	// data-gaia-goto-popup
	gotoPopup(popupId:string, deeplink?:{[param:string]:any}):void;
	closePopup(): void;

	getCurrentBranch(): string;
	getCurrentRoute(): string;
	getDeeplink(): {[param:string]:any};
	getRoute():string;
	getParam(key?:string, route?:IRoute, deeplink?:string):any;
	getValidBranch(branch:string): string;
	getPage(branch:string): IPageAsset;
	getDepthContainer(name:string): HTMLDivElement;

	// data-gaia-back
	back(): void;
	// data-gaia-forward
	forward(): void;
	// data-gaia-jump
	jump(steps:number): void;

	beforeGoto(target:(event:GaiaEvent) => void, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	afterGoto(target:(event:GaiaEvent) => void, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	beforeTransitionOut(target:(event:GaiaEvent) => void, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	afterTransitionOut(target:(event:GaiaEvent) => void, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	beforeTransition(target:(event:GaiaEvent) => void, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	afterTransition(target:(event:GaiaEvent) => void, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	beforeTransitionIn(target:(event:GaiaEvent) => void, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	afterTransitionIn(target:(event:GaiaEvent) => void, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	afterComplete(target:(event:GaiaEvent) => void, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;

	removeBeforeGoto(target:(event:GaiaEvent) => void): void;
	removeAfterGoto(target:(event:GaiaEvent) => void): void;
	removeBeforeTransitionOut(target:(event:GaiaEvent) => void): void;
	removeAfterTransitionOut(target:(event:GaiaEvent) => void): void;
	removeBeforeTransition(target:(event:GaiaEvent) => void): void;
	removeAfterTransition(target:(event:GaiaEvent) => void): void;
	removeBeforeTransitionIn(target:(event:GaiaEvent) => void): void;
	removeAfterTransitionIn(target:(event:GaiaEvent) => void): void;
	removeAfterComplete(target:(event:GaiaEvent) => void): void;

	addDeeplinkListener(target:(event:GaiaEvent) => void): IDestructible;
	removeDeeplinkListener(target:(event:GaiaEvent) => void): void;

	addPageInitListener(target:(event:PageEvent) => void): IDestructible;
	removePageInitListener(target:(event:PageEvent) => void): void;

	isReady():boolean;
}

export default IGaia;