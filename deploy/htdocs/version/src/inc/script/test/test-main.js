/**
 * Created by Narie on 7/14/13.
 */

//console.log('FILES: ', window.__karma__.files);

var tests = Object.keys(window.__karma__.files).filter(function( file ){
	return /Spec\.js$/.test(file);
});

//console.log('TESTS: ', tests);

var DEBUG = true;

requirejs.config({
	baseUrl: '/base/inc/script',
	waitSeconds: 15,
	paths: {
		requireLib:     'vendor/require/require',
		jquery:         'vendor/jquery/jquery',
		xdomainrequest: 'vendor/jquery-xdomainrequest/jquery.xdomainrequest',
		jquerymobile:   'vendor/jquery-mobile/jquery.mobile.custom',
		knockout:       'vendor/knockout/knockout',
		text:           'vendor/require-text/text',
		TweenMax:       'vendor/gsap/TweenMax',
		TweenLite:      'vendor/gsap/TweenLite',
		CSSPlugin:      'vendor/gsap/plugins/CSSPlugin',
		TimelineLite:   'vendor/gsap/TimelineLite',
		TimelineMax:    'vendor/gsap/TimelineMax',
		EasePack:       'vendor/gsap/easing/EasePack',
		moment:         'vendor/moment/moment',
		bluebird:       'vendor/bluebird/bluebird'
	},
	map: {
	},
	shim: {
	},

	// ask Require.js to load these files (all our tests)
	deps: tests,

	// start test run, once Require.js is done
	callback: window.__karma__.start
});


// Narie: this is not the place to put this, but don't know a better one
// I think we should change the bootstrapping of the app
if( typeof console === 'undefined' ){
	console = {
		/**
		 * @param {...*} message
		 */
		log: function( message ){
		},
		/**
		 * @param {...*} message
		 */
		debug: function( message ){
		},
		/**
		 * @param {...*} message
		 */
		warn: function( message ){
		},
		/**
		 * @param {...*} message
		 */
		error: function( message ){
		},
		/**
		 * @param {...*} message
		 */
		info: function( message ){
		}
	}
}