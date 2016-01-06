import IResult from "lib/temple/core/IResult";

class FacebookResult<T> implements IResult<T>
{
	constructor(public success:boolean, public data:T = null)
	{
	}
}

export default FacebookResult;