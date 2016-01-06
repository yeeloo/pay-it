define(["require", "exports"], function (require, exports) {
    /**
     * NETWORK_EMPTY	    0	There is no data yet.  The readyState is also HAVE_NOTHING.
     * NETWORK_IDLE	        1
     * NETWORK_LOADING	    2	The media is loading.
     * NETWORK_NO_SOURCE[1]	3
     *
     * @enum NetworkStateEnum
     */
    var NetworkStateEnum;
    (function (NetworkStateEnum) {
        NetworkStateEnum[NetworkStateEnum["EMPTY"] = 0] = "EMPTY";
        NetworkStateEnum[NetworkStateEnum["IDLE"] = 1] = "IDLE";
        NetworkStateEnum[NetworkStateEnum["LOADING"] = 2] = "LOADING";
        NetworkStateEnum[NetworkStateEnum["NO_SOURCE"] = 3] = "NO_SOURCE";
    })(NetworkStateEnum || (NetworkStateEnum = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NetworkStateEnum;
});
