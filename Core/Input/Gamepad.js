/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Gamepad - joystick manager
 * 
 */
class Gamepad {

    /**
     * 
     * @external GamepadInterface
     */
    constructor() {

        /**
         * gamepad list
         * 
         * @type {array}
         */
        this.pads = []

        /**
         * Callback when a gamepad is connected
         * 
         * @type {function}
         */
        this.onConnected

        // create gamepadInterface
        this.getConnectedGamepads()

        // when connecting a new gamepad
        window.addEventListener('gamepadconnected', (e) => {
            this.getConnectedGamepads()
        });
        // when disconnecting a gamepad
        window.addEventListener('gamepaddisconnected', (e) => {
            this.getConnectedGamepads()
        })

        // polling for new gamepad connections
        setInterval(this.poll, 0)
    }

    /**
     * Updates gamepad list
     * 
     * @return {void}
     */
    poll() {
        this.pads = navigator.getGamepads() || navigator.webkitGetGamepads()
    }

    /**
     * Update pads connected
     * 
     * @external GamepadInterface
     * 
     * @return {void}
     */
    getConnectedGamepads() {

        // search for new connected gamepad
        this.poll()

        /**
         * First player
         * 
         * @type {EmagJS.Core.Common.Input.GamepadInterface}
         */
        this.pad1 = new GamepadInterface(this.pads[0])

        /**
         * Second player
         * 
         * @type {EmagJS.Core.Common.Input.GamepadInterface}
         */
        this.pad2 = new GamepadInterface(this.pads[1])

        /**
         * Third player
         * 
         * @type {EmagJS.Core.Common.Input.GamepadInterface}
         */
        this.pad3 = new GamepadInterface(this.pads[2])

        /**
         * Fourth player
         * 
         * @type {EmagJS.Core.Common.Input.GamepadInterface}
         */
        this.pad4 = new GamepadInterface(this.pads[3])

        // callback when a new pad is connected/disconneceted
        if (this.onConnected)
            this.onConnected()

    }

    /**
     * Get last connected gamepad
     * 
     * @return {EmagJS.Core.Input.GamepadInterface} 
     */
    getLastConnectedPad() {

        let gamepad

        if (this.pad1.gamepad) {
            gamepad = this.pad1
        } else if (this.pad2.gamepad) {
            gamepad = this.pad2
        } else if (this.pad3.gamepad) {
            gamepad = this.pad3
        } else if (this.pad4.gamepad) {
            gamepad = this.pad4
        }

        return gamepad

    }

}




/**
 * Gamepad Interface - a class to map gamepad buttons
 * 
 */
class GamepadInterface {

    /**
     * 
     * @param {Gamepad} gamepad
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad}
     */
    constructor(gamepad) {

        /**
         * @type {Gamepad}
         */
        this.gamepad = gamepad

        /**
         * keep pressed buttons history
         * 
         * @type {object}
         */
        this.cachedButtons = {}

        /**
         * gamepad left axes
         * 
         * @type {object}
         */
        this.leftAxis = {
            x: 0,
            y: 0
        }

        /**
         * gamepad right axes
         * 
         * @type {object}
         */
        this.rightAxis = {
            x: 0,
            y: 0
        }

        /**
         * gamepad pad axis - some gamepads has directional as axis information
         * 
         * @type {object}
         */
        this.padAxis = {
            x: 0,
            y: 0
        }

        // gamepad not connected
        if (this.gamepad == null)
            return false

        // decides gamepad interface to map buttons
        switch (this.gamepad.id) {
            case 'Xbox 360 Controller (XInput STANDARD GAMEPAD)': this.interface = 'xbox'; break;
            case 'HuiJia  USB GamePad (Vendor: 0e8f Product: 3013)': this.interface = 'HuiJia'; break;
            case 'usb gamepad            (Vendor: 0810 Product: e501)': this.interface = 'usbGamepad'; break;
            case 'AccModel Extended Gamepad': this.interface = 'gamevice'; break;
            default:
                this.interface = 'xbox'
        }

        /**
         * xbox buttons
         * 
         * @type {object}
         */
        this.xbox = {
            'UP': 12,
            'RIGHT': 15,
            'DOWN': 13,
            'LEFT': 14,
            'SELECT': 8,
            'START': 9,
            'L1': 4,
            'L2': 6,
            'R1': 5,
            'R2': 7,
            'TRIANGLE': 3,
            'SQUARE': 2,
            'CIRCLE': 1,
            'CROSS': 0,
        }

        /**
         * HuiJia buttons
         * 
         * @type {object}
         */
        this.HuiJia = {
            'SELECT': 8,
            'START': 9,
            'L1': 6,
            'R1': 7,
            'TRIANGLE': 0,
            'SQUARE': 3,
            'CIRCLE': 1,
            'CROSS': 2,
        }

        /**
         * usbGamepad buttons
         * 
         * @type {object}
         */
        this.usbGamepad = {
            'SELECT': 8,
            'START': 9,
            'L1': 4,
            'R1': 5,
            'TRIANGLE': 0,
            'SQUARE': 3,
            'CIRCLE': 1,
            'CROSS': 2,
        }

        /**
         * gamevice buttons - ridiculous gamepad ;(
         * 
         * @type {object}
         */
        this.gamevice = {
            'L1': 4,
            'L2': 6,
            'R1': 5,
            'R2': 7,
            'TRIANGLE': 3,
            'SQUARE': 2,
            'CIRCLE': 1,
            'CROSS': 0,
        }

    }

