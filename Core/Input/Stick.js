class Stick {

    constructor(scene) {

        if (!scene)
            throw new Error('scene not defined for stick constructor')

        this.scene = scene

        this.active = false

        this.initialPosition = new Vector

        this.interactArea = {
            position: new Vector(20, 20),
            size: 100
        }

        this.radius = 100

        this.radiusSprite = new Circle(this.initialPosition, this.radius, 'rgba(0, 0, 0, 0.01)', 0)

    }

    update() {

        // for each touch pointer
        for (let i in touches) {

            let touch = touches[i]

            // touch is an object, so 'length' property is listed as well
            if (typeof (touch) == 'number')
                continue

            // offset touch position
            let x = touch.clientX - this.scene.offsetX
            let y = touch.clientY - this.scene.offsetY

            // adjusts if camera is moving
            if (this.scene.camera) {
                if (this.scene.camera.x >= 0)
                    x = touch.clientX - (this.scene.offsetX - this.scene.camera.x * this.scene.scale)
                if (this.scene.camera.y >= 0)
                    y = touch.clientY - (this.scene.offsetY - this.scene.camera.y * this.scene.scale)
            }

            // touching button area
            // if (x > ((buttonX - buttonWidth * 0.5) - this.offsetLeft) && x < ((buttonX + buttonWidth * 0.5) + this.offsetRight)) {
            //     if (y > ((buttonY - buttonHeight * 0.5) - this.offsetTop) && y < ((buttonY + buttonHeight * 0.5) + this.offsetBottom)) {
            //         _pointerDown = true
            //     }
            // }

        }

    }

    draw(graphics) {

        this.radiusSprite.draw(graphics)

    }

}