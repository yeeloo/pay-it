/**
 * NETWORK_EMPTY	    0	There is no data yet.  The readyState is also HAVE_NOTHING.
 * NETWORK_IDLE	        1
 * NETWORK_LOADING	    2	The media is loading.
 * NETWORK_NO_SOURCE[1]	3
 *
 * @enum NetworkStateEnum
 */
const enum NetworkStateEnum {
	EMPTY = 0,
	IDLE = 1,
	LOADING = 2,
	NO_SOURCE = 3

}

export default NetworkStateEnum;