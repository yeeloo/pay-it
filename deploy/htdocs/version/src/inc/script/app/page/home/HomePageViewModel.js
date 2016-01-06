var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "app/page/DefaultPageViewModel", "app/data/DataManager", 'knockout'], function (require, exports, DefaultPageViewModel_1, DataManager_1, ko) {
    var HomePageViewModel = (function (_super) {
        __extends(HomePageViewModel, _super);
        function HomePageViewModel() {
            _super.call(this);
            // declare observables/computed
            //private date = new Date();
            this.month = ko.observable('');
            this.utilities = ko.observable(0);
            this.payee = ko.observableArray(DataManager_1.default.getInstance().payeeModel.getAll());
            this.selected = ko.observable(0);
            this.monthlyDetails = ko.observable(DataManager_1.default.getInstance().recordModel.getLatest());
            this.month(this.monthlyDetails().month);
            this.utilities(this.monthlyDetails().utilities);
        }
        /*private getCurrentMonth():string
        {
            let month:string = (this.date.getMonth() + 1) < 10? "0" + (this.date.getMonth() + 1) : "" + (this.date.getMonth() + 1);
            return this.date.getFullYear() + "" + month;
        }*/
        HomePageViewModel.prototype.destruct = function () {
            _super.prototype.destruct.call(this);
        };
        return HomePageViewModel;
    })(DefaultPageViewModel_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HomePageViewModel;
});
