/**
 * @namespace app.data.enum
 * @class Branches
 */
class Branches
{
	public static INDEX:string = 'index';
	public static HOME:string = 'index/home';
	
}

// use in templates
window['Branches'] = Branches;

// use in classes
export default Branches;