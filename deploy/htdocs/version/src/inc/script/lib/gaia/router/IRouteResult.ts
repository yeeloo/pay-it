interface IRouteResult
{
	branch:string;
	deeplink:{
		[param:string]: any;
	};
}

export default IRouteResult;