import refdef from 'def/ReferenceDefinitions';
import Destructible from "lib/temple/core/Destructible";
import ko = require('knockout');

/**
 * ## ShareUtil
 * Helper class to keep track of sharing methods and create a knockout binding to call sharing on click.
 * ### Basic usage
 * - Create an instance of ShareUtil and add sharing methods (only needed once)
 *   ```typescript
 *   public shareUtils:SharingUtils;
 *   public twitterSharer:ShareMethodTwitter;
 *   ...
 *   this.shareUtils = new SharingUtils();
 *   this.twitterSharer = new ShareMethodTwitter();
 *   this.shareUtils.addMethod(this.twitterSharer);
 *   this.shareUtils.addMethod(new ShareMethodFacebookSharer());
 *   ```
 * - Call a sharing methods from your template using knockout. The method option in the share binding should be the ID of a sharing method or the sharing method itself.
 *    ```html
 *    <button type='button' data-bind='share : {method : 'facebook', url : 'http://url-to-share.com/'}'>
 *     Share FB
 *    </button>
 *    <button type='button' data-bind='share : {method : twitterSharer, text : 'Copy to tweet'}'>
 *      Share Twitter
 *    </button>
 *    ```
 * - Or call the sharing method from TypeScript directly (make sure to consider popup blockers):
 *    ```typescript
 *    this.twitterSharer.share({
 *     text : 'Copy to tweet'
 *    });
 *    ```
 * ### Additional KO bindings
 * - To loop through all sharing methods, you can use the 'methods' observable array on the ShareUtil instance
 *    ```html
 *    <ul data-bind="foreach : shareUtils.methods">
 * 	   <li data-bind="css : 'share share-'+id">
 * 		<a data-bind="text : name, share : {method : $data, url : 'http://123.com/'}"></a>
 * 	   </li>
 *    </ul>
 *    ```
 * - To set options for multiple sharing methods at the same time, use the shareWith binding on a parent element
 *    ```html
 *    <ul data-bind="shareWith : {url : 'http://123.com'}">
 * 	    <li class='share share-twitter'>
 * 	      <!-- url parameter will overwrite default set above -->
 * 	  	  <a data-bind="share : {method : 'twitter', url : 'http://456.com/'}"></a>
 * 	   </li>
 * 	    <li class='share share-facebook'>
 * 		  <a data-bind="share : {method : 'facebook'}"></a>
 * 	   </li>
 *    </ul>
 *    ```
 *
 * @author Floris Bernard
 * @class ShareUtil
 * @namespace temple.utils.sharing.ShareUtil
 */
export default class ShareUtil extends Destructible {
	/**
	 * Name of the custom knockout binding that can be used to create a single share binding
	 */
	public static SHARE_BINDING_NAME:string = 'share';
	/**
	 * Name of the custom knockout binding that can be used to set defaults on multiple share
	 * bindings.
	 */
	public static WRAP_BINDING_NAME:string = 'shareWith';
	/**
	 * Key to use when saving the id as domData on the element with a share binding.
	 */
	private static _ELEMENT_ID_DOMDATA_KEY:string = 'shareUtilsId';
	/**
	 * Name of the property where the shareWith options will be saved on the binding context.
	 */
	private static _BINDING_CONTEXT_WRAP_PROP:string = '$shareUtilsOptions';
	/**
	 * Default options for the custom knockout binding
	 */
	public static defaultBindingOptions:IShareUtilKOBindingOptions = {
		shareUtils: null,
		method: null
	};
	/**
	 * Boolean indicating if the ShareUtil.initialize method has been called before.
	 */
	private static _initialized:boolean = false;
	/**
	 * Array of ShareUtil instances created. Used by the custom knockout binding to determine
	 * which instance of ShareUtil to use.
	 */
	private static _instances:Array<ShareUtil> = [];
	/**
	 * Observable array containing all sharing methods. Can be used in templates to loop
	 * through all sharing methods and show buttons for them.
	 */
	public methods:KnockoutObservableArray<IShareMethod<any>> = ko.observableArray([]);
	/**
	 * Object containing all methods with the method ids as keys.
	 */
	private _methodsByID:{[name:string]:IShareMethod<any>} = {};
	/**
	 * Counter for the id to assign to element with the share binding.
	 */
	private _idCounter:number = 0;
	/**
	 * Map of sharing options passed to the share binding. The keys are integer ids assigned to
	 * each element with the share binding, the values are IShareUtilKOBindingOptions object
	 * containing the latest options passed.
	 */
	private _shareOptions:{[id:number] : IShareUtilKOBindingOptions} = {};

