interface IResult<T>
{
	success:boolean;
	data?:T;
	message?:string;
}

export default IResult;