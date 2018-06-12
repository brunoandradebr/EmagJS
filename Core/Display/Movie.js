/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Movie - handles scenes. May have one or more scenes
 */
class Movie {


    /**
     * 
     * @param {string} id 
     * @param {object} definition 
     */
    constructor(id, definition) {

        // default movie's definition
        Object.assign(this, {
            x: 0,                            // scene's position x
            y: 0,                            // scene's position y
            width: DEVICE_WIDTH,             // movie's container width
            height: DEVICE_HEIGHT,           // movie's container height
            resolutionWidth: DEVICE_WIDTH,   // movie's original width resolution
            resolutionHeight: DEVICE_HEIGHT, // movie's original height resolution
            scale: 1,                        // how much original resolution(width-height) will be scaled to fit movie's width and height
            backgroundColor: 'transparent',  // background color
        })


        // merge default with custom definition
        Object.assign(this, definition);


        /**
         * @type {array}
         */
        this.scenes = [];


        /**
         * @type {string}
         */
        this.id = id;


        /**
         * movie's container for it's scenes
         * 
         * @type {HTMLElement}
         */
        this.container = document.createElement('div');
        this.container.setAttribute('id', this.id + '-movie');
        this.container.setAttribute('class', 'movie');

        // movie's depth order
        this.container.style.zIndex = window.performance.now() | 0;

        // movie's dimensions
        this.container.style.width = this.width + 'px';
        this.container.style.height = this.height + 'px';

        // movie's position
        this.container.style.left = this.x + 'px';
        this.container.style.top = this.y + 'px';

        // movie's style
        this.container.style.backgroundColor = this.backgroundColor;
        
        /**
         * Movie's scale factor
         * 
         * @type {number}
         */
        this.scale = keepAspectRatio(this.resolutionWidth, this.resolutionHeight)


        /**
         * Resize device or change orientation event
         * 
         * @return {void}
         */
        window.addEventListener('resize', (e) => {

            setTimeout(() => {

                // set movie's container to device size
                this.setFullscreen()

                // update movie's scale factor
                this.scale = keepAspectRatio(this.resolutionWidth, this.resolutionHeight)

                // for each movie's scenes
                for (let i in this.scenes) {

                    let scene = this.scenes[i]

                    // scale and position scene's viewport canvas
                    scene.scaleViewport(scene.fullscreen)

                    // scene has resize callback
                    if (scene.onResize)
                        // scene's resize callback
                        scene.onResize(scene)
                }

            }, 50)
        })
    }

    /**
     * Instantiates a new scene and adds to movie's scenes
     * 
     * @param {string} id 
     * @param {object} sceneDefinition
     * 
     * @return {void}
     */
    addScene(id, sceneDefinition) {

        // set scene's parent
        sceneDefinition.parent = this;

        // create new scene object
        let scene = new Scene(id, sceneDefinition);

        // add scene to movie's scene list
        this.scenes[id] = scene;
        this.scenes.length++;

        // if scene has a camera, add it's viewport canvas - where everything gonna be rendered - a scaled canvas
        if (scene.camera) {

            this.container.insertAdjacentElement('beforeend', scene.viewport)

            // if scene is on debug mode, show it's original canvas - not scaled one
            if (scene.debug) {
                this.container.appendChild(scene.canvas);
                scene.canvas.style.boxShadow = '0px 0px 0px 2px red'
            }

        } else {
            // if there is no camera, add original scene canvas
            this.container.appendChild(scene.canvas);
        }

    }

    /**
     * Plays all scenes
     * 
     * @return {void}
     */
    play() {
        for (let i in this.scenes) {
            this.scenes[i].play()
        }
    }

    /**
     * Pauses all scenes
     * 
     * @return {void}
     */
    pause() {
        for (let i in this.scenes) {
            this.scenes[i].pause()
        }
    }

    /**
     * Resumes all scenes
     * 
     * @return {void}
     */
    resume() {
        for (let i in this.scenes) {
            this.scenes[i].resume()
        }
    }

    /**
     * Set movie in full screen dimensions
     * 
     * @return {void}
     */
    setFullscreen() {
        this.width = DEVICE_WIDTH
        this.height = DEVICE_HEIGHT
        this.container.style.width = DEVICE_WIDTH + 'px'
        this.container.style.height = DEVICE_HEIGHT + 'px'
    }

}