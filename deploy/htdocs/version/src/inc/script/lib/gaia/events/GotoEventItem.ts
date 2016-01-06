import IRouteResultItem from "lib/gaia/router/IRouteResultItem";
import Flow from "../flow/Flow";

class GotoEventItem
{
	public type:string;
	public routeResult:IRouteResultItem;
	public external:boolean;
	public src:string;
	public flow:Flow = null;
	public window:string = "_self";
	public queryString:string = null;
	public replace:boolean = false;

	constructor()
	{

	}
}

export default GotoEventItem;