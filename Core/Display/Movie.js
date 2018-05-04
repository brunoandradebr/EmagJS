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
            fullscreen: true,                // full screen mode - default true
            scale: 1,                        // how much original resolution(resolution) will be scaled to fit movie's width and height
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
         * Paused state
         * 
         * @type {bool}
         */
        this.paused = false;


        /**
         * Movie's scale factor
         * 
         * @type {number}
         */
        this.scale = keepAspectRatio(this.resolutionWidth, this.resolutionHeight)

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

        /**
         * Internal loop function
         * 
         * @type {function}
         */
        let loop;


        // on enter a scene
        for (let i in this.scenes) {

            let scene = this.scenes[i];

            if (scene.onEnter)
                scene.onEnter(scene);

        }

        // on window resize
        window.addEventListener('resize', (e) => {

            // for each scene
            for (let i in this.scenes) {

                let scene = this.scenes[i]

                setTimeout(() => {

                    // if movie is on full screen mode
                    if (this.fullscreen) {
                        this.setFullscreen()
                    }

                    // scale and position scene's viewport canvas
                    scene.scaleViewport(scene.fullscreen)

                    // update movie's scale factor
                    this.scale = keepAspectRatio(this.resolutionWidth, this.resolutionHeight)

                    // scene has resize callback
                    if (scene.onResize) {
                        // scene's resize callback
                        scene.onResize(scene)
                    }

                }, 50)
            }

        });








        // fixed delta time with variant fps
        let dt = 1 / 60
        let accumulatedTime = 0
        let lastTime = window.performance.now();

        // main loop - engine heart
        (loop = (time) => {

            for (let i in this.scenes) {

                let scene = this.scenes[i];

                accumulatedTime += (time - lastTime) / 1000

                // if scene is paused
                if (this.paused) {
                    accumulatedTime = 0
                    lastTime = window.performance.now()
                    continue
                }

                // prevent spiral of death!
                if (accumulatedTime >= 1)
                    accumulatedTime = 1

                // if scene has loop callback
                if (scene.onLoop) {

                    // run the animation at the same time on all hardware speed
                    while (accumulatedTime > dt) {

                        // if scene has a camera, draw to viewport
                        // only what camera is watching
                        if (scene.camera) {

                            scene.viewport.graphics.clearRect(0, 0, scene.viewport.width, scene.viewport.height);
                            scene.viewport.graphics.drawImage(scene.canvas, scene.camera.x, scene.camera.y, scene.camera.width, scene.camera.height, 0, 0, scene.camera.width, scene.camera.height)

                        } else {

                            // if scene has no camera, draw everything inside original scene canvas
                            scene.graphics.drawImage(scene.canvas, 0, 0)

                        }

                        // clear scene's canvas
                        scene.graphics.clearRect(0, 0, scene.canvas.width, scene.canvas.height);

                        // save scene state
                        scene.graphics.save()
                        // scale scene
                        scene.graphics.scale(scene.zoom, scene.zoom)

                        // scene loop callback
                        scene.onLoop(scene, dt * 50);

                        // restore scene state
                        scene.graphics.restore()

                        // show camera
                        if (scene.debug) {
                            if (scene.camera) {
                                scene.cameraDebug.position.x = scene.camera.x + scene.camera.width * 0.5 - scene.cameraDebug.lineWidth * 0.5
                                scene.cameraDebug.position.y = scene.camera.y + scene.camera.height * 0.5 + scene.cameraDebug.lineWidth * 0.5
                                scene.cameraDebug.width = scene.camera.width
                                scene.cameraDebug.height = scene.camera.height
                                scene.cameraDebug.draw(scene.graphics)
                            }
                        }

                        accumulatedTime -= dt
                    }
                }

            }

            lastTime = time

            //setTimeout(loop, 1000 / 12, window.performance.now())
            window.requestAnimationFrame(loop);

        });

        window.requestAnimationFrame(loop);

    }

    /**
     * Pauses all scenes
     * 
     * @return {void}
     */
    pause() {
        this.paused = true;
    }

    /**
     * Resumes all scenes
     * 
     * @return {void}
     */
    resume() {
        this.paused = false;
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