/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */




/**
 * Mouse vector
 * 
 * @type {EmagJS.Core.Math.Vector}
 * @global
 */
let mouse = new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y)
mouse.movimentX = 0
mouse.movimentY = 0

/**
 * Mouse down flag
 * 
 * @type {boolean}
 * @global
 */
let mousedown = false

/**
 * keep track of all touch points
 * 
 * @type {object}
 * @global
 */
let touches = {}

touches.length = 0

/**
 * keep track of all connected gamepads
 * 
 * @type {object}
 * @global
 */
let gamepad = new Gamepad()


/**
 * Stage - The main object that holds all objects.
 *         Has one or more movie handlers that has one or more scenes.
 * 
 *         structure : <target>
 *                          <div id="stage">
 *                              <div id="id-movie">
 *                                  <canvas id="id-scene"></canvas>
 *                              </div>
 *                          </div>
 *                     </target>
 *                  
 * 
 * @param {HTMLElement} target - target element where to place stage (main canvas)
 */
class Stage {

    /**
     * Constructor
     */
    constructor(target = null) {

        /**
         * @type {array}
         */
        this.movies = [];

        this.target = target

        this.lockPointer = false

        /**
         * @type {HTMLElement}
         */
        this.container = document.createElement('div');
        // set it's id
        this.container.setAttribute('id', 'stage');

        // insert stage container element to the target
        if (this.target) {
            document.querySelector(this.target).appendChild(this.container);
        } else {
            document.body.appendChild(this.container);
        }

        /**
         * Mouse down event
         */
        this.container.addEventListener('mousedown', (e) => {

            e.preventDefault();

            mouse.x = e.clientX;
            mouse.y = e.clientY;

            mousedown = true

            if (!document.pointerLockElement && this.lockPointer)
                this.container.requestPointerLock()

        });

        /**
         * Mouse up event
         */
        this.container.addEventListener('mouseup', (e) => {

            e.preventDefault();

            mousedown = false

        });

        /**
         * Mouse click event - updates mouse vector
         */
        this.container.addEventListener('click', (e) => {

            e.preventDefault();

            mouse.x = e.clientX;
            mouse.y = e.clientY;

        });

        /**
         * Mouse move event - updates mouse vector
         */
        this.container.addEventListener('mousemove', (e) => {

            e.preventDefault();

            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.movimentX = e.movementX
            mouse.movimentY = e.movementY

        });

        /**
         * Touch start event - updates mouse vector and pointers
         */
        this.container.addEventListener('touchstart', (e) => {

            e.preventDefault();

            // update mouse
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;

            // update pointers
            for (let i = 0; i < e.changedTouches.length; i++) {

                let touch = e.changedTouches[i]

                // add touch start time information
                touch.startTimeStamp = window.performance.now()

                touches[touch.identifier] = touch
                touches.length++

            }

        }, { passive: false });

        /**
         * Touch move event - updates mouse vector and pointers
         */
        this.container.addEventListener('touchmove', (e) => {

            e.preventDefault();

            // update mouse
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;

            // update pointers
            for (let i = 0; i < e.changedTouches.length; i++) {

                let touch = e.changedTouches[i]

                // keep touch start time information
                touch.startTimeStamp = touches[touch.identifier].startTimeStamp

                touches[touch.identifier] = touch

            }

        }, { passive: false });

        /**
         * Touch end event - updates pointers
         */
        this.container.addEventListener('touchend', (e) => {

            for (let i = 0; i < e.changedTouches.length; i++) {

                let touch = e.changedTouches[i]

                delete touches[touch.identifier]
                touches.length--

            }

        })

        /**
         * Touch cancel event - deletes all pointers
         * keeping touching but opened notification area or leave
         * browser
         */
        this.container.addEventListener('touchcancel', (e) => {
            touches.length = 0
        })

    }

    /**
     * Adds a new movie to the stage
     * 
     * @param {EmagJS.Core.Display.Movie} movie
     * 
     * @return {void}
     */
    addMovie(movie) {

        this.movies[movie.id] = movie;
        this.movies.length++;

        this.container.appendChild(movie.container);

    }

    /**
     * Remove a movie from stage
     * 
     * @param {string} movieID
     * 
     * @return {void}
     */
    removeMovie(movieID) {

        this.movies[movieID].destroy()

        delete this.movies[movieID]
        this.movies.length--
    }

    /**
     * Plays movie's scenes
     * 
     * @param {string} movieID
     * 
     * @return {void}
     */
    play(movieID) {

        let movie = this.movies[movieID];

        if (movie.paused) {
            movie.resume();
        } else {
            movie.play();
        }

    }

    /**
     * Stops a movie
     * 
     * @param {string} movieID
     * 
     * @return {void} 
     */
    pause(movieID) {
        this.movies[movieID].pause();
    }


    /**
     * Resumes a movie
     * 
     * @param {string} movieID
     * 
     * @return {void} 
     */
    resume(movieID) {
        this.movies[movieID].resume();
    }


    /**
     * Changes movie index depth
     * 
     * @param {string} frontMovie 
     * @param {string} backMovie
     * 
     * @return {void}
     */
    swapDepth(frontMovie, backMovie) {

        let frontMovieIndex = this.movies[frontMovie].container.style.zIndex;
        let backMovieIndex = this.movies[backMovie].container.style.zIndex;

        this.movies[frontMovie].container.style.zIndex = backMovieIndex;
        this.movies[backMovie].container.style.zIndex = frontMovieIndex;

    }


    /**
     * Brings a movie to front and play or resume it's scenes
     * 
     * @param {string} movieID
     * 
     * @return {void}
     */
    bringToFront(movieID) {

        // pauses all others movies
        for (let i in this.movies) {

            let movie = this.movies[i]

            movie.container.style.zIndex = 0
            movie.pause()

        }

        this.movies[movieID].started ? this.movies[movieID].resume() : this.movies[movieID].play()
        this.movies[movieID].container.style.zIndex = 1

    }

    /**
     * Shakes screen
     * 
     * @param {number} interval 
     * @param {number} force 
     * @param {number} frequence
     * 
     * @return {void} 
     */
    shake(interval = 300, force = 5, frequence = 5) {

        let shake = setInterval(() => {
            this.container.style.top = random(force) + 'px'
            this.container.style.left = random(force) + 'px'
        }, frequence)

        setTimeout(() => {
            clearInterval(shake)
            this.container.style.left = "initial"
            this.container.style.top = "initial"
        }, interval)

    }

}