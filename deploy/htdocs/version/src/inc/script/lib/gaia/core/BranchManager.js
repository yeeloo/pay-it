define(["require", "exports"], function (require, exports) {
    /**
     * @module Gaia
     * @namespace gaia.core
     * @class BranchManager
     */
    var BranchManager = (function () {
        function BranchManager() {
        }
        BranchManager.addPage = function (page) {
            BranchManager.activePages[page.getBranch()] = page;
        };
        BranchManager.getTransitionOutArray = function (newBranch) {
            BranchManager.cleanup();
            newBranch += "/";
            var transitionOutArray = [];
            for (var a in BranchManager.activePages) {
                if (BranchManager.activePages.hasOwnProperty(a)) {
                    if (newBranch.indexOf(a + "/") == -1) {
                        transitionOutArray.push(BranchManager.activePages[a]);
                    }
                }
            }
            transitionOutArray.sort(BranchManager.sortByBranchDepth);
            return transitionOutArray;
        };
        BranchManager.cleanup = function () {
            for (var a in BranchManager.activePages) {
                if (BranchManager.activePages.hasOwnProperty(a)) {
                    if (!BranchManager.activePages[a].active) {
                        delete BranchManager.activePages[a];
                    }
                }
            }
        };
        BranchManager.sortByBranchDepth = function (a, b) {
            var aLen = a.getBranch().split("/").length;
            var bLen = b.getBranch().split("/").length;
            if (aLen == bLen) {
                return 0;
            }
            return aLen < bLen ? -1 : 1;
        };
        BranchManager.activePages = {};
        return BranchManager;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BranchManager;
});
