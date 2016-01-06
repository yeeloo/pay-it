import IRouteResult from "./IRouteResult";

interface IRouteResultItem
{
	[key: number]: IRouteResult;

	route?:string;
	length?:number;

	equals(item:IRouteResultItem):boolean;
}

export default IRouteResultItem;