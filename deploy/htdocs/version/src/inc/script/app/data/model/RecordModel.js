define(["require", "exports"], function (require, exports) {
    var RecordModel = (function () {
        function RecordModel() {
            this._records = [];
            this._hash = {};
        }
        RecordModel.prototype.getAll = function () {
            return this._records;
        };
        RecordModel.prototype.get = function (index) {
            if (this.has(index)) {
                return this._hash[index];
            }
            throw new Error("No item found with id '" + index + "'");
            return null;
        };
        RecordModel.prototype.getLatest = function () {
            return this._records[0];
        };
        RecordModel.prototype.has = function (index) {
            return this._records.some(function (el) {
                return el.index === index;
            });
        };
        RecordModel.prototype.add = function (data) {
            if (data.index === void 0) {
                throw new Error("Id is undefined");
            }
            var index = data.index;
            if (index in this._hash) {
                throw new Error("Data with id '" + index + "' already exists");
            }
            this._hash[index] = data;
            this._records.push(data);
        };
        RecordModel.prototype.addList = function (list) {
            list.forEach(this.add.bind(this));
        };
        return RecordModel;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RecordModel;
});
