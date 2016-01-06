import refdef = require('def/ReferenceDefinitions');
import IPayeeData = require('../vo/IPayeeData');

class PayeeModel
{
	private _payees:Array<IPayeeData> = [];
	private _hash:{[index:string]:IPayeeData} = {};

	public getAll():Array<IPayeeData>
	{
		return this._payees;
	}

	public get(index:string):IPayeeData
	{
		if (this.has(index))
		{
			return this._hash[<any>index];
		}
		throw new Error("No item found with id '" + index + "'");

		return null;
	}

	public has(index:string):boolean
	{
		return this._payees.some((el)=>{
			return el.index === index;
		});
	}

	public add(data:IPayeeData):void
	{
		if (data.index === void 0)
		{
			throw new Error("Id is undefined");
		}

		var index:string = data.index;

		if (<any>index in this._hash)
		{
			throw new Error("Data with id '" + index + "' already exists");
		}
		this._hash[<any>index] = data;
		this._payees.push(data);
	}

	public addList(list:Array<IPayeeData>):void
	{
		list.forEach(<any>this.add.bind(this));
	}
}

export default PayeeModel;