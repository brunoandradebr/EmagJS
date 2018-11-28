/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Button
 * 
 * @extends EmagJS.Core.Render.Sprite
 */
class Button extends Sprite {

    /**
     * 
     * @param {EmagJS.Core.Display.Scene} scene 
     */
    constructor(scene) {

        super()

        // ops!
        if (!scene)
            throw new Error('scene not defined for button constructor')

        /**
         * @type {EmagJS.Core.Display.Scene}
         */
        this.scene = scene

        /**
         * Invisible touch top offset
         * 
         * @type {number}
         */
        this.offsetTop = 0

        /**
         * Invisible touch left offset
         * 
         * @type {number}
         */
        this.offsetLeft = 0

        /**
         * Invisible touch right offset
         * 
         * @type {number}
         */
        this.offsetRight = 0

        /**
         * Invisible touch bottom offset
         * 
         * @type {number}
         */
        this.offsetBottom = 0

        /**
         * last press time
         * 
         * @type {DOMHighResTimeStamp}
         */
        this.lastPressTime = 0

        /**
         * keep pressing button flag
         * 
         * @type {bool}
         */
        this.holding = false

        /**
         * just pressed button flag
         * 
         * @type {bool}
         */
        this.pressed = false

        /**
         * button was triggered flag
         * 
         * @type {bool}
         */
        this.triggered = false

        /**
         * double press
         * 
         * @type {bool}
         */
        this.doublePressed = false
    }

    /**
     * get touchdown - if touching the button area
     * 
     * @return {bool}
     */
    get touchdown() {

        // if not visible, return
        if (this.alpha <= 0)
            return false

        // pointer is touching button flag
        let _pointerDown = false

        // scene's scale factor - needed to translate touch coordinate
        let sceneScale = this.scene.scale

        // get button information
        let buttonX = this.position.x * sceneScale
        let buttonY = this.position.y * sceneScale
        let buttonWidth = this.width * sceneScale
        let buttonHeight = this.height * sceneScale

        // for each touch pointer
        for (let i in touches) {

            let touch = touches[i]

            // touch is an object, so 'length' property is listed as well
            if (typeof (touch) == 'number')
                continue

            // offset touch position
            let x = touch.clientX - this.scene.offsetX
            let y = touch.clientY - this.scene.offsetY

            // touching button area
            if (x > ((buttonX - buttonWidth * 0.5) - this.offsetLeft) && x < ((buttonX + buttonWidth * 0.5) + this.offsetRight)) {
                if (y > ((buttonY - buttonHeight * 0.5) - this.offsetTop) && y < ((buttonY + buttonHeight * 0.5) + this.offsetBottom)) {
                    _pointerDown = true
                }
            }

        }

        return _pointerDown

    }

    /**
     * Draw button
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        super.draw(graphics)

        // holding button
        this.holding = this.touchdown

        // triggered double press flag
        this.doublePressed = false

        // pressed button
        this.pressed = false
        if (this.holding && !this.triggered) {
            this.pressed = true
            this.triggered = true

            // fast press triggers double press
            if (window.performance.now() - this.lastPressTime < 200)
                this.doublePressed = true

            // update last press time
            this.lastPressTime = window.performance.now()
        }

        if (!this.holding)
            this.triggered = false

        // feedback
        if (this.touchdown) {
            this.fillColor = 'rgba(0,0,0,0.1)'
        } else {
            this.fillColor = 'transparent'
        }

    }

}