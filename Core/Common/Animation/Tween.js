/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Tween animation
 */
class Tween {

    /**
     * @param {object}  target - An object with properties to be interpolated ex : {width : 0, height: 20, speedX : 0}
     * @param {integer} repeat - Number of repetitions 1 to Infinity
     */
    constructor(target, repeat = 1) {

        /**
         * object to be animated
         * 
         * @type {object}
         */
        this.target = target

        /**
         * Animation pool
         * 
         * @type {array}
         */
        this.animations = []

        /**
         * Animation loop counter
         * 
         * @type {integer}
         */
        this.frameCount = 0

        /**
         * Animation repeates number
         * 
         * @type {integer}
         */
        this.repeat = repeat

        /**
         * Animation started state
         * 
         * @type {bool}
         */
        this.started = false

        /**
         * Animation paused state
         * 
         * @type {bool}
         */
        this.paused = false

        /**
         * Animation completed state
         * 
         * @type {bool}
         */
        this.completed = false

    }

    /**
     * Add a new animation to animation's pool
     * 
     * @param {object} props    Properties to be animated
     * @param {number} duration Animation duration 
     * @param {number} delay    Delay to start animation
     * @param {string} ease     Interpolation ease function
     * 
     * @return {void}
     */
    animate(props, duration = 1000, delay = 0, ease = 'linear') {

        let target = this.target

        for (let i in props) {

            let prop = i
            let start = target[i]
            let end = props[i]

            // if there are more than one animation with the same property
            // update it's start to it's last end
            for (let j = 0; j < this.animations.length; j++) {

                let _animation = this.animations[j]

                if (_animation.prop == prop) {
                    start = _animation.end
                }

            }

            // set animation
            let animation = {
                prop: prop,
                start: start,
                end: start + end,
                duration: duration,
                delay: delay,
                ease: ease,
                initialTime: window.performance.now(),
                completed: false,
                started: false,
                dt: 0,
                t: 0,
                value: target[i],
            }

            this.animations.push(animation)

        }

    }

    /**
     * Animates everything!
     * 
     * @return {void}
     */
    play() {

        if (this.paused)
            return false

        let currentFrame = 0

        this.started = true

        // for each animation
        this.animations.map((animation, i) => {

            if (!animation.started)
                animation.initialTime = window.performance.now()

            animation.started = true

            // timeout
            if (animation.initialTime + animation.delay < window.performance.now()) {

                // delta t
                animation.dt = (window.performance.now() - animation.delay) - animation.initialTime
                // animation step t
                animation.t = animation.dt / animation.duration

                // animation
                if (animation.initialTime + animation.duration > window.performance.now() - animation.delay) {

                    // animation.value = animation.start + ((animation.end - animation.start) * animation.t)
                    animation.value = this[animation.ease](animation.start, animation.end, animation.duration, animation.dt)

                    this.completed = false

                } else {
                    // ended animation
                    animation.value = animation.end

                    currentFrame++

                    // last animation
                    if (currentFrame === this.animations.length) {

                        this.frameCount++

                        // stop repeating animation
                        if (this.frameCount >= this.repeat) {
                            this.paused = true
                            this.completed = true
                        } else {
                            // repeat until max repeat
                            this.resetAnimations()
                        }

                    }

                }

                // animate target
                this.target[animation.prop] = animation.value

            }

        })

    }

    /**
     * Update start and end animation property
     * 
     * @param {integer} index 
     * @param {number} start 
     * @param {number} end
     * 
     * @return {void}
     */
    updateAnimation(index, start, end) {
        this.animations[index].start = start
        this.animations[index].end = end
    }

    /**
     * Resets animation
     * 
     * @return {void}
     */
    resetAnimations() {

        this.paused = false
        this.started = false
        this.frameCount = 0

        for (let i = this.animations.length - 1; i >= 0; i--) {

            let animation = this.animations[i]

            this.target[animation.prop] = animation.start

            animation.initialTime = window.performance.now()
        }
    }

