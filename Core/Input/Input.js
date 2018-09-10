/**
 * Input interface that encapsules keyboard, touch
 * TODO - add gamepad interface
 *      - fix touch pressed and doublePressed - fire twice... when created in an scene and rendered on another
 */
class Input {

    constructor(keyboard, touch, gamepad) {

        this.touch = touch
        this.keyboard = keyboard
        this.gamepad = gamepad

    }

    holding(key, touchKey, gamepadButton) {

        if (!this.keyboard && !this.touch && !this.gamepad)
            return false

        if (MOBILE && this.touch) {
            if (this.touch) {
                key = touchKey ? touchKey : key
                return this.touch.buttons[key].holding
            }
        } else if (this.gamepad) {
            key = gamepadButton ? gamepadButton : key
            return this.gamepad.holding(key)
        } else {
            if (this.keyboard)
                return this.keyboard.holding(this.keyboard[key])
        }

    }

    pressed(key, touchKey, gamepadButton) {

        if (!this.keyboard && !this.touch && !this.gamepad)
            return false

        if (MOBILE && this.touch) {
            if (this.touch) {
                key = touchKey ? touchKey : key
                return this.touch.buttons[key].pressed
            }
        } else if (this.gamepad) {
            key = gamepadButton ? gamepadButton : key
            return this.gamepad.pressed(key)
        } else {
            if (this.keyboard)
                return this.keyboard.pressed(this.keyboard[key])
        }

    }

    doublePressed(key, touchKey, gamepadButton) {

        if (!this.keyboard && !this.touch && !this.gamepad)
            return false

        if (MOBILE && this.touch) {
            if (this.touch) {
                key = touchKey ? touchKey : key
                return this.touch.buttons[key].doublePressed
            }
        } else if (this.gamepad) {
            key = gamepadButton ? gamepadButton : key
            return this.gamepad.doublePressed(key)
        } else {
            if (this.keyboard)
                return this.keyboard.doublePressed(this.keyboard[key])
        }

    }

}