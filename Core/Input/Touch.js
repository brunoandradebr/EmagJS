/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Touch - handles touch interaction
 */
class Touch {

    /**
     * 
     * @param {EmagJs.Core.Display.Scene} scene 
     */
    constructor(scene) {

        /**
         * Scene where butons will be positioned and rendered
         * 
         * @type {EmagJs.Core.Display.Scene}
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
            this.addButton(scene, 'LEFT', 35, scene.camera.height - 28, 32, 32)
            this.addButton(scene, 'RIGHT', 75, scene.camera.height - 28, 32, 32)
            this.addButton(scene, 'A', scene.camera.width - 75, scene.camera.height - 28, 32, 32)
            this.addButton(scene, 'B', scene.camera.width - 37, scene.camera.height - 28, 32, 32)
            this.addButton(scene, 'C', scene.camera.width - 37, 80, 32, 32)
            this.addButton(scene, 'D', scene.camera.width - 37, 30, 32, 32)
        } else {
            this.addButton(scene, 'LEFT', 35, scene.height - 28, 32, 32)
            this.addButton(scene, 'RIGHT', 75, scene.height - 28, 32, 32)
            this.addButton(scene, 'A', scene.width - 75, scene.height - 28, 32, 32)
            this.addButton(scene, 'B', scene.width - 37, scene.height - 28, 32, 32)
            this.addButton(scene, 'C', scene.width - 37, 80, 32, 32)
            this.addButton(scene, 'D', scene.width - 37, 30, 32, 32)
        }

    }

    /**
     * Add a new button to touch
     * 
     * @external EmagJs.Core.Input.Button
     * 
     * @param {EmagJs.Core.Display.Scene} scene 
     * @param {string} name 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height
     * 
     * @return {void} 
     */
    addButton(scene, name, x, y, width = 32, height = 32) {

        let button = new Button(scene)

        button.name = name
        button.width = width
        button.height = height
        button.fillColor = 'transparent'
        button.position.x = x
        button.position.y = y
        button.lineWidth = 1

        this.buttons[name] = button
        this.buttons.length++
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