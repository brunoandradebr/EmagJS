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
            FPS: 60,
            x: 0,                             // scene's position x
            y: 0,                             // scene's position y
            width: definition.parent.width,   // scene's width
            height: definition.parent.height, // scene's height
            camera: null,                     // camera object
            zoom: 1,                          // scene's zoom factor
            scale: 1,                         // scene's scale factor - how much camera resolution(width-height) will be scaled to fit movie's width and height
            fullscreen: false,                // full screen mode - if true ignores camera, and fit movie's dimensions
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

        // fixed delta time with variant fps
        this.dt = 1 / this.FPS
        this.accumulatedTime = 0
        this.lastTime = window.performance.now();
        this.RAF = null

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

        // scale and position viewport canvas
        this.scaleViewport(this.fullscreen)

        /**
         * when scene is on debug mode
         * 
         * @type {EmagJS.Core.Render.Sprite}
         */
        this.cameraDebug = new Sprite(new Vector(0, 0), 0, 0, 'transparent', 2, 'purple')

    }

    play() {

        this.onEnter(this)

        this.loop(0)

    }

    pause() {
        window.cancelAnimationFrame(this.RAF)
    }

    loop(time) {

        //this.onLoop(this, time)
        let frameTime = (time - this.lastTime) / 1000

        // prevent spiral of death!
        if (frameTime > 0.25)
            frameTime = 0.25

        this.accumulatedTime += frameTime

        // if scene is paused
        if (this.paused) {
            this.accumulatedTime = 0
            this.lastTime = window.performance.now()
            return false
        }

        // if scene has loop callback
        if (this.onLoop) {

            // run the animation at the same time on all hardware speed
            while (this.accumulatedTime > this.dt) {

                // if scene has a camera, draw to viewport
                // only what camera is watching
                if (this.camera) {

                    this.viewport.graphics.clearRect(0, 0, this.viewport.width, this.viewport.height);
                    this.viewport.graphics.drawImage(this.canvas, this.camera.x, this.camera.y, this.camera.width, this.camera.height, 0, 0, this.camera.width, this.camera.height)

                } else {

                    // if scene has no camera, draw everything inside original scene canvas
                    this.graphics.drawImage(this.canvas, 0, 0)

                }

                // clear scene's canvas
                if (this.camera) {
                    this.graphics.clearRect(this.camera.x, this.camera.y, this.camera.width, this.camera.height);
                } else {
                    this.graphics.clearRect(0, 0, this.width, this.height);
                }

                // save scene state
                this.graphics.save()
                // scale scene
                this.graphics.scale(this.zoom, this.zoom)

                // scene loop callback
                this.onLoop(this, this.dt * 50);

                // restore scene state
                this.graphics.restore()

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

                this.accumulatedTime -= this.dt
            }
        }

        this.lastTime = time

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
        } else {
            if (this.camera) {
                this.scale = keepAspectRatio(this.camera.width, this.camera.height)
                this.viewport.style.width = this.camera.width * this.scale + 'px'
                this.viewport.style.height = this.camera.height * this.scale + 'px'
                this.viewport.style.left = ((this.parent.width - this.camera.width * this.scale) * 0.5) + 'px'
                this.viewport.style.top = ((this.parent.height - this.camera.height * this.scale) * 0.5) + 'px'
            } else {
                this.scale = keepAspectRatio(this.width, this.height)
                this.canvas.style.width = this.width * this.scale + 'px'
                this.canvas.style.height = this.height * this.scale + 'px'
                this.canvas.style.left = ((this.parent.width - this.width * this.scale) * 0.5) + 'px'
                this.canvas.style.top = ((this.parent.height - this.height * this.scale) * 0.5) + 'px'
            }
        }
    }

}