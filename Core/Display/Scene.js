/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Scene
 */
class Scene {

    /**
     * 
     * @param {string} id 
     * @param {object} definition 
     */
    constructor(id, definition) {

        // default definitions
        Object.assign(this, {
            FPS: 60,                          // scene's fps - render and update
            x: 0,                             // scene's position x
            y: 0,                             // scene's position y
            width: definition.parent.width,   // scene's width
            height: definition.parent.height, // scene's height
            camera: null,                     // camera object
            scale: 1,                         // scene's scale factor - how much camera resolution(width-height) will be scaled to fit movie's width and height
            fullscreen: false,                // full screen mode - if true ignores camera, and fit movie's dimensions - device size
            blend: 'none',
            autoclear: true,                  // clear canvas before new draw
            onCreate: function () { },
            onEnter: function () { },
            index: 0,                         // depth order
        })

        // merge default with custom definition
        Object.assign(this, definition);

        /**
         * scene's canvas
         * 
         * @type {HTMLElement}
         */
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', id + '-scene');
        this.canvas.setAttribute('class', 'scene');

        // scene's dimensions
        this.canvas.width = this.width || this.parent.width;
        this.canvas.height = this.height || this.parent.height;
        this.canvas.style.width = (this.width || this.parent.width) + 'px';
        this.canvas.style.height = (this.height || this.parent.height) + 'px';
        this.canvas.style.mixBlendMode = this.blend

        // scene's depth order
        this.canvas.style.zIndex = this.index

        // scene's position
        this.canvas.style.left = this.x + 'px';
        this.canvas.style.top = this.y + 'px';

        // scene's style
        this.canvas.style.backgroundColor = this.backgroundColor || this.parent.backgroundColor;

        /**
         * Graphics context - scene's original context where everything is drawn
         * 
         * @type {CanvasRenderingContext2D}
         */
        this.graphics = this.canvas.getContext('2d');

        // if scene has a camera
        if (this.camera) {

            /**
             * viewport's canvas
             * 
             * @type {HTMLElement}
             */
            this.viewport = document.createElement('canvas')
            this.viewport.setAttribute('id', id + '-scene');
            this.viewport.setAttribute('class', 'scene');

            // viewport's dimensions
            this.viewport.width = this.camera.width
            this.viewport.height = this.camera.height

            // viewport's depth order
            this.viewport.style.zIndex = this.index

            // viewport's style
            this.viewport.style.backgroundColor = this.backgroundColor

            /** 
             * Graphics context - scaled graphics context
             *                    original context is copied to this context and scaled to camera's dimensions
             * 
             * @type {CanvasRenderingContext2D}
             */
            this.viewport.graphics = this.viewport.getContext('2d')

        }

        /**
         * Horizontal scene offset from left edge
         * 
         * @type {number}
         */
        this.offsetX = 0

        /**
         * Vertical scene offset from top edge
         * 
         * @type {number}
         */
        this.offsetY = 0

        // scale and position viewport canvas
        this.scaleViewport(this.fullscreen)

        /**
         * fixed delta time with variant fps
         * 
         * @type {number}
         */
        this.dt = 1000 / this.FPS

        /**
         * Accumulates time between frames
         * 
         * @type {number}
         */
        this.accumulatedTime = 0

        /**
         * 
         * @type {DOMHighResTimeStamp}
         */
        this.lastTime = window.performance.now();

        /**
         * Loop id
         * 
         * @type {requestAnimationFrame}
         */
        this.RAF = null

        /**
         * @type {boolean}
         */
        this.paused = false

        /**
         * when scene is on debug mode
         * 
         * @type {EmagJS.Core.Render.Sprite}
         */
        this.cameraDebug = new Sprite(new Vector(0, 0), 0, 0, 'transparent', 2, 'purple')

    }

    /**
     * Plays it's loop
     * 
     * @return {void}
     */
    play() {
        this.paused = false
        this.onCreate(this)
        this.onEnter(this)
        this.lastTime = window.performance.now()
        this.loop(window.performance.now())
    }

    /**
     * Pauses it's loop
     * 
     * @return {void}
     */
    pause() {
        this.paused = true
        window.cancelAnimationFrame(this.RAF)
    }

    /**
     * Destroys it's loop
     * 
     * @return {void}
     */
    destroy() {
        this.paused = true
        window.cancelAnimationFrame(this.RAF)
        this.RAF = null
    }

    /**
     * Resumes it's loop
     * 
     * @return {void}
     */
    resume() {
        this.onEnter(this)
        this.paused = false
        this.accumulatedTime = 0
        this.lastTime = window.performance.now()
        this.loop(window.performance.now())
    }

