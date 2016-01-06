import ISpritesheet = require('./ISpritesheet');

interface ICinematic
{
	frames:ISpritesheet;
	loop:boolean;
	x:number;
	y:number;
}

export = ICinematic;

