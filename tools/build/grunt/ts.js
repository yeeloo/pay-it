module.exports = function (grunt, options)
{
	return {
		default: {
			// The source TypeScript files, http://gruntjs.com/configuring-tasks#files
			src: ['<%= sourceDir %>inc/script/**/*.ts'],
			// Use to override the default options, http://gruntjs.com/configuring-tasks#options
			options: {
				// 'es3' | 'es5' (default) | 'es6'
				target: 'es5',
				// 'amd' (default) | 'commonjs' | 'umd' | 'systemjs'
				module: 'amd',
				// true (default) | false
				sourceMap: false,
				// true | false (default)
				declaration: false,
				// true (default) | false
				removeComments: false,
				// true | false (default)
				experimentalDecorators: false,
				// true | false (default)
				"noImplicitAny": false,
				"preserveConstEnums": true,
				// true (default) | false
				"suppressImplicitAnyIndexErrors": true,
				// true (default) | false
				failOnTypeErrors: true,
				// watch (default) | always | never
				fast: 'never'
			}
		}
	};
};