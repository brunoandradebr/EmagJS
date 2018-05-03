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


        // ******************************************
        // ******* TODO - create Camera class *******
        // ******************************************

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
         * @type {EmagJs.Core.Render.Sprite}
         */
        this.cameraDebug = new Sprite(new Vector(0, 0), 0, 0, 'transparent', 2, 'purple')

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