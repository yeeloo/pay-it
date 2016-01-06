import MediaElement from './MediaElement';
import Browser from './Browser';

/**
 * Base AudioElement to use as the base class for all audioElement related stuff
 *
 * @author Mient-jan Stelling
 *
 * @namespace temple.utils
 * @class AudioElement
 * @extends temple.utils.MediaElement
 */
class AudioElement extends MediaElement {

	public element:HTMLAudioElement;

	/**
	 * Base audioElement to use as the base class for all audioElement related stuff
	 *
	 * @class AudioElement
	 * @constructor
	 * @param element [AudioElement]
	 */
	constructor(element:HTMLAudioElement = null){
		if(element == null){
			// should be replaced with a more abstract version of the video Element.
			element = document.createElement('audio');
		}

		super(element);
	}

}

export default AudioElement;