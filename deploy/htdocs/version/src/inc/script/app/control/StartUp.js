define(["require", "exports", "app/data/DataManager", 'knockout', "lib/temple/config/configManagerInstance", "app/config/config", "app/config/Routes", "lib/temple/control/sequence/Sequence", "lib/temple/control/sequence/tasks/MethodTask", "app/control/DevBarTask", 'lib/temple/utils/Log', "app/control/InitLocaleTask", 'lib/temple/control/sequence/tasks/loader/LoadJSONByNameTask'], function (require, exports, DataManager_1, ko, configManagerInstance_1, config_1, Routes_1, Sequence_1, MethodTask_1, DevBarTask_1, Log_1, InitLocaleTask_1, LoadJSONByNameTask_1) {
    /**
     * @namespace app.control
     * @class StartUp
     */
    var StartUp = (function () {
        /**
         * Initializes knockout allowBindings
         *
         * @class StartUp
         * @constructor
         */
        function StartUp() {
            this._log = new Log_1.default('app.control.StartUp');
            window['ko'] = ko;
        }
        StartUp.prototype.execute = function (callback) {
            this._log.log('Execute');
            configManagerInstance_1.default.init(config_1.default.config, config_1.default.environment);
            var dm = DataManager_1.default.getInstance();
            // just because we need it here!
            DataManager_1.default.getInstance();
            DataManager_1.default.getInstance().setupGateway();
            Routes_1.default.init();
            var sequence = new Sequence_1.default();
            if (DEBUG && configManagerInstance_1.default.getEnvironment() != 'live'
                && configManagerInstance_1.default.getEnvironment() != 'prod'
                && configManagerInstance_1.default.getEnvironment() != 'production') {
                sequence.add(new DevBarTask_1.default());
            }
            // add your own tasks
            sequence.add(new LoadJSONByNameTask_1.default(configManagerInstance_1.default, 'record', dm.recordModel.addList.bind(dm.recordModel)));
            sequence.add(new LoadJSONByNameTask_1.default(configManagerInstance_1.default, 'payee', dm.payeeModel.addList.bind(dm.payeeModel)));
            sequence.add(new InitLocaleTask_1.default());
            // do this last
            sequence.add(new MethodTask_1.default(callback));
            sequence.execute();
        };
        return StartUp;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = StartUp;
});
