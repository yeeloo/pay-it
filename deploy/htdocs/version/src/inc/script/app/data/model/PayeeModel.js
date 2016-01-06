define(["require", "exports"], function (require, exports) {
    var PayeeModel = (function () {
        function PayeeModel() {
            this._payees = [];
            this._hash = {};
        }
        PayeeModel.prototype.getAll = function () {
            return this._payees;
        };
        PayeeModel.prototype.get = function (index) {
            if (this.has(index)) {
                return this._hash[index];
            }
            throw new Error("No item found with id '" + index + "'");
            return null;
        };
        PayeeModel.prototype.has = function (index) {
            return this._payees.some(function (el) {
                return el.index === index;
            });
        };
        PayeeModel.prototype.add = function (data) {
            if (data.index === void 0) {
                throw new Error("Id is undefined");
            }
            var index = data.index;
            if (index in this._hash) {
                throw new Error("Data with id '" + index + "' already exists");
            }
            this._hash[index] = data;
            this._payees.push(data);
        };
        PayeeModel.prototype.addList = function (list) {
            list.forEach(this.add.bind(this));
        };
        return PayeeModel;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PayeeModel;
});
