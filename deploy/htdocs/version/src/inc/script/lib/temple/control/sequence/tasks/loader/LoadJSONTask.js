var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/control/sequence/tasks/AbstractTask"], function (require, exports, AbstractTask_1) {
    var LoadJSONTask = (function (_super) {
        __extends(LoadJSONTask, _super);
        /**
         * @param url {string}
         * @param completeCallback
         * @param jsonpCallback {string}
         */
        function LoadJSONTask(url, completeCallback, jsonpCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            if (jsonpCallback === void 0) { jsonpCallback = null; }
            _super.call(this);
            this._url = url;
            this._completeCallback = completeCallback;
            this._jsonpCallback = jsonpCallback;
        }
        LoadJSONTask.prototype.getUrl = function () {
            return this._url;
        };
        LoadJSONTask.prototype.executeTaskHook = function () {
            var _this = this;
            if (this._jsonpCallback) {
                $.ajax({
                    url: this._url,
                    dataType: "jsonp",
                    type: "GET",
                    crossDomain: true,
                    jsonpCallback: this._jsonpCallback,
                    cache: true
                })
                    .done(function (data, textStatus, jqXHR) {
                    if (_this._completeCallback) {
                        _this._completeCallback(data);
                    }
                    _this.done();
                })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    _this.fail('error getting json: \'' + _this._url + '\'');
                });
            }
            else {
                $.getJSON(this._url)
                    .done(function (data) {
                    if (_this._completeCallback) {
                        _this._completeCallback(data);
                    }
                    _this.done();
                })
                    .fail(function () {
                    _this.fail('error getting json: \'' + _this._url + '\'');
                });
            }
        };
        /**
         * @inheritDoc
         */
        LoadJSONTask.prototype.destruct = function () {
            this._url = null;
            this._completeCallback = null;
            this._jsonpCallback = null;
            _super.prototype.destruct.call(this);
        };
        return LoadJSONTask;
    })(AbstractTask_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LoadJSONTask;
});
