// todo: add automatich destruction of intervals, gateway PendingCalls, knockout subscriptions and components

import IDestructible from "lib/temple/core/IDestructible";

/**
 * @module Temple
 * @namespace temple.core
 * @class Destructible
 */
class Destructible implements IDestructible
{
	static eventNamespaceCount:number = 10000000;

	private _isDestructed:boolean = false;


	/**
	 * @property eventNamespace
	 * @type string
	 * @default
	 */
	public eventNamespace:string = '';

	constructor()
	{
		this.eventNamespace = '.' + (++Destructible.eventNamespaceCount);
	}

	/**
	 * After {{#crossLink "temple.core.Destructible/destruct"}}{{/crossLink}} has been called, this method returns true.
	 * Use this method to determine whether destruct() should be run again.
	 *
	 * @public
	 * @method isDestructed
	 * @returns {boolean}
	 */
	public isDestructed():boolean
	{
		return this._isDestructed;
	}

	/**
	 * Destruct this class.
	 *
	 * @public
	 * @method destruct
	 */
	public destruct():void
	{
		this._isDestructed = true;
	}
}

export default Destructible;