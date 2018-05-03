/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Timer
 */
class Timer {

    /**
     * 
     * @param {number} interval - Interval to increment timer count 
     */
    constructor(interval = 1000) {

        /**
         * @type {DOMHighResTimeStamp}
         */
        this.lastTime = window.performance.now();

        /**
         * @type {number}
         */
        this.interval = interval;

        /**
         * @type {integer}
         */
        this.count = 0;

        /**
         * @type {bool}
         */
        this.paused = false;

    }

    /**
     * get start - start counting
     * 
     * @return {void}
     */
    get start() {

        if (!this.paused) {

            let elapsed = window.performance.now() - this.lastTime;

            if (elapsed > this.interval) {

                this.count++;

                this.lastTime = window.performance.now();
            }

        }

    }

    /**
     * get tick - tick state
     * 
     * @return {bool}
     */
    get tick() {

        let tick = false;

        if (this.count > 0) {
            tick = true;
            this.reset;
        }
        return tick;
    }

    /**
     * get pause - pause it's timer
     * 
     * @return {EmagJs.Core.Common.Timer}
     */
    get pause() {

        this.paused = true;

        return this;
    }

    /**
     * get resume - resume it's timer
     * 
     * @return {EmagJs.Core.Common.Timer}
     */
    get resume() {

        this.paused = false;

        return this;
    }

    /**
     * get reset - reset it's timer
     * 
     * @return {EmagJs.Core.Common.Timer}
     */
    get reset() {

        this.count = 0;

        this.lastTime = window.performance.now();

        return this;
    }

}