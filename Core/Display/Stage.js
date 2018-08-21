/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */




/**
 * Mouse vector
 * 
 * @type {EmagJS.Core.Math.Vector}
 * @global
 */
let mouse = new Vector(0, 0)

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
 * Stage - The main object that holds all objects.
 *         Has one or more movie handlers that has one or more scenes.
 * 
 *         structure : <div id="stage">
 *                          <div id="id-movie">
 *                              <canvas id="id-scene"></canvas>
 *                          </div>
 *                     </div>
 */
class Stage {

    /**
     * Constructor
     */
    constructor() {

        /**
         * @type {array}
         */
        this.movies = [];

        /**
         * @type {HTMLElement}
         */
        this.container = document.createElement('div');
        // set it's id
        this.container.setAttribute('id', 'stage');
        // insert stage container element to the document body
        document.body.appendChild(this.container);

        /**
         * Mouse down event
         */
        this.container.addEventListener('mousedown', (e) => {

            e.preventDefault();

            mousedown = true

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

                touches[touch.identifier] = touch
                touches.length++

            }

        });

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

                touches[touch.identifier] = touch

            }

        });

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

}