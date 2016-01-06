define(["require", "exports"], function (require, exports) {
    var RouteResultItem = (function () {
        function RouteResultItem(results, route) {
            for (var i = 0; i < results.length; i++) {
                this[i] = results[i];
            }
            this.route = route;
            this.length = results.length;
        }
        RouteResultItem.prototype.equals = function (item) {
            if (!item) {
                return false;
            }
            if (this.length != item.length) {
                return false;
            }
            for (var i = 0; i < this.length; i++) {
                var thisRouteResult = this[i];
                var itemRouteResult = item[i];
                if (thisRouteResult.branch != itemRouteResult.branch) {
                    return false;
                }
                if (!thisRouteResult.deeplink && !itemRouteResult.deeplink) {
                    continue;
                }
                if (thisRouteResult.deeplink && !itemRouteResult.deeplink) {
                    return false;
                }
                if (!thisRouteResult.deeplink && itemRouteResult.deeplink) {
                    return false;
                }
                for (var j in thisRouteResult.deeplink) {
                    if (thisRouteResult.deeplink.hasOwnProperty(j)) {
                        if (itemRouteResult.deeplink[j] != thisRouteResult.deeplink[j]) {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
                for (j in itemRouteResult.deeplink) {
                    if (thisRouteResult.deeplink.hasOwnProperty(j)) {
                        if (itemRouteResult.deeplink[j] != thisRouteResult.deeplink[j]) {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
            }
            return true;
        };
        return RouteResultItem;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RouteResultItem;
});
