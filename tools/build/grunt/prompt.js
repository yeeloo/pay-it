module.exports = function (grunt, options)
{
	return {
		appName: {
			options: {
				questions: [
					{
						config: 'appName',
						type: 'input',
						default: 'Test App',
						message: 'What is the name of the app?'
					}
				]
			}
		},
		appBundle: {
			options: {
				questions: [
					{
						config: 'appBundle',
						type: 'input',
						default: 'com.mediamonks.test',
						message: 'What is the bundle name of the app?'
					}
				]
			}
		},
		'plugins': {
			options: {
				questions: [
					{
						config:  'plugins',
						type:    'checkbox',
						message: 'Which PhoneGap plugins do you need? (You can always install later)',
						choices: [
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git',
								name:  'Cordova Device'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git',
								name:  'Cordova In App Browser'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git',
								name: 'Cordova Dialogs (alerts)'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-splashscreen.git',
								name: 'Cordova Splashscreen'
							},
							{
								value: 'https://github.com/apache/cordova-plugin-statusbar.git',
								name: 'Cordova Statusbar'
							},
							{
								value: 'https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git',
								name: 'Native Social Share'
							},
							{
								value: 'https://github.com/phonegap-build/PushPlugin.git',
								name: 'Push Notifications'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git',
								name: 'Cordova Network connection'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-battery-status.git',
								name: 'Cordova Battery status'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-device-motion.git',
								name: 'Cordova Accelerometer'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-device-orientation.git',
								name: 'Cordova Compass'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git',
								name: 'Cordova Geolocation'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git',
								name: 'Cordova Camera capture'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-media-capture.git',
								name: 'Cordova Media capture'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-media.git',
								name: 'Cordova Media playback'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-file.git',
								name: 'Cordova Files (read/write)'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-file-transfer.git',
								name: 'Cordova File Transfer'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-vibration.git',
								name: 'Cordova Vibration'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-contacts.git',
								name: 'Cordova Contacts'
							},
							{
								value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-globalization.git',
								name: 'Cordova Globalization'
							}
						]
					}
				],
				then: function(results, done) {
					var exec = require('child_process').exec;
					var options = {
						stdout: true,
						stderr: true,
						stdin: true,
						failOnError: true,
						stdinRawMode: false
					};

					var counter = 0;

					for (var i = results.plugins.length - 1; i >= 0; i--) {
						var cmd = 'cd ' + grunt.config('appDir') + ' && phonegap local plugin add ' + results.plugins[i];

						++counter;

						exec(cmd, options, function (err, stdout, stderr) {
							if (err) {
								grunt.warn(err);
							}
							else
							{
								grunt.log.writeln('Installed plugin');
							}

							if(--counter == 0)
							{
								done();
							}
						});
					};

					return true;
				}
			}
		},
		'platforms': {
			options: {
				questions: [
					{
						config:  'platforms',
						type:    'checkbox',
						message: 'Which platforms would you like to build?',
						choices: [
							{
								value: 'ios',
								name:  'iOS'
							},
							{
								value: 'android',
								name:  'Android'
							}
						]
					}
				],
				then: function(results, done) {
					var exec = require('child_process').exec;
					var options = {
						stdout: true,
						stderr: true,
						stdin: true,
						failOnError: true,
						stdinRawMode: false
					};

					var counter = 0;

					for (var i = results.platforms.length - 1; i >= 0; i--) {
						var cmd = 'cd ' + grunt.config('appDir') + ' && phonegap build ' + results.platforms[i];

						++counter;

						exec(cmd, options, function (err, stdout, stderr) {
							if (err) {
								grunt.warn(err);
							}
							else
							{
								grunt.log.writeln('Added platform');
							}

							if(--counter == 0)
							{
								done();
							}
						});
					};

					return true;
				}
			}
		},
		'version': {
			options: {
				questions:
					[
						{
						config: 'appversion',
						type: 'list',
						message: 'What version do you want to zip?',
						choices: [
							{
								name: 'Current: ' + grunt.config('version'),
								value: grunt.config('version')
							},
							{
								name: 'Minor:   ' + grunt.config('version').split('.')[0] + '.' + (parseInt(grunt.config('version').split('.')[1])+1),
								value: grunt.config('version').split('.')[0] + '.' + (parseInt(grunt.config('version').split('.')[1])+1)
							},
							{
								name: 'Major:   ' + (parseInt(grunt.config('version').split('.')[0])+1) + '.0',
								value: (parseInt(grunt.config('version').split('.')[0])+1) + '.0'
							},
							{
								name: 'Custom:',
								value: 'custom'
							}
						]
						},
						{
							config: 'custom',
							when: function(answers) {
								if(answers.appversion === 'custom')
								{
									return true;
								}
							},
							message: 'Type the version: ',
							type: 'input',
							default: '1.0',
							validate: function(value) {
								if(value.match(/^\d{0,1}(\.\d{0,1}){0,1}$/)){
									return true;
								}
								else
								{
									return 'No version found. Fox example use: 1.2';
								}
							}
						}
					],
				then: function(result, done) {
					var versionJson = grunt.file.read('tools/build/package.json');
					var newVersion;

					if(result.appversion === 'custom')
					{
						newVersion = result.custom;
					}
					else
					{
						newVersion = result.appversion;
					}

					grunt.log.writeln('Building zip version: ' + newVersion);

					versionJson = versionJson.replace("\"appversion\": \"" + grunt.config('version') + "\"", "\"appversion\": \"" + newVersion + "\"");

					grunt.file.write('tools/build/package.json', versionJson);
					grunt.config('version', newVersion);

					done();

					return true;
				}
			}
		}
	};
};