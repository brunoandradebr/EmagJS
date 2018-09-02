/**
 * Input interface that encapsules keyboard, touch
 * TODO - add gamepad interface
 *      - fix touch pressed and doublePressed - fire twice...
 */
class Input {

    constructor(keyboard, touch) {

        this.touch = touch
        this.keyboard = keyboard

    }

    holding(key, touchKey) {

        if (!this.keyboard && !this.touch)
            return false

        if (MOBILE) {
            if (this.touch) {
                key = touchKey ? touchKey : key
                return this.touch.buttons[key].holding
            }
        } else {
            return this.keyboard.holding(this.keyboard[key])
        }

    }

    pressed(key, touchKey) {

        if (!this.keyboard && !this.touch)
            return false

        if (MOBILE) {
            if (this.touch) {
                key = touchKey ? touchKey : key
                return this.touch.buttons[key].pressed
            }
        } else {
            return this.keyboard.pressed(this.keyboard[key])
        }

    }

    doublePressed(key, touchKey) {

        if (!this.keyboard && !this.touch)
            return false

        if (MOBILE) {
            if (this.touch) {
                key = touchKey ? touchKey : key
                return this.touch.buttons[key].doublePressed
            }
        } else {
            return this.keyboard.doublePressed(this.keyboard[key])
        }

    }

}