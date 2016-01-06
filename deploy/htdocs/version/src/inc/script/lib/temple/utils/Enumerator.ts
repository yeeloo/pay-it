/**
 * @module Temple
 * @namespace temple.utils
 * @class Enumerator
 */
class Enumerator
{
	private static _hash:{[className:string]:{[id:string]:Enumerator}} = {};
	private static _all:{[className:string]:Array<Enumerator>} = {};

	private static _KEY:string = 'EnumeratorClassName';

	/**
	 * Get a specific Enumerator by its id.
	 *
	 * @method get
	 * @param id
	 * @returns {Enumerator}
	 *
	 * @static
	 */
	public static get(id:string):Enumerator
	{
		return Enumerator._hash[this[Enumerator._KEY]][id];
	}

	/**
	 * Get a specific Enumerator by its label.
	 *
	 * Note: since Enumerators are not indexed by their label, this function is a lot slower then getting the Enumerator by its id.
	 * And labels are not unique, so it returns the first Enumerator which has this label
	 *
	 * @method getByLabel
	 * @param label the label to search for
	 * @param caseSensitive a boolean which indicates if it's a case sensitive search.
	 * @returns {Enumerator}
	 *
	 * @static
	 */
	public static getByLabel(label:string, caseSensitive:boolean = true):Enumerator
	{
		var hash:{[id:string]:Enumerator} = Enumerator._hash[this[Enumerator._KEY]]

		for (var id in hash)
		{
			var enumerator:Enumerator = hash[id];
			if (enumerator.label == label || !caseSensitive && enumerator.label.toLowerCase() == label.toLowerCase())
			{
				return enumerator;
			}
		}
		return null;
	}

	/**
	 * Get all Enumerators of this type.
	 *
	 * @static
	 * @method getAll
	 * @returns {Array<Enumerator>}
	 */
	public static getAll():Array<Enumerator>
	{
		return Enumerator._all[this[Enumerator._KEY]];
	}

	/**
	 *
	 * @class Enumerator
	 * @constructor
	 * @param {string} id
	 * @param {string} label
	 */
	constructor(public id:string, public label:string = null)
	{
		// Get the name of the class, or set to a random name when the name is undefined
		var className = this['constructor'][Enumerator._KEY] || (this['constructor'][Enumerator._KEY] = "Enum" + Math.round(Math.random() * 10e10));

		if (typeof className == 'undefined')
		{
			// IE support: doesn't support constructor.name
			throw new Error('Class extending Enumerator must have static variable \'name\'.');
		}

		if (!(className in Enumerator._hash))
		{
			Enumerator._hash[className] = {};
			Enumerator._all[className] = [];
		}

		if (id in Enumerator._hash[className])
		{
			throw new Error("Enumerator with id '" + id + "' already exists");
		}
		Enumerator._all[className].push(Enumerator._hash[className][id] = this);
	}

	/**
	 * @method toJSON
	 * @returns {any}
	 */
	public toJSON():any
	{
		return this.id;
	}

	/**
	 * @method toString
	 * @returns {any}
	 */
	public toString():any
	{
		return this.label || this.id;
	}
}

export default Enumerator;