/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Touch - creates a touch pad interface
 */
class Touch {

    /**
     * 
     * @param {EmagJS.Core.Display.Scene} scene 
     */
    constructor(scene) {

        /**
         * Scene where butons will be positioned and rendered
         * 
         * @type {EmagJS.Core.Display.Scene}
         */
        this.scene = scene

        /**
         * Buttons pool
         * 
         * @type {array}
         */
        this.buttons = []

        // add some default buttons
        if (this.scene.camera) {
            this.addButton(scene, 'LEFT', 35, scene.camera.height - 28, 32, 32, { top: 80, bottom: 80, left: 80 })
            this.addButton(scene, 'RIGHT', 75, scene.camera.height - 28, 32, 32, { top: 80, bottom: 80, right: 80 })
            this.addButton(scene, 'A', scene.camera.width - 75, scene.camera.height - 28, 32, 32, { top: 80, bottom: 80, left: 80 })
            this.addButton(scene, 'B', scene.camera.width - 37, scene.camera.height - 28, 32, 32, { top: 80, bottom: 80, right: 80 })
            this.addButton(scene, 'C', scene.camera.width - 37, 80, 32, 32)
            this.addButton(scene, 'D', scene.camera.width - 37, 30, 32, 32)
        } else {
            this.addButton(scene, 'LEFT', 35, scene.height - 28, 32, 32, { top: 80, bottom: 80, left: 80 })
            this.addButton(scene, 'RIGHT', 75, scene.height - 28, 32, 32, { top: 80, bottom: 80, right: 80 })
            this.addButton(scene, 'A', scene.width - 75, scene.height - 28, 32, 32, { top: 80, bottom: 80, left: 80 })
            this.addButton(scene, 'B', scene.width - 37, scene.height - 28, 32, 32, { top: 80, bottom: 80, right: 80 })
            this.addButton(scene, 'C', scene.width - 37, scene.height - 28 * 2 - 10, 32, 32)
            this.addButton(scene, 'D', scene.width - 37, 30, 32, 32)
        }

        /**
         * @type {EmagJS.Core.Input.Stick}
         */
        this.leftStick = new Stick(scene)
        this.leftStick.active = false
        this.leftStick.area.center.update(scene.width * 0.25, scene.height * 0.5)
        this.leftStick.area.width = scene.width * 0.5
        this.leftStick.area.height = scene.height

        /**
         * @type {EmagJS.Core.Input.Stick}
         */
        this.rightStick = new Stick(scene)
        this.rightStick.active = false
        this.rightStick.area.center.update(scene.width * 0.75, scene.height * 0.5)
        this.rightStick.area.width = scene.width * 0.5
        this.rightStick.area.height = scene.height

    }

    /**
     * Add a new button to touch
     * 
     * @external EmagJS.Core.Input.Button
     * 
     * @param {EmagJS.Core.Display.Scene} scene 
     * @param {string} name 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height
     * @param {object} offset
     * 
     * @return {void} 
     */
    addButton(scene, name, x, y, width = 32, height = 32, offset = {}) {

        // create a new button
        let button = new Button(scene)

        // set button name
        button.name = name
        // set button width
        button.width = width
        // set button height
        button.height = height
        // set button color
        button.fillColor = 'transparent'
        // set button position x
        button.position.x = x
        // set button position y
        button.position.y = y
        // set button line width
        button.lineWidth = 1

        // merge button offset with offset param
        let defaultOffset = Object.assign({
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }, offset)
        // set offset
        button.offsetLeft = defaultOffset.left
        button.offsetTop = defaultOffset.top
        button.offsetRight = defaultOffset.right
        button.offsetBottom = defaultOffset.bottom
        // add button to touch buttons array
        this.buttons[name] = button
        // increment buttons array length
        this.buttons.length++
    }

    /**
     * Removes buttons from buttons pool
     * 
     * @param {string} buttonName
     * 
     * @return {void}
     */
    removeButton(...buttonName) {
        buttonName.map((button) => {
            delete this.buttons[button]
            this.buttons.length--
        })
    }

    /**
     * Updates all touch buttons
     * 
     * @return {void}
     */
    update() {

        // if left stick is active, update
        if (this.leftStick.active)
            this.leftStick.update()

        // if right stick is active, update
        if (this.rightStick.active)
            this.rightStick.update()

        for (let i in this.buttons) {

            let button = this.buttons[i]

            if (button.alpha)
                button.update()

        }
    }

    /**
     * Updates all touch buttons positions
     * 
     * if not passed scale factor, use it's scene's movie scale factor
     * 
     * @param {number} scaleFactor 
     * @param {number} width
     * @param {number} height
     * 
     * @return {void}
     */
    updatePositions(scaleFactor, width = 20, height = 20) {

        let scale = scaleFactor ? scaleFactor : this.scene.parent.scale

        let buttonWidth = width * scale
        let buttonHeight = height * scale

        if (this.buttons['LEFT']) {
            this.buttons['LEFT'].width = buttonWidth
            this.buttons['LEFT'].height = buttonHeight
            this.buttons['LEFT'].position.x = buttonWidth
            this.buttons['LEFT'].position.y = this.scene.height - buttonHeight
        }

        if (this.buttons['RIGHT']) {
            this.buttons['RIGHT'].width = buttonWidth
            this.buttons['RIGHT'].height = buttonHeight
            this.buttons['RIGHT'].position.x = (buttonWidth * 2) + 10
            this.buttons['RIGHT'].position.y = this.scene.height - buttonHeight
        }

        if (this.buttons['A']) {
            this.buttons['A'].width = buttonWidth
            this.buttons['A'].height = buttonHeight
            this.buttons['A'].position.x = this.scene.width - (buttonWidth * 2) - 10
            this.buttons['A'].position.y = this.scene.height - buttonHeight
        }

        if (this.buttons['B']) {
            this.buttons['B'].width = buttonWidth
            this.buttons['B'].height = buttonHeight
            this.buttons['B'].position.x = this.scene.width - buttonWidth
            this.buttons['B'].position.y = this.scene.height - buttonHeight
        }

        if (this.buttons['C']) {
            this.buttons['C'].width = buttonWidth
            this.buttons['C'].height = buttonHeight
            this.buttons['C'].position.x = this.scene.width - buttonWidth
            this.buttons['C'].position.y = this.scene.height - (buttonHeight * 2) - 10
        }

        if (this.buttons['D']) {
            this.buttons['D'].width = buttonWidth
            this.buttons['D'].height = buttonHeight
            this.buttons['D'].position.x = this.scene.width - buttonWidth
            this.buttons['D'].position.y = buttonHeight
        }

    }

    /**
     * Draws all touch buttons
     * 
     * @param {CanvasRenderingContext2D} graphics 
     * 
     * @return {void}
     */
    draw(graphics) {

        // if left stick is active, draw
        if (this.leftStick.active)
            this.leftStick.draw(graphics)

        // if right stick is active, draw
        if (this.rightStick.active)
            this.rightStick.draw(graphics)

        for (let i in this.buttons) {

            let button = this.buttons[i]

            if (button.alpha)
                button.draw(graphics)

        }

    }

}