/**
 *
 * PROBABLY     0	if the specified type appears to be playable.
 * MAYBE	    1	if it's impossible to tell whether the type is playable without playing it.
 * NO	        2	if the specified type definitely cannot be played.
 * @enum CanPlayEnum
 */
const enum CanPlayEnum {
	PROBABLY = 0,
	MAYBE = 1,
	NO = 2
}

export default CanPlayEnum;