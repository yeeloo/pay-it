import IRouteResultItem from "./IRouteResultItem";
import IRouteResult from "./IRouteResult";

class RouteResultItem implements IRouteResultItem
{
	[key: number]: IRouteResult;

	public route:string;
	public length:number;

	constructor(results: IRouteResult[], route?:string)
	{
		for (var i = 0; i < results.length; i++)
		{
			this[i] = results[i];
		}

		this.route = route;
		this.length = results.length;
	}

	public equals(item:IRouteResultItem):boolean
	{
		if (!item)
		{
			return false;
		}

		if (this.length != item.length)
		{
			return false;
		}

		for (var i = 0; i < this.length; i++)
		{
			var thisRouteResult = this[i];
			var itemRouteResult = item[i];

			if (thisRouteResult.branch != itemRouteResult.branch)
			{
				return false;
			}

			if (!thisRouteResult.deeplink && !itemRouteResult.deeplink)
			{
				continue;
			}

			if (thisRouteResult.deeplink && !itemRouteResult.deeplink)
			{
				return false;
			}

			if (!thisRouteResult.deeplink && itemRouteResult.deeplink)
			{
				return false;
			}

			for (var j in thisRouteResult.deeplink)
			{
				if (thisRouteResult.deeplink.hasOwnProperty(j))
				{
					if (itemRouteResult.deeplink[j] != thisRouteResult.deeplink[j])
					{
						return false;
					}
				}
				else
				{
					return false;
				}
			}

			for (j in itemRouteResult.deeplink)
			{
				if (thisRouteResult.deeplink.hasOwnProperty(j))
				{
					if (itemRouteResult.deeplink[j] != thisRouteResult.deeplink[j])
					{
						return false;
					}
				}
				else
				{
					return false;
				}
			}
		}

		return true;
	}
}

export default RouteResultItem;