    /**
     * Linear interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    linear(start, end, duration, dt) {

        let t = dt / duration

        let diff = end - start

        return start + (diff * t)
    }

    /**
     * quadraticIn interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    quadraticIn(start, end, duration, dt) {

        let t = dt / duration

        let diff = end - start

        return start + (diff * t * t)

    }

    /**
     * quadraticOut interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    quadraticOut(start, end, duration, dt) {

        let t = dt / duration

        let diff = end - start

        return start + (-diff * (t - 2) * t)

    }

    /**
     * quadraticInOut interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    quadraticInOut(start, end, duration, dt) {

        let t = dt / (duration * 0.5);

        let diff = end - start

        if (t < 1) {
            return start + (diff * 0.5 * t * t);
        }

        t--;
        return start + ((-diff * 0.5) * (t * (t - 2) - 1));

    }

    /**
     * cubicIn interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    cubicIn(start, end, duration, dt) {

        let t = dt / duration

        let diff = end - start

        return start + (diff * t * t * t)

    }

    /**
     * cubicOut interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    cubicOut(start, end, duration, dt) {

        let t = dt / duration

        let diff = end - start

        t--
        return start + (diff * (t * t * t + 1))

    }

    /**
     * cubicInOut interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    cubicInOut(start, end, duration, dt) {

        let t = dt / (duration * 0.5);

        let diff = end - start

        if (t < 1) {
            return start + (diff * 0.5 * t * t * t);
        }

        t -= 2;
        return start + ((diff * 0.5) * (t * t * t + 2));

    }

    /**
     * backIn interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    backIn(start, end, duration, dt) {

        let s = 1.70158;
        let t = dt / duration
        let diff = end - start

        return start + diff * t * t * ((s + 1) * t - s);

    }

    /**
     * backOut interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    backOut(start, end, duration, dt) {

        let s = 1.70158;
        let t = dt / duration - 1
        let diff = end - start

        return diff * (t * t * ((s + 1) * t + s) + 1) + start;

    }

    /**
     * backInOut interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    backInOut(start, end, duration, dt) {

        let s = 1.70158;
        let t = dt
        let diff = end - start

        if ((t /= duration / 2) < 1) {
            return diff / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + start;
        }
        return diff / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + start;

    }

    /**
     * elasticIn interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    elasticIn(start, end, duration, dt) {

        let p = duration * .3
        let a = undefined

        let diff = end - start

        let s = 0;

        let t = dt

        if (t === 0) {
            return start;
        }

        if ((t /= duration) === 1) {
            return b + diff;
        }

        if (!p) {
            p = duration * 0.3;
        }

        if (!a || a < Math.abs(diff)) {
            a = diff;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(diff / a);
        }

        return (
            -(a *
                Math.pow(2, 10 * (t -= 1)) *
                Math.sin((t * duration - s) * (2 * Math.PI) / p)) + start
        )
    }

    /**
     * elasticOut interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    elasticOut(start, end, duration, dt) {

        let p = duration * .3
        let a = undefined

        let diff = end - start

        let s = 0;

        let t = dt

        if (t === 0) {
            return start;
        }

        if ((t /= duration) === 1) {
            return start + diff;
        }

        if (!p) {
            p = duration * 0.3;
        }

        if (!a || a < Math.abs(diff)) {
            a = diff;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(diff / a);
        }

        return (
            a * Math.pow(2, -10 * t) * Math.sin((t * duration - s) * (2 * Math.PI) / p) +
            diff +
            start
        )
    }

    /**
     * elasticInOut interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    elasticInOut(start, end, duration, dt) {

        let p = undefined
        let a = undefined

        let diff = end - start

        let s = 0;

        let t = dt

        if (t === 0) {
            return start;
        }

        if ((t /= duration / 2) === 2) {
            return start + diff;
        }

        if (!p) {
            p = duration * (0.3 * 1.5);
        }

        if (!a || a < Math.abs(diff)) {
            a = diff;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(diff / a);
        }

        if (t < 1) {
            return (
                -0.5 *
                (a *
                    Math.pow(2, 10 * (t -= 1)) *
                    Math.sin((t * duration - s) * (2 * Math.PI) / p)) +
                start
            );
        }

        return (
            a *
            Math.pow(2, -10 * (t -= 1)) *
            Math.sin((t * duration - s) * (2 * Math.PI) / p) *
            0.5 +
            diff +
            start
        );

    }

    /**
     * bounce interpolation
     * 
     * @param {number}  start    - start value
     * @param {number}  end      - end value
     * @param {integer} duration - duration
     * @param {number}  dt       - current animation time
     * 
     * @return {number}
     */
    bounce(start, end, duration, dt) {

        let t = dt / duration;

        let diff = end - start

        t = t < 1 / 2.75 ?
            7.5625 * t * t : t < 2 / 2.75 ?
                7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ?
                    7.5625 * (t -= 2.25 / 2.75) * t + .9375 :
                    7.5625 * (t -= 2.625 / 2.75) * t + .984375;

        return start + diff * t
    }

}