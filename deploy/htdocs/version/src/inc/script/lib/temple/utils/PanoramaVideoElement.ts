import VideoElement from './VideoElement';
import Browser from './Browser';
import PanoramaVideoVertex from './panorama/PanoramaVideoVertex';
import PanoramaVideoFragment from './panorama/PanoramaVideoFragment'

/**
 * PanoramaVideoElement renders projected video element to canvas using webgl
 *
 * @namespace temple.utils
 * @class VideoElement
 * @extends temple.utils.VideoElement
 * @author Victor Garrido and Reinder Nijhoff
 */
class PanoramaVideoElement extends VideoElement
{
	public canvas:HTMLCanvasElement;
	public element:HTMLVideoElement;

	private _glContext:WebGLRenderingContext;
	private _videoTexture:WebGLTexture;
	private _glProgram:WebGLProgram;
	private _glBuffer:WebGLBuffer;

	private _posterImageLoaded:boolean;
	private _videoIsPlaying:boolean;

	private _videoFrameRate:number = 30;
	private _interval:number = 1000 / this._videoFrameRate;
	private _lastUpdateTime:number = new Date().getTime();

	private _startX:number;
	private _startY:number;
	private _startYaw:number;
	private _startPitch:number;
	private _currentX:number;
	private _currentY:number;
	private _userInteracting:boolean = false;
	private _userInteractionEnabled:boolean = true;

	private _update:(timestamp:number) => void;

	//Uniform properties
	private _uniforms:{yaw:number; pitch:number; fov:number; resolution: {w:number; h:number;}} = {
		yaw: 0,
		pitch: 0,
		fov: 90,
		resolution: {w: 160, h: 90}
	};
	private _uniformLocations:{yaw:number; pitch:number; fov:number; texture:number; resolution:number; position:number} = {
		yaw: 0,
		pitch: 0,
		fov: 0,
		texture: 0,
		resolution: 0,
		position: 0
	};

	/**
	 * PanoramaVideoElement renders projected video element to canvas using webgl
	 *
	 * @class PanoramaVideoElement
	 * @constructor
	 * @param canvas [HTMLCanvasElement]
	 */
	constructor(canvas:HTMLCanvasElement = null)
	{
		super(null);

		if (canvas == null)
		{
			canvas = document.createElement('canvas');
		}
		this.canvas = canvas;

		this.setupWebGL();
		this.setupEvents();

		if (this.getPoster())
		{
			this.loadPosterToTexture(this.getPoster());
		}

		this._update = <(timestamp:number)=>void>this.handleUpdate.bind(this);
		this._update(0);
	}

	protected setupEvents()
	{
		this.addEventListener(VideoElement.EVENT_PLAYING, () =>
		{
			this._videoIsPlaying = true;
		});
		this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
		this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
		this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
		this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
	}

