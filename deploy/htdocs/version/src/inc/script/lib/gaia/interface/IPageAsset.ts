import IRoute from "lib/gaia/interface/IRoute";
import IPageController from "lib/gaia/interface/IPageController";
import IEventDispatcher from "lib/temple/events/IEventDispatcher";
import BaseEvent from "lib/temple/events/BaseEvent";

interface IPageAsset extends IEventDispatcher
{
	defaultChild:string;
	landing:boolean;
	active:boolean;

	id:string;
	title:string;
	container:string;
	controllerName:string;
	viewModelName:string;
	template:string;
	type:string;
	data:any;
	partials:{
		app?: string[];
		mobile?: string[];
	};

	pages:{
		[index: string]: IPageAsset;
	};
	assets:{
		[index: string]: IPageAsset;
	};

	isTransitionedIn:boolean;

	_onProgressDelegate:(event:BaseEvent) => any;
	_onCompleteDelegate:(event:BaseEvent) => any;
	_onErrorDelegate:(event:BaseEvent) => any;

	_onGaiaHistoryDelegate:(event:BaseEvent) => any;
	_onTransitionCompleteDelegate:(event:BaseEvent) => any;
	_onTransitionInCompleteDelegate:(event:BaseEvent) => any;
	_onTransitionOutCompleteDelegate:(event:BaseEvent) => any;

	init():void;

	getBranch():string;
	getContent():IPageController;
	getData(key?:string, inherit?:boolean):any;

	setParent(value:IPageAsset):void;
	getParent():IPageAsset;

	preload():void;

	initPage():void;

	transition():void;
	transitionIn():void;
	transitionOut():void;

	onComplete():void;
}

export default IPageAsset;