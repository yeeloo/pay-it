module.exports = function( grunt )
{
	var path = require( 'path' );
	var Mustache = require( 'mustache' );

	grunt.registerTask( 'create-component', 'Create a component (template, viewmodel and controller).', function( n )
	{
		var name = grunt.option( 'name' );
		var withEvents = grunt.option( 'events' );

		// verify that the 'name' option is provided
		if( typeof name == 'undefined' || name == '' || typeof name == 'boolean' )
		{
			grunt.log.error( 'Error: No component name given!' );
			showHelp();

			return;
		}

		// verify that the component directory does not exist yet
		var componentDir = path.join(getConfigDir('component'), name + '/');
		if( grunt.file.exists( componentDir ) && grunt.option( 'force' ) != true )
		{
			grunt.log.error( 'Component exists! Choose a different name or use --force to overwrite' );

			return;
		}

		/*
		 * Create an array of scaffold targets with the following properties:
		 * template: the .mustache template to render
		 * extension: the file extension of the file
		 * directory: name of the directory in the 'directories' array of the grunt config
		 * filename: a function that takes the component id and returns the target filename
		 * componentIdSubFolder: a boolean that indicates if the file should go into a folder
		 * with the component's name
		 */
		var componentScaffoldTargets = [
			{
				template: 'html',
				extension: '.html',
				directory: 'component',
				componentIdSubFolder : true,
				filename: function(componentId) {
					return componentId;
				}
			},
			{
				template: 'controller',
				extension: '.ts',
				directory: 'component',
				componentIdSubFolder : true,
				filename: function(componentId) {
					return dashesToCapitalized(componentId) + 'Controller';
				}
			},
			{
				template: 'viewModel',
				extension: '.ts',
				directory: 'component',
				componentIdSubFolder : true,
				filename: function(componentId) {
					return dashesToCapitalized(componentId) + 'ViewModel';
				}
			},
			{
				template: 'options',
				extension: '.ts',
				directory: 'component',
				componentIdSubFolder : true,
				filename: function(componentId) {
					return 'I' + dashesToCapitalized(componentId) + 'Options';
				}
			},
			{
				template: 'bundle',
				extension: '.js',
				directory: 'component',
				componentIdSubFolder : true,
				filename: function(componentId) {
					return dashesToCapitalized(componentId) + 'Bundle';
				}
			},
			{
				template: 'scss',
				extension: '.scss',
				directory: 'style',
				componentIdSubFolder : false,
				filename: function(componentId) {
					return '_' + componentId;
				}
			}
		];
		if(withEvents) {
			componentScaffoldTargets.push({
				template: 'event',
				extension: '.ts',
				directory: 'component',
				componentIdSubFolder : true,
				filename: function(componentId) {
					return dashesToCapitalized(componentId) + 'Event';
				}
			})
		}

		var parts = name.split('/');
		var componentId = name;
		var subfolder = '';
		if( parts.length > 1 ) {
			componentId = parts.pop();
			subfolder = parts.join('/') + '/';
		}

		// generate a list of all filenames
		var filenames = {};
		componentScaffoldTargets.forEach(function(target) {
			filenames[target.template] = target.filename(componentId);
		});

		// scaffold the targets
		componentScaffoldTargets.forEach(function(target) {
			scaffold(target, componentId, subfolder, filenames);
		});
		// scaffold style collection file
		scaffoldStyleCollectionFile(componentId, subfolder);

		grunt.log.subhead( 'Component creation succesful!' );
		grunt.log.writeln( 'To use your component, open a view template and type the following:' );
		grunt.log.writeln( '<!--ko component: \'' + name + '\'--><!--/ko-->' );
	} );

	/**
	 * Scaffolds using a single scaffold target.
	 * @param target A target object containing the following properties:
	 * template: the .mustache template to render
	 * extension: the file extension of the file
	 * directory: name of the directory in the 'directories' array of the grunt config
	 * filename: a function that takes the component id and returns the target filename
	 * componentIdSubFolder: a boolean that indicates if the file should go into a folder
	 * with the component's name
	 * @param componentId The id of the component to scaffold
	 * @param subfolder The subfolder to render the component in
	 * @param filenames A map of a string filenames for each target template
	 */
	function scaffold(target, componentId, subfolder, filenames) {
		var filename = target.filename(componentId);
		var fullPath = path.join(getConfigDir(target.directory) + subfolder, filename + target.extension);
		if(target.componentIdSubFolder) {
			fullPath = path.join(getConfigDir(target.directory) + subfolder, componentId, filename + target.extension);
		}
		var templatePath = path.join(getConfigDir('templates'), target.template + '.mustache');
		var template = grunt.file.read(templatePath);
		var model = {
			componentId : componentId,
			subfolder : subfolder,
			filename : filename,
			fullPath : fullPath,
			filenames : filenames,
			withEvents : !!grunt.option( 'events' ),
			underscoreSubPath : slashToUnderscore(subfolder + componentId),

			capitalizedComponentId : dashesToCapitalized(componentId)
		};

		grunt.log.writeln( 'Creating ' + fullPath );
		grunt.file.write( fullPath, Mustache.render( template, model ) );
	}

	/**
	 * Scaffolds the .scss file that serves as an index file for all components
	 */
	function scaffoldStyleCollectionFile(componentId, subfolder) {
		var directory = getConfigDir('style');
		var filename = grunt.config( 'create-component.options.styleCollectionFilename' );
		var fullPath = path.join( directory, filename );
		var content = '';

		if( grunt.file.exists( fullPath ) )
		{
			content += grunt.file.read( fullPath );
		}

		var importsRegex = /@import\s+['"]_?([^'".]+)(?:\.scss)?['"]/g;
		var result;
		var existingImports = [];
		while( result = importsRegex.exec( content ) )
		{
			existingImports.push( result[1] );
		}

		var scssPath = subfolder + componentId;
		if(existingImports.indexOf(scssPath) == -1) {
			content +=  '\n@import "' + scssPath + '";';

			grunt.log.writeln( 'Writing ' + filename );
			grunt.file.write( fullPath, content );
		}
	}

	/**
	 * Shows help in the grunt console
	 */
	function showHelp()
	{
		grunt.log.subhead( 'Usage: grunt create-component --name [COMPONENT-NAME]' );
		grunt.log.writeln( 'This will create the component with the given name. Dashed names are transformed to camelCase ' +
			'filenames (e.g. uber-component will be UberComponentController, etc).' );
		grunt.log.writeln( '' );
		grunt.log.writeln( "  --name\t\t\tName of the component, dashed (e.g. my-uber-component)" );
		grunt.log.writeln( "  --force\t\t\tForce creation of a component. Will overwrite if component with same name already exists" );
		grunt.log.writeln( "  --events\t\t\tCreate an Event class which extends BaseEvent" );
	}

	/**
	 * Gets a directory from the grunt config for a given directory name
	 * @param name The name to retrieve
	 * @returns {*} A string path
	 */
	function getConfigDir( name ) {
		return grunt.config( 'create-component.options.directories.' + name );
	}

	/**
	 * Returns a string written with dashes (example-string) to a fully capitalized string (ExampleString)
	 * @param value {string} The string to convert
	 * @returns {string} The capitalized string
	 */
	function dashesToCapitalized( value )
	{
		return value.replace( /(?:\-|^)[a-z\d]/g, function( x )
		{
			return x[x.length - 1].toUpperCase();
		} );
	}

	/**
	 * Converts all forward slashes in a string to underscores
	 * @param string The string to convert
	 * @returns {*} The converted string
	 */
	function slashToUnderscore ( string )
	{
		return string.replace( /\//g, '_' );
	}
};