import Browser from "lib/temple/utils/Browser";
import Sequence from "lib/temple/control/sequence/Sequence";
import AbstractTask from "lib/temple/control/sequence/tasks/AbstractTask";
import Log from 'lib/temple/utils/Log';
import Cookie from "../../lib/temple/utils/Cookie";

/**
 * @namespace app.control
 * @class DevBarTask
 * @extend temple.control.sequence.tasks.AbstractTask
 */
export default class DevBarTask extends AbstractTask
{
	private _log = new Log('app.control.DevBarTask');

	/**
	 */
	constructor()
	{
		super();
	}

	/**
	 * @inheritDoc
	 */
	public executeTaskHook():void
	{
		this._log.log('executeTaskHook');

		if(Browser.name == 'chrome' || (
				Browser.platform != 'mac' &&
				Browser.platform != 'windows' &&
				Browser.platform != 'linux'
			)
		)
		{
			this.done();
			return;
		}

		var $el = $('<div/>', {html: 'This version has only been tested on Chrome, if you\'re seeing this message please use Chrome for testing & reviewing.<br />Other browsers will be tested and QA\'ed before launch'}).addClass('dev-bar');
		var $close = $('<span/>', {text: 'x'}).addClass('btn-close');

		$el.append($close);

		$('body').append($el);

		$el.on('click', (event) =>
		{
			this._log.log('Clicked button, closing');

			$el.remove();
			Cookie.set('hide-chrome-devbar', true);
		});

		if(Cookie.get('hide-chrome-devbar'))
		{
			$el.remove();
		}

		this.done();
	}

	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		super.destruct();
	}
}