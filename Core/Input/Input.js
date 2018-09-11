/**
 * Input interface that encapsules keyboard, touch
 * - fix touch pressed and doublePressed - fire twice...
 *   when created in an scene and rendered on another
 */
class Input {

    constructor(keyboard, touch, gamepad) {

        this.touch = touch
        this.keyboard = keyboard
        this.gamepad = gamepad

    }

    /**
     * Holding button interface
     * 
     * touch, keyboard and gamepad
     * 
     * @param {string} key 
     * @param {string} touchKey 
     * @param {string} gamepadButton 
     * 
     * @return {bool}
     */
    holding(key, touchKey, gamepadButton) {

        if (!this.keyboard && !this.touch && !this.gamepad)
            return false

        if (this.gamepad) {
            key = gamepadButton ? gamepadButton : key
            return this.gamepad.holding(key)
        } else if (MOBILE && this.touch) {
            key = touchKey ? touchKey : key
            return this.touch.buttons[key].holding
        } else {
            if (this.keyboard)
                return this.keyboard.holding(this.keyboard[key])
        }

    }

    /**
     * Pressed button interface
     * 
     * touch, keyboard and gamepad
     * 
     * @param {string} key 
     * @param {string} touchKey 
     * @param {string} gamepadButton 
     * 
     * @return {bool}
     */
    pressed(key, touchKey, gamepadButton) {

        if (!this.keyboard && !this.touch && !this.gamepad)
            return false

        if (this.gamepad) {
            key = gamepadButton ? gamepadButton : key
            return this.gamepad.pressed(key)
        } else if (MOBILE && this.touch) {
            key = touchKey ? touchKey : key
            return this.touch.buttons[key].pressed
        } else {
            if (this.keyboard)
                return this.keyboard.pressed(this.keyboard[key])
        }

    }

    /**
     * Double pressed button interface
     * 
     * touch, keyboard and gamepad
     * 
     * @param {string} key 
     * @param {string} touchKey 
     * @param {string} gamepadButton 
     * 
     * @return {bool}
     */
    doublePressed(key, touchKey, gamepadButton) {

        if (!this.keyboard && !this.touch && !this.gamepad)
            return false

        if (this.gamepad) {
            key = gamepadButton ? gamepadButton : key
            return this.gamepad.doublePressed(key)
        } else if (MOBILE && this.touch) {
            key = touchKey ? touchKey : key
            return this.touch.buttons[key].doublePressed
        } else {
            if (this.keyboard)
                return this.keyboard.doublePressed(this.keyboard[key])
        }

    }

}