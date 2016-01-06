/**
 * @name Browser
 * @author Mient-jan Stelling
 * @description a replacement of the mootools Browser static class
 * @todo add type of device like iphone, tablet, andriod phone, tablet
 */

interface IBrowser {
	userAgent:string;

	name:string;
	version:number;
	platform:string;
	//device:string;

	// browser name
	chrome?:boolean;
	firefox?:boolean;
	safari?:boolean;
	ie?:boolean;
	opera?:boolean;

	// ie name version
	ie6?:boolean;
	ie7?:boolean;
	ie8?:boolean;
	ie9?:boolean;
	ie10?:boolean;
	ie11?:boolean;

	// platform
	windows?:boolean;
	mac?:boolean;
	linux?:boolean;
	ios?:boolean;
	android?:boolean;
	webos?:boolean;
	other?:boolean;

	isIPhone4Or4s:() => boolean;
}

var Browser:IBrowser = <IBrowser> (function(){

	var document = window.document;

	function parse (userAgent:string, platform):IBrowser
	{
		var ua = userAgent.toLowerCase();
		platform = (platform ? platform.toLowerCase() : '');

		var UAArr = ua.match(/(opera|ie|firefox|chrome|trident|crios|version)[\s\/:]([\w\d\.]+)?.*?(safari|(?:rv[\s\/:]|version[\s\/:])([\w\d\.]+)|$)/) || [null, 'unknown', 0];

		if (UAArr[1] == 'trident'){
			UAArr[1] = 'ie';
			if (UAArr[4]) UAArr[2] = UAArr[4];
		} else if (UAArr[1] == 'crios'){
			UAArr[1] = 'chrome';
		}

		platform = ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0];
		if (platform == 'win'){
			platform = 'windows';
		}

		return <IBrowser> {
			userAgent: userAgent,
			name: '' + ((UAArr[1] == 'version') ? UAArr[3] : UAArr[1]),
			version: parseFloat(<string> (( UAArr[1] == 'opera' && UAArr[4]) ? UAArr[4] : UAArr[2]) ),
			platform: '' + platform,

			isIPhone4Or4s:function(){
				return platform == 'ios' && (window.screen.height == (960 / 2));
			}
		};
	}

	var Browser = parse(navigator.userAgent, navigator.platform);

	// ie11 fix
	if (Browser.name !== 'firefox' && Browser.name !== 'chrome' && Browser.name !== 'safari' && !window['ActiveXObject'] && Browser.name != 'ie')
	{
		Browser.name = 'ie';
		Browser.version = 11;
	}

	if (Browser.name == 'ie')
	{
		Browser.version = document['documentMode'];
	}

	Browser[Browser.name] = true;
	Browser[Browser.name + Browser.version] = true;
	Browser[Browser.platform] = true;

	return Browser;
})();

export default Browser;