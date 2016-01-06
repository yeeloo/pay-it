import refdef from "def/ReferenceDefinitions";

import Destructible from "lib/temple/core/Destructible";

class AbstractComponentViewModel extends Destructible
{
    controller:any;

    _subscriptions:Array<KnockoutSubscription> = [];

    constructor()
    {
        super();
    }

    setController(controller:any)
    {
        this.controller = controller;
    }

    public destruct():void
    {
        this.controller = null;

        if (this._subscriptions)
        {
            for (var i = 0; i < this._subscriptions.length; i++)
            {
                this._subscriptions[i].dispose();
            }
            this._subscriptions = null;
        }

        super.destruct();
    }
}

export default AbstractComponentViewModel;