var _s = require('grunt-available-tasks/node_modules/underscore.string');

module.exports = function (grunt, options)
{
    return {
        options: {
            filter: 'exclude',
            tasks: ['availabletasks', 'tasks', 'default'],
            sort: [
                'scaffold',
                'release',
                'debug',
                'default',
                'create-phonegap-project',
                'typescript',
                'crowdin-get',
                'crowdin-update'
            ],
            groups: {
                'Scaffolding': [
                    'scaffold',
                    'component',
                    'createjs-toolkit-animation-converter'
                ],
                'Building': [
                    'release',
                    'debug',
                    'jsonp',
                    'xmlp'
                ],
                'PhoneGap': [
                    'create-phonegap-project',
                    'pg-build-ios',
                    'pg-run-android',
                    'create-phonegap-update'
                ],
                'Other': [
                    'docs',
                    'test',
                    'typescript'
                    //'crowdin-get',
                    //'crowdin-update',
                ]
            },
            descriptions: {
                'scaffold': 'Scaffold pages from the sitemap, runs ts and sass afterwards.',
                'component': 'Creates a new component using ' + '\'grunt component --name component-name\''.green + ', runs ts and sass afterwards.',
                'createjs-toolkit-animation-converter': 'Convert createjsToolkit animations to a working AMD version. ' + 'TODO: shorter alias!'.red,
                'release': 'Runs a full release build, which compiles, concats and minifies your typescript, compiles and minifies your sass, minifies your images, etc.',
                'debug': 'Runs a debug build, skipping some parts of a full release build to make it faster but still testable. Also leaves in all debug logs.',
                'jsonp': 'Creates jsonp files from regular json files using the filename as callback function.',
                'xmlp': 'Creates jsonp files from regular xml files using the filename as callback function, passing the urlencoded xml string as parameter.',
                'typescript': 'Compiles all typescript files in your project using the typescript version in this tools/build folder.',
                'test': 'Runs the \'release\' task as a way of testing if everything runs allright. Used from TeamCity build tool.',
                'docs': 'Generates documentation. For live reload generating, install ' + '\'npm install -g yuidocjs\''.green + ' and run ' + '\'yuidoc --server -e ".ts" *\''.green + ' from the folder you want updated.',
                'express-server': 'Serves the Skeleton with Express, use the --port option to pick a port (defaults to port 3333).'
                //'crowdin-get': 'Gets newest translations from Crowdin',
                //'crowdin-update': 'Updates the translations in Crowdin from your local onces. ' + 'Use with caution!'.red
            },
            reporter: function(options) {
                var t       = options.currentTask,
                    m       = options.meta,
                    targets = '';

                if (m.header && m.groupCount) {
                    grunt.log.subhead(t.group.yellow);
                }
                if (t.targets.length > 1) {
                    targets = ' (' + t.targets.join('|') + ')';
                }
                grunt.log.writeln(' ' + _s.lpad(t.name, m.longest).cyan + '  ' + t.info.replace(/(.{30,30}[^\s]*\s)/gi, function(match, group) { return match + "\r" + _s.repeat(' ', 1 + m.longest + 2)}) + targets.green);
                grunt.log.writeln('');
            }
        },
        default: {
        }
    }
};