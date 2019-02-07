/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Touch - handles touch interaction
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
            this.addButton(scene, 'C', scene.width - 37, 80, 32, 32)
            this.addButton(scene, 'D', scene.width - 37, 30, 32, 32)
        }

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
     * 
     * @return {void} 
     */
    addButton(scene, name, x, y, width = 32, height = 32, offset = {}) {

        let button = new Button(scene)

        button.name = name
        button.width = width
        button.height = height
        button.fillColor = 'transparent'
        button.position.x = x
        button.position.y = y
        button.lineWidth = 1

        let defaultOffset = Object.assign({
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }, offset)

        button.offsetLeft = defaultOffset.left
        button.offsetTop = defaultOffset.top
        button.offsetRight = defaultOffset.right
        button.offsetBottom = defaultOffset.bottom

        this.buttons[name] = button
        this.buttons.length++
    }

    /**
     * Removes a button from buttons pool
     * 
     * @param {string} name
     * 
     * @return {void}
     */
    removeButton(name) {
        delete this.buttons[name]
        this.buttons.length--
    }

    update(dt) {
        for (let i in this.buttons) {

            let button = this.buttons[i]

            if (button.alpha)
                button.update(dt)

        }
    }

    updatePositions(scale) {

        let buttonWidth = 20 * (scale ? scale : this.scene.parent.scale)
        let buttonHeight = 20 * (scale ? scale : this.scene.parent.scale)

        this.buttons['LEFT'].width = buttonWidth
        this.buttons['LEFT'].height = buttonHeight
        this.buttons['LEFT'].position.x = buttonWidth
        this.buttons['LEFT'].position.y = this.scene.height - buttonHeight

        this.buttons['RIGHT'].width = buttonWidth
        this.buttons['RIGHT'].height = buttonHeight
        this.buttons['RIGHT'].position.x = (buttonWidth * 2) + 10
        this.buttons['RIGHT'].position.y = this.scene.height - buttonHeight

        this.buttons['A'].width = buttonWidth
        this.buttons['A'].height = buttonHeight
        this.buttons['A'].position.x = this.scene.width - (buttonWidth * 2) - 10
        this.buttons['A'].position.y = this.scene.height - buttonHeight

        this.buttons['B'].width = buttonWidth
        this.buttons['B'].height = buttonHeight
        this.buttons['B'].position.x = this.scene.width - buttonWidth
        this.buttons['B'].position.y = this.scene.height - buttonHeight

        this.buttons['C'].width = buttonWidth
        this.buttons['C'].height = buttonHeight
        this.buttons['C'].position.x = this.scene.width - buttonWidth
        this.buttons['C'].position.y = this.scene.height - (buttonHeight * 2) - 10

        this.buttons['D'].width = buttonWidth
        this.buttons['D'].height = buttonHeight
        this.buttons['D'].position.x = this.scene.width - buttonWidth
        this.buttons['D'].position.y = buttonHeight

    }

    /**
     * Draws all touch buttons
     * 
     * @param {CanvasRenderingContext2D} graphics 
     * 
     * @return {void}
     */
    draw(graphics) {

        for (let i in this.buttons) {

            let button = this.buttons[i]

            if (button.alpha)
                button.draw(graphics)

        }

    }

}