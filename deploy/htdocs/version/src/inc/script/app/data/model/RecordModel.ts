import refdef = require('def/ReferenceDefinitions');
import IRecordData = require('../vo/IRecordData');

class RecordModel
{
	private _records:Array<IRecordData> = [];
	private _hash:{[index:string]:IRecordData} = {};

	public getAll():Array<IRecordData>
	{
		return this._records;
	}

	public get(index:string):IRecordData
	{
		if (this.has(index))
		{
			return this._hash[<any>index];
		}
		throw new Error("No item found with id '" + index + "'");

		return null;
	}

	public getLatest():IRecordData
	{
		return this._records[0];
	}

	public has(index:string):boolean
	{
		return this._records.some((el)=>{
			return el.index === index;
		});
	}

	public add(data:IRecordData):void
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
		this._records.push(data);
	}

	public addList(list:Array<IRecordData>):void
	{
		list.forEach(<any>this.add.bind(this));
	}
}

export default RecordModel;