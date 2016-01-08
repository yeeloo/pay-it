module.exports = function( grunt )
{
	var path = require( 'path' );
	var Mustache = require( 'mustache' );
	require( "amd-loader" );

	grunt.registerMultiTask( 'scaffold-pages', 'Scaffold pages from the Gaia Sitemap', function()
	{
		var flattenedSitemap = getFlattenedSitemap();

		// Initialize an results object with an empty array for each scaffold config
		var results = Object.keys( scaffoldConfigs ).reduce( function( prev, current )
		{
			prev[current] = [];
			return prev;
		}, {} );

		flattenedSitemap.forEach( function( page )
		{
			var targets = getScaffoldTargets( page );

			Object.keys( targets ).forEach( function( scaffoldName )
			{
				targets[scaffoldName].forEach( function( target )
				{
					var scaffoldConfig = scaffoldConfigs[scaffoldName];
					var template = getTemplate(scaffoldConfig.template);

					var scaffoldResult = scaffold( template, page, target, targets, scaffoldName );
					results[scaffoldName].push( scaffoldResult );
				} );
			} );
		} );

		scaffoldBranches( flattenedSitemap );
		scaffoldStyleCollectionFile( results );
	} );

	/**
	 * Array of configuration per file that needs to be created for each page. Properties:
	 *  - defaultPath {function} A function that takes a pageid and returns a filename and subdirectory to use
	 *  if there is not custom path set in the sitemap.
	 *  - directory {string} A string id of the grunt config containing the directory to place the file in.
	 *  - rootDirectory {string} (optional) A directory to prepend to the path where the file should be created.
	 *  - template {string} The filename of the .mustache template file to use for scaffolding
	 *  - configKey {string} Name of the key in the sitemap pages for the configuration value of this file.
	 *  - extension {string} The extension of the file to scaffold
	 *  - render {function} A function that will be called with the page and path info that should render and
	 *  write the file
	 */
	var scaffoldConfigs = {
		html: {
			defaultPath: function( pageid )
			{
				return {
					filename: pageid,
					subdirectory: null
				};
			},
			directory: 'html',
			template: 'html',
			configKey: 'template',
			extension: '.html',
			render: renderHtml
		},
		style: {
			defaultPath: function( pageid )
			{
				return {
					filename: '_' + pageid,
					subdirectory: null
				};
			},
			directory: 'style',
			template: 'scss',
			configKey: 'template',
			extension: '.scss',
			render: renderScss
		},
		controller: {
			defaultPath: function( pageid )
			{
				return {
					filename: dashesToCapitalized( pageid ) + 'PageController',
					subdirectory: pageid
				};
			},
			directory: 'pageScript',
			rootDirectory: 'script',
			template: 'controller',
			configKey: 'controller',
			extension: '.ts',
			render: renderScript
		},
		viewModel: {
			defaultPath: function( pageid )
			{
				return {
					filename: dashesToCapitalized( pageid ) + 'PageViewModel',
					subdirectory: pageid
				};
			},
			directory: 'pageScript',
			rootDirectory: 'script',
			template: 'viewModel',
			configKey: 'viewModel',
			extension: '.ts',
			render: renderScript
		}
	};

	/**
	 * Returns a map of files to scaffold for the given page.
	 * @param page The page object as returned by getFlattenedSitemap() for the page to scaffold
	 * @returns {object} The files to scaffold. The keys of the object correspond to scaffold types defined in
	 * the scaffoldConfigs array. The values are arrays of filename/directory pairs of target files.
	 */
	function getScaffoldTargets( page )
	{
		var targets = {};

		Object.keys( scaffoldConfigs ).forEach( function( scaffoldName )
		{
			targets[scaffoldName] = [];

			var scaffoldConfig = scaffoldConfigs[scaffoldName];
			var defaultPath = scaffoldConfig.defaultPath( page.data.id );

			var defaultSubdirectory = defaultPath.subdirectory || "";

			var appDirectory = grunt.config( 'scaffold-pages.options.directories.' + scaffoldConfig.directory );
			var mobileDirectory = grunt.config( 'scaffold-pages.options.mobileDirectories.' + scaffoldConfig.directory );

			var folderConfig = page.data.folder;
			if( folderConfig && appDirectory )
			{
				appDirectory = path.join( appDirectory, folderConfig );
			}
			if( folderConfig && mobileDirectory )
			{
				mobileDirectory = path.join( mobileDirectory, folderConfig );
			}


			var addScaffoldTarget = function( configValue )
			{
				switch( true )
				{
					case typeof configValue == 'object':
						if( configValue.app )
						{
							addScaffoldTarget( configValue.app );
						}
						if( configValue.mobile )
						{
							addScaffoldTarget( configValue.mobile );
						}
						break;

					case configValue == 'mobile':
					case typeof configValue == 'undefined':
						targets[scaffoldName].push( {
							directory: path.join( appDirectory, defaultSubdirectory ),
							filename: defaultPath.filename
						} );
						if( mobileDirectory && configValue == 'mobile' )
						{
							targets[scaffoldName].push( {
								directory: path.join( mobileDirectory, defaultSubdirectory ),
								filename: defaultPath.filename
							} );
						}
						break;
					case configValue != 'default':
						var parsedConfigVale = path.parse( configValue );

						targets[scaffoldName].push( {
							directory: path.join( appDirectory, parsedConfigVale.dir ),
							filename: parsedConfigVale.name
						} );
						break;
				}
			};

			addScaffoldTarget( page.data[scaffoldConfig.configKey.toLowerCase()] || page.data[scaffoldConfig.configKey] );
		} );

		return targets;
	}

	/**
	 * Retrieves a template with the given filename. Will read it from a file if it is not yet read into memory.
	 * @param filename {string} Filename of the .mustache template
	 */
	var getTemplate = (function() {
		var templates = {};

		return function(filename) {
			if( !templates[filename] )
			{
				var templatePath = path.join( grunt.config.data.gruntDir, 'tasks/scaffold-pages/' + filename + '.mustache' );
				templates[filename] = grunt.file.read( templatePath );
			}
			return templates[filename];
		}
	}());

	/**
	 * Scaffolds a single file.
	 * @param template {string} The mustache template to use for rendering
	 * @param page {object} A page object as returned by getFlattenedSitemap(). Contains a reference to the page
	 * in the sitemap, the page type and the path to the page.
	 * @param target The target object as returned by getScaffoldTargets(), containing the filename and directory
	 * where the page should be created.
	 * @param allTargets A map of all the targets by scaffold type.
	 * @param scaffoldName The scaffold type (on of the types defined in scaffoldConfigs).
	 * @returns Object containing the following properties:
	 *  - exists {{boolean}} True if the file already existed,
	 *  - modified {{boolean}} True if the file was modified or created
	 *  - path {{string}} The full path to the file created
	 *  - page: {{object}} The page object for this scaffold as returend by getFlattenedSitemap()
	 *  - filename: {{string}} The filename of the file created
	 */
	function scaffold( template, page, target, allTargets, scaffoldName )
	{
		var scaffoldConfig = scaffoldConfigs[scaffoldName];

		var fullPathParts = [target.directory, target.filename + scaffoldConfig.extension];
		if( scaffoldConfig.rootDirectory )
		{
			fullPathParts.unshift( grunt.config( 'scaffold-pages.options.directories.' + scaffoldConfig.rootDirectory ) );
		}
		var fullPath = path.join.apply( path, fullPathParts );

		var exists = grunt.file.exists( fullPath );
		var modified = scaffoldConfig.render( template, page, target, allTargets, fullPath, exists );

		return {
			exists: exists,
			modified: modified,
			path: fullPath,
			page: page,
			filename: target.filename
		};
	}

	/**
	 * Creates a style collection file based on the previously scaffolded files.
	 * @param scaffoldResults An array of scaffold results as returned by the scaffold() method
	 * @returns {boolean} True if the style collection file has been modified.
	 */
	function scaffoldStyleCollectionFile( scaffoldResults )
	{
		var directory = grunt.config( 'scaffold-pages.options.directories.style' );
		var filename = grunt.config( 'scaffold-pages.options.styleCollectionFilename' );
		var fullPath = path.join( directory, filename );
		var content = '';

		if( grunt.file.exists( fullPath ) )
		{
			content += grunt.file.read( fullPath );
		}

		var importsRegex = /@import\s+['"]_?([^'".]+)(?:\.scss)?['"]/g;
		var result;
		var imports = [];
		var newImports = [];
		while( result = importsRegex.exec( content ) )
		{
			imports.push( result[1] );
		}

		scaffoldResults.style.forEach( function( result )
		{
			var scssPathParts = [result.filename.replace( /^_/, '' )];
			if( result.page.data.folder )
			{
				scssPathParts.unshift( result.page.data.folder.replace( /\/$/, '' ).replace( /^\//, '' ) );
			}
			var scssPath = scssPathParts.join( '/' );
			if( imports.indexOf( scssPath ) == -1 && newImports.indexOf( scssPath ) == -1 )
			{
				newImports.push( scssPath );
			}
		} );

		if(!newImports.length) {
			return false;
		}

		newImports.forEach( function( scssPath )
		{
			content += '\n@import "' + scssPath + '";';
		} );

		grunt.log.writeln( 'Writing ' + filename );
		grunt.file.write( fullPath, content );

		return true;
	}

	/**
	 * Loads the sitemap JS file using the amd-loader module, and recurses into the pages and popups to flatten them
	 * into an array. Each entry in the array contains a reference to the configuration in the sitemap, the path
	 * to the page (all the parent page ids) and the type of page (page or popup).
	 * @returns {Array} A list of target pages.
	 */
	function getFlattenedSitemap()
	{
		var fullSitemapPath = path.join( process.cwd(), grunt.config( 'scaffold-pages.options.sitemapPath' ) );
		var sitemap = require( fullSitemapPath ).default;
		var flattened = [];
		var types = {
			pages: 'page',
			popups: 'popup'
		};

		function addChildren( pageContainer, path )
		{
			var newPath = [];
			if( path )
			{
				newPath = path.slice( 0 );
				newPath.push( pageContainer.id );
			}

			Object.keys( types ).forEach( function( key )
			{
				var type = types[key];
				if( pageContainer[key] )
				{
					pageContainer[key].forEach( function( data )
					{
						flattened.push( {
							data: data,
							path: newPath,
							type: type
						} );

						addChildren( data, newPath );
					} );
				}
			} );
		}

		addChildren( sitemap );
		return flattened;
	}

	/**
	 * Renders an HTML template
	 * @param template {string} The mustache template to use for rendering
	 * @param page {object} A page object as returned by getFlattenedSitemap(). Contains a reference to the page
	 * in the sitemap, the page type and the path to the page.
	 * @param target The target object as returned by getScaffoldTargets(), containing the filename and directory
	 * where the page should be created.
	 * @param allTargets A map of all the targets by scaffold type.
	 * @param fullPath The full path to the file to create
	 * @param exists A boolean indicating if the file already exists
	 * @returns {boolean} A boolean indicating if the file was created or modified
	 */
	function renderHtml( template, page, target, allTargets, fullPath, exists )
	{
		if( exists )
		{
			return false;
		}
		var data = {
			title: page.data.title || page.data.id
		};

		grunt.log.writeln( 'Creating ' + fullPath );
		grunt.file.write( fullPath, Mustache.render( template, data ) );
		return true;
	}

	/**
	 * Renders a SCSS style file
	 * @param template {string} The mustache template to use for rendering
	 * @param page {object} A page object as returned by getFlattenedSitemap(). Contains a reference to the page
	 * in the sitemap, the page type and the path to the page.
	 * @param target The target object as returned by getScaffoldTargets(), containing the filename and directory
	 * where the page should be created.
	 * @param allTargets A map of all the targets by scaffold type.
	 * @param fullPath The full path to the file to create
	 * @param exists A boolean indicating if the file already exists
	 * @returns {boolean} A boolean indicating if the file was created or modified
	 */
	function renderScss( template, page, target, allTargets, fullPath, exists )
	{
		if( exists )
		{
			return false;
		}

		var data = {
			id: page.data.id
		};

		grunt.log.writeln( 'Creating ' + fullPath );
		grunt.file.write( fullPath, Mustache.render( template, data ) );
		return true;
	}

	/**
	 * Renders a TypeScript file (controller or viewmodel)
	 * @param template {string} The mustache template to use for rendering
	 * @param page {object} A page object as returned by getFlattenedSitemap(). Contains a reference to the page
	 * in the sitemap, the page type and the path to the page.
	 * @param target The target object as returned by getScaffoldTargets(), containing the filename and directory
	 * where the page should be created.
	 * @param allTargets A map of all the targets by scaffold type.
	 * @param fullPath The full path to the file to create
	 * @param exists A boolean indicating if the file already exists
	 * @returns {boolean} A boolean indicating if the file was created or modified
	 */
	function renderScript( template, page, target, allTargets, fullPath, exists )
	{
		if( exists )
		{
			return false;
		}

		var data = {};
		if( allTargets['viewModel'].length )
		{
			data.viewModelName = allTargets['viewModel'][0].filename;
			// we replace '\' (generated by path.join) to '/' (needed in require calls)
			data.viewModelPath = path.join(allTargets['viewModel'][0].directory,
					allTargets['viewModel'][0].filename).replace( /\\/g, '/' );

		}
		if( allTargets['controller'].length )
		{
			data.controllerName = allTargets['controller'][0].filename;
			// we replace '\' (generated by path.join) to '/' (needed in require calls)
			data.controllerPath = path.join(allTargets['controller'][0].directory,
					allTargets['controller'][0].filename).replace( /\\/g, '/' );

		}

		grunt.log.writeln( 'Creating ' + fullPath );
		grunt.file.write( fullPath, Mustache.render( template, data ) );
		return true;
	}

	/**
	 * Scaffolds the Branches TypeScript file based on the flattened sitemap returned by getFlattenedSitemap()
	 * @param flattenedSitemap The sitemap
	 */
	function scaffoldBranches( flattenedSitemap )
	{
		var template = grunt.file.read( path.join( grunt.config.data.gruntDir, 'tasks/scaffold-pages/branches.mustache' ) );
		var data = {
			pages: flattenedSitemap.map( function( page )
			{
				return {
					id: page.data.id.toUpperCase().replace( /(-)/gi, '_' ),
					prefix: (page.type == 'popup') ? 'POPUP_' : '',
					branch: page.path.filter(function(path) {
						return path;
					} ).join( '/' ) + '/' + page.data.id
				}
			} )
		};
		var branchesPath = path.join( process.cwd(), grunt.config( 'scaffold-pages.options.branchesPath' ) );


		grunt.log.writeln( 'Writing Branches file' );
		grunt.file.write( branchesPath, Mustache.render( template, data ) );
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
};