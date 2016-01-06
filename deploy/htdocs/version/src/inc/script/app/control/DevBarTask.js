var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/utils/Browser", "lib/temple/control/sequence/tasks/AbstractTask", 'lib/temple/utils/Log', "../../lib/temple/utils/Cookie"], function (require, exports, Browser_1, AbstractTask_1, Log_1, Cookie_1) {
    /**
     * @namespace app.control
     * @class DevBarTask
     * @extend temple.control.sequence.tasks.AbstractTask
     */
    var DevBarTask = (function (_super) {
        __extends(DevBarTask, _super);
        /**
         */
        function DevBarTask() {
            _super.call(this);
            this._log = new Log_1.default('app.control.DevBarTask');
        }
        /**
         * @inheritDoc
         */
        DevBarTask.prototype.executeTaskHook = function () {
            var _this = this;
            this._log.log('executeTaskHook');
            if (Browser_1.default.name == 'chrome' || (Browser_1.default.platform != 'mac' &&
                Browser_1.default.platform != 'windows' &&
                Browser_1.default.platform != 'linux')) {
                this.done();
                return;
            }
            var $el = $('<div/>', { html: 'This version has only been tested on Chrome, if you\'re seeing this message please use Chrome for testing & reviewing.<br />Other browsers will be tested and QA\'ed before launch' }).addClass('dev-bar');
            var $close = $('<span/>', { text: 'x' }).addClass('btn-close');
            $el.append($close);
            $('body').append($el);
            $el.on('click', function (event) {
                _this._log.log('Clicked button, closing');
                $el.remove();
                Cookie_1.default.set('hide-chrome-devbar', true);
            });
            if (Cookie_1.default.get('hide-chrome-devbar')) {
                $el.remove();
            }
            this.done();
        };
        /**
         * @inheritDoc
         */
        DevBarTask.prototype.destruct = function () {
            _super.prototype.destruct.call(this);
        };
        return DevBarTask;
    })(AbstractTask_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DevBarTask;
});
