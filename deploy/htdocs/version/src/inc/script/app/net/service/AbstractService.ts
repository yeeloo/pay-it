import IGateway from "app/net/gateway/IGateway";
import IDebuggable from "lib/temple/core/IDebuggable";

/**
 * Extend this class and use typed methods to execute gateway calls.
 *
 * Example:
 * ```
 * public getNotes():Promise<IGatewayResult<any>>
 * {
 * 	    return this.gateway.get('/notes')
 * }
 *
 * public createNote(title:string):Promise<IGatewayResult<any>>
 * {
 * 	    return this.gateway.post('/notes', {
 * 	    	"title": title
 * 	    })
 * }
 *
 * public getNote(id:string):Promise<IGatewayResult<any>>
 * {
 * 	    return this.gateway.get('/notes/' + id);
 * }
 *
 * public removeNote(id:string):Promise<IGatewayResult<any>>
 * {
 * 	    return this.gateway.delete('/notes/' + id);
 * }
 * ```
 *
 * @class AbstractService
 */
class AbstractService implements IDebuggable
{
	/**
	 * @constructor
	 * @class AbstractService
	 * @param {IGateway} gateway
	 * @param {boolean} debug
	 */
	constructor(public gateway:IGateway, public debug:boolean)
	{
		if (!gateway) throw new Error("Gateway cannot be null");
	}
}

export default AbstractService;