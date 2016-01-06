import IDebuggable from "lib/temple/core/IDebuggable";
import IGatewayResult from "./result/IGatewayResult";

import IDestructible from "lib/temple/core/IDestructible";
import Promise = require("bluebird");

import IGatewayOptions from "./IGatewayOptions";
import IGatewayCallOptions from "./IGatewayCallOptions";

interface IGateway extends IDestructible, IDebuggable
{
	getOptions():IGatewayOptions;

	setOptions(options:IGatewayOptions):void;

	execute(action:string, data?:any, options?:IGatewayCallOptions):Promise<IGatewayResult<any>>;

	get(action:string, data?:any, options?:IGatewayCallOptions):Promise<IGatewayResult<any>>;

	post(action:string, data:any, options?:IGatewayCallOptions):Promise<IGatewayResult<any>>;

	put(action:string, data:any, options?:IGatewayCallOptions):Promise<IGatewayResult<any>>;

	patch(action:string, data:any, options?:IGatewayCallOptions):Promise<IGatewayResult<any>>;

	delete(action:string, data?:any, options?:IGatewayCallOptions):Promise<IGatewayResult<any>>;
}

export default IGateway;