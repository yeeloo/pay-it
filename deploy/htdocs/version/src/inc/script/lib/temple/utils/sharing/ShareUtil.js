var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/temple/core/Destructible", 'knockout'], function (require, exports, Destructible_1, ko) {
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
    var ShareUtil = (function (_super) {
        __extends(ShareUtil, _super);
        /**
         * @constructor
         * @param methods The sharing methods to initialize with. Can also be passed later using
         * the addMethod() method.
         */
        function ShareUtil(methods) {
            var _this = this;
            if (methods === void 0) { methods = []; }
            _super.call(this);
            /**
             * Observable array containing all sharing methods. Can be used in templates to loop
             * through all sharing methods and show buttons for them.
             */
            this.methods = ko.observableArray([]);
            /**
             * Object containing all methods with the method ids as keys.
             */
            this._methodsByID = {};
            /**
             * Counter for the id to assign to element with the share binding.
             */
            this._idCounter = 0;
            /**
             * Map of sharing options passed to the share binding. The keys are integer ids assigned to
             * each element with the share binding, the values are IShareUtilKOBindingOptions object
             * containing the latest options passed.
             */
            this._shareOptions = {};
            /**
             * Handler that will be executed on click for elements that have the 'share' binding.
             * @returns {boolean} Returns false to signal knockout to prevent the default click action
             */
            this.clickBindingHandler = function (koData, event) {
                var id = ko.utils.domData.get(event.target, ShareUtil._ELEMENT_ID_DOMDATA_KEY);
                var options = _this._shareOptions[id];
                var method;
                if (options.method == null) {
                    console.warn('No sharing method set on binding. Not executing share.');
                    return;
                }
                switch (typeof options.method) {
                    case 'object':
                        method = options.method;
                        break;
                    case 'string':
                        method = _this._methodsByID[options.method];
                        if (!method) {
                            throw new Error('Method with id "' + options.method +
                                '" not added to ShareUtil instance.');
                        }
                        break;
                    default:
                        console.warn('No sharing method set on binding. Not executing share.');
                        return;
                }
                method.share(options);
                return false;
            };
            methods.forEach(function (method) {
                _this.addMethod(method);
            });
            ShareUtil._instances.push(this);
            ShareUtil.initialize();
        }
        /**
         * Add a new sharing method, so it can be used with the KO share and shareWith bindings.
         * @param method A class that implements IShareMethod.
         */
        ShareUtil.prototype.addMethod = function (method) {
            this._methodsByID[method.id] = method;
            this.methods.push(method);
        };
        /**
         * Static method initializing the Knockout custom binding for ShareUtil. Will only run
         * once during the lifetime of the app.
         */
        ShareUtil.initialize = function () {
            if (!ShareUtil._initialized) {
                ShareUtil._initialized = true;
                ko.bindingHandlers[ShareUtil.SHARE_BINDING_NAME] = {
                    init: ShareUtil._shareBindingInit,
                    update: ShareUtil._shareBindingUpdate
                };
                ko.bindingHandlers[ShareUtil.WRAP_BINDING_NAME] = {
                    init: ShareUtil._wrapBindingInit
                };
                ko.virtualElements.allowedBindings[ShareUtil.WRAP_BINDING_NAME] = true;
            }
        };
        /**
         * Init handler for the share binding, used to share using a single sharing method
         * @param element The element we bind to
         * @param valueAccessor Function returning the binding value.
         * @param allBindings Object with accessors to other bindings
         * @param viewModel Current viewModel for the element
         * @param bindingContext Binding context for the element
         */
        ShareUtil._shareBindingInit = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var shareUtils = ko.unwrap(ko.unwrap(valueAccessor()).shareUtils);
            if (!shareUtils) {
                if (ShareUtil._instances[0]) {
                    shareUtils = ShareUtil._instances[0];
                }
                else {
                    throw new Error('ShareUtil: cannot find a valid ShareUtil instance.');
                }
            }
            if (allBindings.has('click')) {
                throw new Error('Cannot use both the ' +
                    ko.bindingHandlers[ShareUtil.SHARE_BINDING_NAME] +
                    ' and the click binding on the same element.');
            }
            var id = shareUtils._idCounter++;
            ko.utils.domData.set(element, ShareUtil._ELEMENT_ID_DOMDATA_KEY, id);
            ko.bindingHandlers.click.init(element, function () {
                return shareUtils.clickBindingHandler;
            }, allBindings, viewModel, bindingContext);
        };
        /**
         * Update handler for the share binding, used to share using a single sharing method
         * @param element The element we bind to
         * @param valueAccessor Function returning the binding value.
         * @param allBindings Object with accessors to other bindings
         * @param viewModel Current viewModel for the element
         * @param bindingContext Binding context for the element
         */
        ShareUtil._shareBindingUpdate = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            if (bindingContext[ShareUtil._BINDING_CONTEXT_WRAP_PROP] != void (0)) {
                var options = $.extend({}, bindingContext[ShareUtil._BINDING_CONTEXT_WRAP_PROP]() || {}, ShareUtil.defaultBindingOptions, ko.toJS(valueAccessor()));
            }
            else {
                var options = $.extend({}, ShareUtil.defaultBindingOptions, ko.toJS(valueAccessor()));
            }
            var shareUtils = options.shareUtils || ShareUtil._instances[0];
            if (!shareUtils) {
                throw new Error('ShareUtil: cannot find a valid ShareUtil instance.');
            }
            var id = ko.utils.domData.get(element, ShareUtil._ELEMENT_ID_DOMDATA_KEY);
            shareUtils._shareOptions[id] = options;
        };
        /**
         * Init handler for the shareWith binding, used to set default sharing parameters on child
         * elements that have the share binding.
         * @param element The element we bind to
         * @param valueAccessor Function returning the binding value.
         * @param allBindings Object with accessors to other bindings
         * @param viewModel Current viewModel for the element
         * @param bindingContext Binding context for the element
         */
        ShareUtil._wrapBindingInit = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var shareOptions = valueAccessor(), context = {};
            // Wrap the options in an observable and add it to the binding context
            context[ShareUtil._BINDING_CONTEXT_WRAP_PROP] = ko.isObservable(shareOptions) ? shareOptions :
                ko.observable(shareOptions);
            var innerBindingContext = bindingContext.extend(context);
            ko.applyBindingsToDescendants(innerBindingContext, element);
            return { controlsDescendantBindings: true };
        };
        /**
         * Overrides Destructible::destruct()
         */
        ShareUtil.prototype.destruct = function () {
            var index = ShareUtil._instances.indexOf(this);
            if (index >= 0) {
                ShareUtil._instances.splice(index);
            }
            _super.prototype.destruct.call(this);
        };
        /**
         * Name of the custom knockout binding that can be used to create a single share binding
         */
        ShareUtil.SHARE_BINDING_NAME = 'share';
        /**
         * Name of the custom knockout binding that can be used to set defaults on multiple share
         * bindings.
         */
        ShareUtil.WRAP_BINDING_NAME = 'shareWith';
        /**
         * Key to use when saving the id as domData on the element with a share binding.
         */
        ShareUtil._ELEMENT_ID_DOMDATA_KEY = 'shareUtilsId';
        /**
         * Name of the property where the shareWith options will be saved on the binding context.
         */
        ShareUtil._BINDING_CONTEXT_WRAP_PROP = '$shareUtilsOptions';
        /**
         * Default options for the custom knockout binding
         */
        ShareUtil.defaultBindingOptions = {
            shareUtils: null,
            method: null
        };
        /**
         * Boolean indicating if the ShareUtil.initialize method has been called before.
         */
        ShareUtil._initialized = false;
        /**
         * Array of ShareUtil instances created. Used by the custom knockout binding to determine
         * which instance of ShareUtil to use.
         */
        ShareUtil._instances = [];
        return ShareUtil;
    })(Destructible_1.default);
    exports.default = ShareUtil;
});