	/**
	 * @constructor
	 * @param methods The sharing methods to initialize with. Can also be passed later using
	 * the addMethod() method.
	 */
	constructor(methods:Array<IShareMethod<any>> = [])
	{
		super();

		methods.forEach((method:IShareMethod<any>) =>
		{
			this.addMethod(method);
		});

		ShareUtil._instances.push(this);
		ShareUtil.initialize();
	}

	/**
	 * Add a new sharing method, so it can be used with the KO share and shareWith bindings.
	 * @param method A class that implements IShareMethod.
	 */
	public addMethod(method:IShareMethod<any>):void
	{
		this._methodsByID[method.id] = method;
		this.methods.push(method);
	}

	/**
	 * Handler that will be executed on click for elements that have the 'share' binding.
	 * @returns {boolean} Returns false to signal knockout to prevent the default click action
	 */
	public clickBindingHandler = (koData:any, event:MouseEvent):boolean =>
	{
		var id:number = ko.utils.domData.get(<Element> event.target,
			ShareUtil._ELEMENT_ID_DOMDATA_KEY);
		var options = this._shareOptions[id];
		var method:IShareMethod<any>;

		if(options.method == null)
		{
			console.warn('No sharing method set on binding. Not executing share.');
			return;
		}

		switch(typeof options.method)
		{
			case 'object':
				method = <IShareMethod<any>> options.method;
				break;
			case 'string':
				method = this._methodsByID[<string> options.method];
				if(!method)
				{
					throw new Error('Method with id "' + options.method +
						'" not added to ShareUtil instance.')
				}
				break;
			default:
				console.warn('No sharing method set on binding. Not executing share.');
				return;
		}

		method.share(options);
		return false;
	};

	/**
	 * Static method initializing the Knockout custom binding for ShareUtil. Will only run
	 * once during the lifetime of the app.
	 */
	private static initialize():void
	{
		if(!ShareUtil._initialized)
		{
			ShareUtil._initialized = true;

			ko.bindingHandlers[ShareUtil.SHARE_BINDING_NAME] = <KnockoutBindingHandler> {
				init: ShareUtil._shareBindingInit,
				update: ShareUtil._shareBindingUpdate
			};

			ko.bindingHandlers[ShareUtil.WRAP_BINDING_NAME] = <KnockoutBindingHandler> {
				init: ShareUtil._wrapBindingInit
			};
			ko.virtualElements.allowedBindings[ShareUtil.WRAP_BINDING_NAME] = true;
		}
	}

	/**
	 * Init handler for the share binding, used to share using a single sharing method
	 * @param element The element we bind to
	 * @param valueAccessor Function returning the binding value.
	 * @param allBindings Object with accessors to other bindings
	 * @param viewModel Current viewModel for the element
	 * @param bindingContext Binding context for the element
	 */
	private static _shareBindingInit(element:any, valueAccessor:() => any, allBindings:any,
	                                 viewModel:any, bindingContext:KnockoutBindingContext):void
	{
		var shareUtils:ShareUtil = ko.unwrap(ko.unwrap(valueAccessor()).shareUtils);
		if(!shareUtils)
		{
			if(ShareUtil._instances[0])
			{
				shareUtils = ShareUtil._instances[0];
			}
			else
			{
				throw new Error('ShareUtil: cannot find a valid ShareUtil instance.')
			}
		}

		if(allBindings.has('click'))
		{
			throw new Error('Cannot use both the ' +
				ko.bindingHandlers[ShareUtil.SHARE_BINDING_NAME] +
				' and the click binding on the same element.');
		}

		var id = shareUtils._idCounter++;
		ko.utils.domData.set(element, ShareUtil._ELEMENT_ID_DOMDATA_KEY, id);

		ko.bindingHandlers.click.init(element, function()
		{
			return shareUtils.clickBindingHandler
		}, allBindings, viewModel, bindingContext);
	}

