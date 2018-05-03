/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Keyboard manager
 */
class Keyboard {

    constructor() {

        /**
         * @type {integer}
         */
        this.UP = 38

        /**
         * @type {integer}
         */
        this.DOWN = 40

        /**
         * @type {integer}
         */
        this.LEFT = 37

        /**
         * @type {integer}
         */
        this.RIGHT = 39

        /**
         * @type {integer}
         */
        this.SPACE = 32

        /**
         * @type {integer}
         */
        this.A = 65

        /**
         * @type {integer}
         */
        this.S = 83

        /**
         * @type {integer}
         */
        this.Z = 90

        /**
         * @type {integer}
         */
        this.X = 88

        /**
         * @type {integer}
         */
        this.D = 68

        /**
         * keys pool
         * 
         * @type {object}
         */
        this.keys = {}

        // add some keys
        this.addKey(this.UP)
        this.addKey(this.DOWN)
        this.addKey(this.LEFT)
        this.addKey(this.RIGHT)
        this.addKey(this.SPACE)
        this.addKey(this.A)
        this.addKey(this.S)
        this.addKey(this.Z)
        this.addKey(this.X)
        this.addKey(this.D)

        // keydown listener
        window.addEventListener('keydown', (e) => {

            let code = e.keyCode

            // just pressed a key
            if (this.keys[code] && this.keys[code].isReleased) {
                this.keys[code].isDown = true
                this.keys[code].wasPressed = true
                this.keys[code].isReleased = false
                this.keys[code].doublePressed = (window.performance.now() - this.keys[code].lastPressTime < 150)
                this.keys[code].lastPressTime = window.performance.now()
            } else {
                // holding a key
                if (this.keys[code]) {
                    this.keys[code].isDown = true
                    this.keys[code].wasPressed = false
                    this.keys[code].isReleased = false
                    this.keys[code].doublePressed = false
                }
            }
        })

        // keyup listener
        window.addEventListener('keyup', (e) => {

            let code = e.keyCode

            if (this.keys[code]) {
                this.keys[code].isReleased = true
                this.keys[code].isDown = false
                this.keys[code].wasPressed = false
            }

        })

    }

    /**
     * Add a new key to keyboard keys pool
     * 
     * @param {integer} keyCode
     * 
     * @return {void}
     */
    addKey(keyCode) {
        this.keys[keyCode] = {
            isReleased: true,
            isDown: false,
            wasPressed: false
        }
    }

    /**
     * Checks if a key was just pressed
     * 
     * @param {integer} key
     * 
     * @return {bool}
     */
    pressed(key) {

        if (!this.keys[key])
            return false

        let current = false;

        if (this.keys[key].isDown) {
            current = this.keys[key].wasPressed;
            this.keys[key].wasPressed = false;
        }

        return current;

    }

    /**
     * Checks if a key is been holding
     * 
     * @param {integer} key
     * 
     * @return {bool}
     */
    holding(key) {

        if (this.keys[key])
            return this.keys[key].isDown

    }

    /**
     * Checks if a key was pressed twice
     * 
     * @param {integer} key
     * 
     * @return {bool}
     */
    doublePressed(key) {

        if (!this.keys[key])
            return false

        let current = false;

        // trigger only once
        if (this.keys[key].doublePressed) {
            current = this.keys[key].doublePressed;
            this.keys[key].doublePressed = false;
        }

        return current;

    }

}