    /**
     * Scene's animation loop
     * 
     * @param {DOMHighResTimeStamp} time 
     */
    loop(time) {

        // calculates delta time between last frame and current frame
        let frameTime = (time - this.lastTime)
        this.lastTime = time

        // prevent spiral of death!
        if (frameTime > 1000)
            frameTime = 1000

        // accumulates total time between frames
        this.accumulatedTime += frameTime

        // if scene has loop callback
        if (this.onLoop) {

            // run the animation at the same time on all hardware speed
            // executes all accumulated time by this.dt portions
            while (this.accumulatedTime >= this.dt) {

                // scene loop callback - I'm multiplying by 50 to work with low numbers like gravity = 0.4
                this.onLoop(this, this.dt * 0.05);

                this.accumulatedTime -= this.dt
            }

        }

        // clear scene's canvas

        // if scene has camera, clear only camera's rect
        if (this.autoclear) {
            if (this.camera) {
                this.graphics.clearRect(this.camera.x, this.camera.y, this.camera.width, this.camera.height);
            } else {
                // if there's no camera, clear all canvas
                this.graphics.clearRect(0, 0, this.width, this.height);
            }
        }

        // save scene state
        this.graphics.save()

        // scale scene
        if (this.camera)
            this.graphics.scale(this.camera.zoomScale, this.camera.zoomScale)

        // scene's draw operation
        if (this.onDraw)
            this.onDraw(this)

        // restore scene state
        this.graphics.restore()

        // if scene has camera, draw to viewport only what camera is watching
        if (this.camera) {

            let xDraw = this.camera.x < 0 ? 0 : this.camera.x
            let yDraw = this.camera.y < 0 ? 0 : this.camera.y

            this.viewport.graphics.clearRect(0, 0, this.viewport.width, this.viewport.height);
            this.viewport.graphics.drawImage(this.canvas, xDraw, yDraw, this.camera.width, this.camera.height, 0, 0, this.camera.width, this.camera.height)

        } else {

            // if scene has no camera, draw everything inside original scene canvas
            this.graphics.drawImage(this.canvas, 0, 0)

        }

        // show camera
        if (this.debug) {
            if (this.camera) {
                this.cameraDebug.position.x = (this.camera.x + this.camera.width * 0.5) + (this.cameraDebug.lineWidth * 0.5)
                this.cameraDebug.position.y = (this.camera.y + this.camera.height * 0.5) + (this.cameraDebug.lineWidth * 0.5)
                this.cameraDebug.width = this.camera.width
                this.cameraDebug.height = this.camera.height
                this.cameraDebug.draw(this.graphics)
            }
        }

        // /render

        // request a new repaint
        if (!this.paused)
            this.RAF = window.requestAnimationFrame(this.loop.bind(this))

    }

    /**
     * Scales scene's graphic context
     * 
     * if fullscreen is true, scales graphics context to fit device dimensions
     * else, scales graphics to scene's camera dimensions - if is set - or scales to scene's dimensions
     *       and updates scene's scale factor
     * 
     * @param {bool} fullscreen
     * 
     * @return void 
     */
    scaleViewport(fullscreen) {
        if (fullscreen) {
            this.width = DEVICE_WIDTH
            this.height = DEVICE_HEIGHT
            this.canvas.width = this.width
            this.canvas.height = this.height
            this.canvas.style.width = this.width + 'px'
            this.canvas.style.height = this.height + 'px'
            this.offsetX = this.offsetY = 0
        } else {
            if (this.camera) {
                this.scale = keepAspectRatio(this.camera.width, this.camera.height)
                this.viewport.style.width = this.camera.width * this.scale + 'px'
                this.viewport.style.height = this.camera.height * this.scale + 'px'
                this.offsetX = ((this.parent.width - this.camera.width * this.scale) * 0.5)
                this.offsetY = ((this.parent.height - this.camera.height * this.scale) * 0.5)
                this.viewport.style.left = this.offsetX + 'px'
                this.viewport.style.top = this.offsetY + 'px'
            } else {
                this.scale = keepAspectRatio(this.width, this.height)
                this.canvas.style.width = this.width * this.scale + 'px'
                this.canvas.style.height = this.height * this.scale + 'px'
                this.offsetX = ((this.parent.width - this.width * this.scale) * 0.5)
                this.offsetY = ((this.parent.height - this.height * this.scale) * 0.5)
                this.canvas.style.left = this.offsetX + 'px'
                this.canvas.style.top = this.offsetY + 'px'
            }
        }
    }

}