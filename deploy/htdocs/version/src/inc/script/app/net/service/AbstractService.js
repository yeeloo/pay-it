define(["require", "exports"], function (require, exports) {
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
    var AbstractService = (function () {
        /**
         * @constructor
         * @class AbstractService
         * @param {IGateway} gateway
         * @param {boolean} debug
         */
        function AbstractService(gateway, debug) {
            this.gateway = gateway;
            this.debug = debug;
            if (!gateway)
                throw new Error("Gateway cannot be null");
        }
        return AbstractService;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractService;
});
