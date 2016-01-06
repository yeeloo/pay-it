import BaseEvent from "lib/temple/events/BaseEvent";
import IResult from "lib/temple/core/IResult";

/**
 * @module Temple
 * @namespace temple.net.sockets
 * @class SocketEvent
 */
class SocketEvent extends BaseEvent
{
	/**
	 * Dispatched when {{#crossLink "temple.net.sockets.SocketService"}}SocketService{{/crossLink}} starts connecting to the server.
	 *
	 * @static
	 * @property CONNECTING
	 * @type string
	 * @default 'SocketEvent.connecting'
	 */
	public static CONNECTING:string = 'SocketEvent.connecting';

	/**
	 * Dispatched when a socket connection is established with the server.
	 *
	 * @static
	 * @property OPENED
	 * @type string
	 * @default 'SocketEvent.opened'
	 */
	public static OPENED:string = 'SocketEvent.opened';

	/**
	 * Dispatched when a socket connection is closed.
	 *
	 * @static
	 * @property CLOSED
	 * @type string
	 * @default 'SocketEvent.closed'
	 */
	public static CLOSED:string = 'SocketEvent.closed';

	/**
	 * Dispatched when the {{#crossLink "temple.net.sockets.SocketService"}}SocketService{{/crossLink}} tries to reconnect to the server.
	 *
	 * @static
	 * @property RECONNECT
	 * @type string
	 * @default 'SocketEvent.reconnect'
	 */
	public static RECONNECT:string = 'SocketEvent.reconnect';

	/**
	 * Dispatched when the server doesn't return socketservers to establish a connection to.
	 *
	 * @static
	 * @property NO_SERVERS_AVAILABLE
	 * @type string
	 * @default 'SocketEvent.no_servers_available'
	 */
	public static NO_SERVERS_AVAILABLE:string = 'SocketEvent.no_servers_available';

	/**
	 * Dispatched when a message from the server is received.
	 *
	 * @static
	 * @property MESSAGE
	 * @type string
	 * @default 'SocketEvent.message'
	 */
	public static MESSAGE:string = 'SocketEvent.message';

	/**
	 * Dispatched when the {{#crossLink "temple.net.sockets.SocketService"}}SocketService{{/crossLink}} can't establish a connection to the server.
	 *
	 * @static
	 * @property UNABLE_TO_CONNECT
	 * @type string
	 * @default 'SocketEvent.unable_to_connect'
	 */
	public static UNABLE_TO_CONNECT:string = 'SocketEvent.unable_to_connect';

	/**
	 * Event dispatched by {{#crossLink "temple.net.sockets.SocketService"}}SocketService{{/crossLink}}.
	 *
	 * @class SocketEvent
	 * @constructor
	 * @param {string} type
	 * @param {any} [action=null]
	 * @param {any} [event=null]
	 * @param {any} [data=null]
	 * @param {Date} [time=null]
	 */
	constructor(type:string, public action:any = null, public event:any = null, public data:any = null, public time:Date = null)
	{
		super(type);
	}
}

export default SocketEvent;