import refdef from "def/ReferenceDefinitions";
import Browser from "lib/temple/utils/Browser";

export interface IValidationResult {
	success:boolean;
	el:HTMLElement;
	rules:ValidationRule[];
}

export class ValidationRule {

	private className:string;
	private fn:Function;

	constructor( className:string, fn:Function, public message = '' ){
		this.className = className;
		this.fn = fn;
	}

	validate( el:HTMLElement, fn:Function ){
		if( $( el ).hasClass( this.className ) ){
			this.fn.call( null, el, fn );
		}
		else {
			fn.call( null, null );
		}
	}
}

/**
 * @example
 *      var formhelper = new fm.FormHelper($('form')[0]);
 *      formhelper.validate(function(success){
 *
 *      });
 *
 *
 */
export class FormHelper {


	public static rules:ValidationRule[] = [
		new ValidationRule( 'required', ( el, fn ) =>{

			if( el.type.toLowerCase() == 'checkbox' ){
				if( el.checked ){
					fn( true );
				}
				else {
					fn( false );
				}
			} else {
				if( $( el ).val() == '' || $( el ).val() == $( el ).attr( 'placeholder' ) ){
					fn( false );
				}
				else {
					fn( true );
				}
			}
		} ), new ValidationRule( 'range', ( el, fn ) =>{
			if( isNaN( parseInt( $( el ).val(), 10 ) ) || parseInt( $( el ).val(), 10 ) <= parseInt( $( el ).attr( 'data-min' ), 10 ) || parseInt( $( el ).val(), 10 ) >= parseInt( $( el ).attr( 'data-max' ), 10 ) ){
				fn( false );
			}
			else {
				fn( true );
			}
		} ), new ValidationRule( 'email', ( el, fn ) =>{
			if( !new RegExp( '^[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$', 'i' ).test( $( el ).val() ) || $( el ).val() == $( el ).attr( 'placeholder' ) ){
				fn( false );
			}
			else {
				fn( true );
			}
		} ), new ValidationRule( 'equal-to', ( el, fn ) =>{

			if( $( el ).val() == '' || $( el ).val() == $( el ).attr( 'placeholder' ) || $( '#' + $( el ).attr( 'data-equals' ) ).val() != $( el ).val() ){
				fn( false );
			}
			else {
				fn( true );
			}
		} ), new ValidationRule( 'minimum-length', ( el, fn ) =>{
			var value = $( el ).val() || '', length = parseInt( $( el ).attr( 'data-length' )) || 0;

			if( $( el ).val() == '' || $( el ).val() == $( el ).attr( 'placeholder' ) ){
				fn( false );
			}
			else {
				if( value.length < length ){
					fn( false );
				}
				else {
					fn( true );
				}
			}
		} )
	];

	public static addValidationRule( rule:ValidationRule ){
		FormHelper.rules.push( rule );
	}

	private element:any;

	constructor( element:HTMLFormElement );

	constructor( element:HTMLDivElement );

	constructor( element:any ){
		this.element = element;

		this.makeDefaultValueCompatible( $( this.element ).find( 'input[placeholder], textarea[placeholder]' ).toArray() );
	}

	static validate( el:HTMLElement, fn:Function ){

		var validated = true,
			counted = 0,
			failed = 0,
			total = FormHelper.rules.length,
			failedRules = [];


		for( var i = 0, l = FormHelper.rules.length; i < l; ++i ){
			FormHelper.rules[i].validate( el, function( success ){
				counted++;
				if( success !== null ){
					if( !success ){
						failed++;
						failedRules.push( FormHelper.rules[i] );
						validated = false;
						$( el ).parent().addClass( 'validation-failed' ).removeClass( 'validation-passed' );
					}
					else {

						$( el ).parent().removeClass( 'validation-failed' ).addClass( 'validation-passed' );
					}
				}

				if( total == counted ){
					fn.call( null, failed == 0, el, failedRules );
				}
			} );
		}
	}

	validate( fn:( success:boolean, result:IValidationResult[] ) => void ){
		var elements = $( this.element ).find( 'input, textarea, select, div' ),
			counted = 0,
			failed = 0,
			total = elements.length;

		var result = <IValidationResult[]> [];

		for( var i = 0, l = elements.length; i < l; ++i ){
			FormHelper.validate( elements[i], function( success, el, rules ){

				result.push( {
					'success': success,
					el: el,
					rules: rules

				} );

				counted++;
				if( !success ){
					failed++;
				}
				if( total == counted ){
					fn( failed == 0, result );
				}
			} );
		}
	}

	getData():any{

		var data = {};
		$( this.element ).find( 'input, textarea, select' ).each( ( i, el:HTMLInputElement ) =>{
			switch( $( el ).attr( 'type' ) ){
				case 'radio':
				case 'checkbox':
				{
					if( el.checked ){
						data[$( el ).attr( 'name' )] = $( el ).val();
					}
					break;
				}

				default:
				{
					data[$( el ).attr( 'name' )] = $( el ).val();
					break;
				}
			}
		} );

		return data;
	}

	setData( data:Object ):void{

		var elements = {};

		$( this.element ).find( 'input, textarea, select' ).each( ( i, el ) =>{
			elements[$( el ).attr( 'name' )] = $( el );
		} );


		var val:string;
		for(
			var i in data ){
			if( data.hasOwnProperty( i ) && typeof(elements[i]) != 'undefined' ){
				val = data[i];

				switch( elements[i].attr( 'type' ) ){
					case 'radio':
					case 'checkbox':
					{
						if( elements[i].val() == val ){
							(<HTMLInputElement>elements[i][0]).checked = true;
						}
						break;
					}

					default:
					{
						elements[i].val( val );
						break;
					}
				}
			}
		}
	}

	/**
	 * Only for IE8
	 * @param elements
	 */
		makeDefaultValueCompatible( elements:HTMLElement[] ){

		if( Browser.name == 'ie' && Browser.version < 10 ){

			$( elements ).on( 'focus.remove',function(){
				if( $( this ).attr( 'placeholder' ) == $( this ).val() ){
					$( this ).val( '' );
				}
			} ).on( 'blur.remove', function(){
					if( '' == $( this ).val() ){
						$( this ).val( $( this ).attr( 'placeholder' ) );
					}
				} );

			setTimeout( () =>{
				$( elements ).each( function( i, el ){

					if( '' == $( el ).val() ){
						$( el ).val( $( el ).attr( 'placeholder' ) );
					}
				} );
			}, 300 );
		}
	}
}