	/**
	 * Update handler for the share binding, used to share using a single sharing method
	 * @param element The element we bind to
	 * @param valueAccessor Function returning the binding value.
	 * @param allBindings Object with accessors to other bindings
	 * @param viewModel Current viewModel for the element
	 * @param bindingContext Binding context for the element
	 */
	private static _shareBindingUpdate(element:any, valueAccessor:() => any, allBindings:any,
	                                   viewModel:any, bindingContext:KnockoutBindingContext):void
	{


		if(bindingContext[ShareUtil._BINDING_CONTEXT_WRAP_PROP] != void(0))
		{
			var options:IShareUtilKOBindingOptions = $.extend(
				{},
				bindingContext[ShareUtil._BINDING_CONTEXT_WRAP_PROP]() || {},
				ShareUtil.defaultBindingOptions,
				ko.toJS(valueAccessor())
			);
		}
		else
		{
			var options:IShareUtilKOBindingOptions = $.extend(
				{},
				ShareUtil.defaultBindingOptions,
				ko.toJS(valueAccessor())
			);
		}

		var shareUtils = options.shareUtils || ShareUtil._instances[0];
		if(!shareUtils)
		{
			throw new Error('ShareUtil: cannot find a valid ShareUtil instance.')
		}

		var id:number = ko.utils.domData.get(element, ShareUtil._ELEMENT_ID_DOMDATA_KEY);
		shareUtils._shareOptions[id] = options;
	}

	/**
	 * Init handler for the shareWith binding, used to set default sharing parameters on child
	 * elements that have the share binding.
	 * @param element The element we bind to
	 * @param valueAccessor Function returning the binding value.
	 * @param allBindings Object with accessors to other bindings
	 * @param viewModel Current viewModel for the element
	 * @param bindingContext Binding context for the element
	 */
	private static _wrapBindingInit(element:any, valueAccessor:() => any, allBindings:any,
	                                viewModel:any, bindingContext:KnockoutBindingContext):any
	{

		var shareOptions:any = valueAccessor(),
			context:any = {};

		// Wrap the options in an observable and add it to the binding context
		context[ShareUtil._BINDING_CONTEXT_WRAP_PROP] = ko.isObservable(shareOptions) ? shareOptions :
			ko.observable(shareOptions);

		var innerBindingContext = bindingContext.extend(context);
		ko.applyBindingsToDescendants(innerBindingContext, element);
		return {controlsDescendantBindings: true};
	}

	/**
	 * Overrides Destructible::destruct()
	 */
	public destruct():void
	{
		var index:number = ShareUtil._instances.indexOf(this);
		if(index >= 0)
		{
			ShareUtil._instances.splice(index);
		}
		super.destruct();
	}
}

/**
 * Interface for sharing methods that can be used in ShareUtil.
 */
export interface IShareMethod<T extends IShareMethodOptions> {
	/**
	 * The full name of the sharer. For example: 'Facebook Share Dialog'
	 */
	name : string;
	/**
	 * String identifier for this sharer. Should only contain lowercase letters and/or dashes.
	 */
	id : string;
	/**
	 * A share method that executes the sharing. Should return a boolean indicating if the
	 * sharing has successfully initialized.
	 */
	share(options:T):boolean;
}

/**
 * Interface for options object passed to every sharing method when sharing.
 */
export interface IShareMethodOptions {
	/**
	 * A URL to share
	 */
	url? : string;
}

/**
 * Interface for the options object passed to the knockout share binding. Extends the
 * IShareMethodOptions object that will be passed to the sharing method itself.
 */
export interface IShareUtilKOBindingOptions extends IShareMethodOptions {
	/**
	 * The ShareUtil instance to use when sharing. Defaults to the first instance that was
	 * created.
	 */
	shareUtils? : ShareUtil;
	/**
	 * A IShareMethod instance you want to use for sharing, or the string id for that instance.
	 */
	method : string|IShareMethod<any>;
}