    /**
     * Checks if a button is been holding
     * 
     * @param {string} button
     * 
     * @return {bool} 
     */
    holding(button) {

        // gamepad not connected
        if (this.gamepad == null)
            return false

        button = this.gamepad.buttons[this[this.interface][button]]

        return button ? button.pressed : false

    }

    /**
     * Checks if a button was just pressed
     * 
     * @param {string} button
     * 
     * @return {bool} 
     */
    pressed(button) {

        // gamepad not connected
        if (this.gamepad == null)
            return false

        // button pressed
        let pressedButton = this.gamepad.buttons[this[this.interface][button]]

        // trigger new press flag
        let newPress = false

        // holding button and not yet cached
        if (pressedButton.pressed && this.cachedButtons[button] == false) {
            // cache pressed button
            this.cachedButtons[button] = true
            // flag that a new press happened
            newPress = true
        }

        // if not holding button
        if (!pressedButton.pressed)
            // update cached button value
            this.cachedButtons[button] = false

        // return new press
        return newPress

    }

    /**
     * Checks if a button was just pressed twice
     * 
     * @param {string} button
     * 
     * @return {bool} 
     */
    doublePressed(button) {

        // gamepad not connected
        if (this.gamepad == null)
            return false

        // button pressed
        let pressedButton = this.gamepad.buttons[this[this.interface][button]]

        // double pressed flag
        let doublePressed = false

        // holding button and not yet cached
        if (pressedButton.pressed && this.cachedButtons[button] == false) {

            // cache pressed button
            this.cachedButtons[button] = true

            // if pressed twice
            if (window.performance.now() - pressedButton.lastPressedTime < 150) {
                // flag that a double pressed happened
                doublePressed = true
            }

            // update last pressed time
            pressedButton.lastPressedTime = window.performance.now()
        }

        // if not holding button
        if (!pressedButton.pressed)
            // update cached button value
            this.cachedButtons[button] = false

        return doublePressed
    }

    /**
     * Get gamepad axis by axis id
     * 
     * 0 - left
     * 1 - right
     * 2 - directional
     * 
     * @param {integer} axisIndex
     * 
     * @return {object}
     */
    getAxis(axisIndex) {

        // gamepad not connected
        if (this.gamepad == null)
            return false

        // left axis
        if (axisIndex == 0) {

            this.leftAxis.x = this.gamepad.axes[0]
            this.leftAxis.y = this.gamepad.axes[1]

            return this.leftAxis
        }

        // right axis
        if (axisIndex == 1) {

            this.rightAxis.x = this.gamepad.axes[2]
            this.rightAxis.y = this.gamepad.axes[3]

            return this.rightAxis

        }

        // directional axis
        if (axisIndex == 2) {

            this.padAxis.x = this.gamepad.axes[4]
            this.padAxis.y = this.gamepad.axes[5]

            return this.padAxis

        }

    }

}