	private setupWebGL()
	{
		this._glContext = this.canvas.getContext('experimental-webgl');

		// Disable depth test
		this._glContext.disable(this._glContext.DEPTH_TEST);

		// Create vertex buffer
		this._glBuffer = this._glContext.createBuffer();
		this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._glBuffer);
		this._glContext.bufferData(this._glContext.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]), this._glContext.STATIC_DRAW);

		// Create Program
		this._glProgram = this.createProgram();

		// Get uniform locations;
		this._uniformLocations.resolution = <number>this._glContext.getUniformLocation(this._glProgram, 'resolution');
		this._uniformLocations.texture = <number>this._glContext.getUniformLocation(this._glProgram, 'texture');
		this._uniformLocations.fov = <number>this._glContext.getUniformLocation(this._glProgram, 'fov');
		this._uniformLocations.yaw = <number>this._glContext.getUniformLocation(this._glProgram, 'yaw');
		this._uniformLocations.pitch = <number>this._glContext.getUniformLocation(this._glProgram, 'pitch');
		this._uniformLocations.position = <number>this._glContext.getUniformLocation(this._glProgram, 'position');

		// create texture
		this._videoTexture = this.createTexture();
	}

	/**
	 * Set current pan of panorama
	 *
	 * @class PanoramaVideoElement
	 * @constructor
	 * @param pan [number]
	 */
	public setPan(pan:number):void
	{
		this._uniforms.yaw = ((360 - pan) % 360);
	}

	/**
	 * Set current tilt of panorama
	 *
	 * @class PanoramaVideoElement
	 * @constructor
	 * @param tilt [number]
	 */
	public setTilt(tilt:number):void
	{
		this._uniforms.pitch = -tilt;
	}

	/**
	 * Set current field of view of panorama (default 90)
	 *
	 * @class PanoramaVideoElement
	 * @constructor
	 * @param fov [number]
	 */
	public setFov(fov:number):void
	{
		this._uniforms.fov = fov;
	}

	/**
	 * Set userinteraction enabled. When enabled user can use mouse to look around
	 *
	 * @class PanoramaVideoElement
	 * @constructor
	 * @param enabled [boolean]
	 */
	public setUserInteractionEnabled(enabled:boolean):void
	{
		this._userInteractionEnabled = enabled;
	}

	/**
	 * Set video framerate. Texture used to project panorama will be update using this framerate (at max)
	 *
	 * @class PanoramaVideoElement
	 * @constructor
	 * @param fps [number]
	 */
	public setVideoFrameRate(fps:number):void
	{
		this._videoFrameRate = fps;
		this._interval = 1000 / this._videoFrameRate;
	}

	public getCanvas():HTMLCanvasElement
	{
		return this.canvas;
	}

	/**
	 * Is a DOMString that reflects the width HTML attribute, which specifies the width of the display area, in CSS pixels.
	 *
	 * @method getWidth
	 * @return number
	 */
	public getWidth():number
	{
		return this.canvas.width;
	}

	/**
	 * Is a DOMString that reflects the width HTML attribute, which specifies the width of the display area, in CSS pixels.
	 *
	 * @method setWidth
	 * @param value {number}
	 * @return void
	 */
	public setWidth(value:number)
	{
		this.canvas.width = value;
	}

	/**
	 * Is a DOMString that reflects the height HTML attribute, which specifies the height of the display area, in CSS pixels.
	 *
	 * @method getHeight
	 * @return number
	 */
	public getHeight():number
	{
		return this.canvas.height;
	}

	/**
	 * Is a DOMString that reflects the height HTML attribute, which specifies the height of the display area, in CSS pixels.
	 *
	 * @method setHeight
	 * @param value {number}
	 * @return void
	 */
	public setHeight(value:number)
	{
		this.canvas.height = value;
	}

	/**
	 * A URL indicating a poster frame to show until the user plays or seeks.
	 *
	 * @method setPoster
	 * @param value {string}
	 * @return void
	 */
	public setPoster(value:string)
	{
		this.element.poster = value;
		this.loadPosterToTexture(value);
	}

	handleUpdate(timestamp:number):void
	{
		if (!this._posterImageLoaded && !this._videoIsPlaying)
		{
			requestAnimationFrame(this._update);
			return;
		}

		var now = new Date().getTime();
		var delta = now - this._lastUpdateTime;

		if (delta > this._interval)
		{
			this.updateTexture();
			this._lastUpdateTime = now - (delta % this._interval);
		}

		this.updateUserInteractionProperties();
		this.updateResolutionProperties();

		// Load program into GPU
		this._glContext.useProgram(this._glProgram);
		this._glContext.bindTexture(this._glContext.TEXTURE_2D, this._videoTexture);

		// Pass uniforms to shaders
		this._glContext.uniform2f(this._uniformLocations.resolution, this._uniforms.resolution.w, this._uniforms.resolution.h);
		this._glContext.uniform1i(this._uniformLocations.texture, 0);
		this._glContext.uniform1f(this._uniformLocations.fov, this._uniforms.fov);
		this._glContext.uniform1f(this._uniformLocations.yaw, this._uniforms.yaw);
		this._glContext.uniform1f(this._uniformLocations.pitch, -this._uniforms.pitch);

		// Render geometry
		this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._glBuffer);
		this._glContext.vertexAttribPointer(this._uniformLocations.position, 2, this._glContext.FLOAT, false, 0, 0);
		this._glContext.enableVertexAttribArray(this._uniformLocations.position);
		this._glContext.drawArrays(this._glContext.TRIANGLES, 0, 6);
		this._glContext.disableVertexAttribArray(this._uniformLocations.position);

		requestAnimationFrame(this._update);
	}

	updateResolutionProperties():void
	{
		if (this._uniforms.resolution.w != this.canvas.width || this._uniforms.resolution.h != this.canvas.height)
		{
			this._uniforms.resolution.w = this.canvas.width;
			this._uniforms.resolution.h = this.canvas.height;
			this._glContext.viewport(0, 0, this.canvas.width, this.canvas.height);
		}
	}

	// TODO: Narie: This will probably not work correctly on mobile
	// IOS needs originalEvent, and android needs originalEvent.touches[0], and both need pageX instead of clientX
	//
	// var touch = (<any>event.originalEvent).touches && (<any>event.originalEvent).touches[0] || (<any>event.originalEvent);
	// touch.pageX;
	private handleMouseDown(event:any):boolean
	{
		this._startX = event.clientX;
		this._startY = event.clientY;

		this._startYaw = this._uniforms.yaw;
		this._startPitch = this._uniforms.pitch;

		this._currentX = event.clientX;
		this._currentY = event.clientY;

		this._userInteracting = true;
		return false;
	}

	private handleMouseUp():boolean
	{
		this._userInteracting = false;
		return false;
	}

	private handleMouseMove(event:any):boolean
	{
		if (this._userInteracting)
		{
			this._currentX = event.clientX;
			this._currentY = event.clientY;
		}
		return false;
	}

	private updateUserInteractionProperties():void
	{
		if (this._userInteracting && this._userInteractionEnabled)
		{
			var dx = this._uniforms.fov * (this._currentX - this._startX) / this.canvas.width;
			var dy = this._uniforms.fov * (this._currentY - this._startY) / this.canvas.width;

			this._uniforms.yaw = this._startYaw - dx;
			this._uniforms.pitch = this._startPitch + dy;
		}

		this._uniforms.yaw = (this._uniforms.yaw + 360) % 360;
	}

	createProgram():WebGLProgram
	{
		var program = this._glContext.createProgram();

		var vs = this.createShader('' + new PanoramaVideoVertex(), this._glContext.VERTEX_SHADER);
		var fs = this.createShader('' + new PanoramaVideoFragment(), this._glContext.FRAGMENT_SHADER);

		if (vs == null || fs == null)
		{
			return null;
		}

		this._glContext.attachShader(program, vs);
		this._glContext.attachShader(program, fs);

		this._glContext.deleteShader(vs);
		this._glContext.deleteShader(fs);

		this._glContext.linkProgram(program);

		if (!this._glContext.getProgramParameter(program, this._glContext.LINK_STATUS))
		{
			alert("ERROR:\n" +
				"VALIDATE_STATUS: " + this._glContext.getProgramParameter(program, this._glContext.VALIDATE_STATUS) + "\n" +
				"ERROR: " + this._glContext.getError());

			return null;
		}

		return program;
	}

	createShader(shaderSrc:string, shaderType:number):WebGLShader
	{
		var shader = this._glContext.createShader(shaderType);

		this._glContext.shaderSource(shader, shaderSrc);
		this._glContext.compileShader(shader);

		if (!this._glContext.getShaderParameter(shader, this._glContext.COMPILE_STATUS))
		{
			alert(( shaderType == this._glContext.VERTEX_SHADER ? "VERTEX" : "FRAGMENT" ) + " SHADER:\n" + this._glContext.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	}

	createTexture():WebGLTexture
	{
		var texture:WebGLTexture = this._glContext.createTexture();

		this._glContext.bindTexture(this._glContext.TEXTURE_2D, texture);
		this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_MAG_FILTER, this._glContext.LINEAR);
		this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_MIN_FILTER, this._glContext.LINEAR);
		this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_WRAP_S, this._glContext.CLAMP_TO_EDGE);
		this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_WRAP_T, this._glContext.CLAMP_TO_EDGE);
		this._glContext.bindTexture(this._glContext.TEXTURE_2D, null);

		return texture;
	}

	loadPosterToTexture(src:string)
	{
		var image = new Image();
		image.onload = () =>
		{
			this._glContext.bindTexture(this._glContext.TEXTURE_2D, this._videoTexture);
			this._glContext.texImage2D(this._glContext.TEXTURE_2D, 0, this._glContext.RGBA, this._glContext.RGBA, this._glContext.UNSIGNED_BYTE, image);
			this._glContext.bindTexture(this._glContext.TEXTURE_2D, null);
			this._posterImageLoaded = true;
		};
		image.src = src;
	}

	updateTexture():void
	{
		if (this._videoIsPlaying)
		{
			this._glContext.bindTexture(this._glContext.TEXTURE_2D, this._videoTexture);
			this._glContext.texImage2D(this._glContext.TEXTURE_2D, 0, this._glContext.RGBA, this._glContext.RGBA, this._glContext.UNSIGNED_BYTE, this.element);
			this._glContext.bindTexture(this._glContext.TEXTURE_2D, null);
		}
	}
}

export default PanoramaVideoElement;
