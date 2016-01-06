// This file is in support of tsd/greensock.d.ts,
// the tsd/greensock.d.ts definitions are incomplete, SplitText is missing!

// Type definitions for SplitText 0.3.4
// Project: http://greensock.com/
// Definitions by: Lars van Braam <lars@mediamonks.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare class SplitText
{
	constructor(target:string|Object|NodeList|Node|HTMLElement|Array<HTMLElement>, vars?:SplitTextVars);

	/**
	 * [static] When you pass a string to a SplitText (as the first parameter), it will feed that to its selector
	 * engine internally to find the element(s), and jQuery is used by default if it happens to be loaded.
	 */
	static selector:string;

	/**
	 * [static] Splits the text in the target element(s) according to the provided config properties.
	 */
	static split(vars?:SplitTextVars):void

	/**
	 * Reverts to the original content (the innerHTML before the split).
	 */
	revert():void;

	/**
	 * An array containing all of the characters' raw DOM elements that were split apart.
	 */
	chars:Array<HTMLElement>;

	/**
	 * An array containing all of the lines' raw DOM element that were split apart.
	 */
	lines:Array<HTMLElement>;

	/**
	 * An array containing all of the words' raw DOM elements that were split apart.
	 */
	words:Array<HTMLElement>;
}

interface SplitTextVars
{
	/**
	 * a comma-delimited list of the split type(s) which can be any of the following: chars, words, or lines. This
	 * indicates the type of components you'd like split apart into distinct <div> elements. For example, to split
	 * apart the characters and words (not lines), you'd use type:"chars,words" or to only split apart lines, you'd
	 * do type:"lines". In order to avoid odd line breaks, it is best to not split by chars alone (always include
	 * words or lines too if you're splitting by characters). Note: spaces are not considered characters. [default:
	 * "chars,words,lines"]
	 */
	type?:string;

	/**
	 *  a css class to apply to each character's <div>, making it easy to select. If you add "++" to the end of the
	 *  class name, SplitText will append an incremented number to each character's <div>, starting at 1. For example,
	 *  if charsClass is "char++", the div's class for the first character would be "char1", the next would be "char2",
	 *  then "char3", etc.[default: undefined]
	 */
	charsClass?:string;

	/**
	 * a css class to apply to each line's <div>, making it easy to select. If you add "++" to the end of the class
	 * name, SplitText will append an incremented number to each line's <div>, starting at 1. For example, if linesClass
	 * is "line++", the div's class for the first line would be "line1", the next would be "line2", then "line3", etc.
	 * [default: undefined]
	 */
	linesClass?:string;

	/**
	 * if "absolute", the position css style for all of the resulting <div> elements will be "absolute" and their
	 * "top", "left", "width", and "height" css properties will be calculated and applied inline which can be useful
	 * for certain effects. In IE8 and earlier, this provides better support for 2D transforms like rotation, scale,
	 * etc. It costs a bit more to split initially performance-wise, but it can improve performance during animation
	 * because the browser doesn't have to do as many reflow calculations (in most cases). Keep in mind that once you
	 * split things using position:"absolute", if the containing element is resized, the split text chunks won't reflow.
	 * And if position is not specifically set to"absolute", it will be "relative" [default: "relative"]
	 */
	position?:string;

	/**
	 * a css class to apply to each word's <div>, making it easy to select. If you add "++" to the end of the class
	 * name, SplitText will append an incremented number to each word's <div>, starting at 1. For example, if wordsClass
	 * is "word++", the div's class for the first word would be "word1", the next would be "word2", then "word3", etc.
	 * [default: undefined]
	 */
	wordsClass?:string;
}