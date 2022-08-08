class Unit extends Shape {

    constructor(position = new Vector, width = 40, height = 40, lineColor = 'white') {

        super(new Triangle, position, width, height, 'transparent', 1, lineColor)

        this.body = new Body(this)

        this.collider = new Circle(this.body.position, (width * 0.5) + width * 0.4, 'transparent', 1, 'orange')

        this.fov = new FieldView(this.body.position, 'rgba(0, 255, 0, 0.1)', 0)

        this.watchingAngle = 0

        this.speed = 4
        this.steering = .1

        this.path = []
        this.currentStep = 0

        this.debug = false

    }

    move() {
        this.currentStep = 0
    }

    avoid(index, unities) {
        unities.map((unit, i) => {
            if (index != i) {
                const dx = this.body.position.x - unit.body.position.x
                const dy = this.body.position.y - unit.body.position.y
                const dist = dx * dx + dy * dy
                if (dist < 30 * 30) {
                    const desiredVelocity = unit.position.clone().subtract(this.body.position).normalize.multiplyScalar(this.speed)
                    const steering = desiredVelocity.subtract(this.body.velocity)
                    steering.multiplyScalar(-this.steering * 0.1)
                    this.body.velocity.add(steering)
                }
            }
        })
    }

    update(dt) {

        this.body.update(dt)

        this.fov.debug = this.debug

        if (this.path.length) {

            const currentTarget = this.path[this.currentStep]

            let dist = 0

            if (currentTarget) {
                const dx = this.body.position.x - currentTarget.position.x
                const dy = this.body.position.y - currentTarget.position.y
                dist = dx * dx + dy * dy
            }

            if (dist < 30 * 30) {
                this.currentStep++
            }

            if (currentTarget) {
                const desiredVelocity = currentTarget.position.clone().subtract(this.body.position).normalize.multiplyScalar(this.speed)
                const steering = desiredVelocity.subtract(this.body.velocity)
                steering.multiplyScalar(this.steering)
                this.body.velocity.add(steering)
            } else {
                this.body.velocity.multiplyScalar(0.9)
            }
        } else {

            this.body.velocity.multiplyScalar(0.5)

        }

        const vx = this.body.velocity.x
        const vy = this.body.velocity.y
        const moving = vx * vx + vy * vy

        this.body.angle = this.body.velocity.angle * toDegree
        this.rotateZ(this.body.angle)
        this.transform()

        if (moving < 1) {
            this.watchingAngle++
            if (this.watchingAngle > 100) {
                this.fov.angle += Math.sin(Math.cos((this.watchingAngle - 100) * 0.01) * .01) * toDegree
            } else {
                this.fov.angle = this.body.angle
            }
        } else {
            this.fov.angle = this.body.angle
            this.watchingAngle = 0
        }

        this.fov.castRays()

        this.position.update(this.body.position)
        this.collider.position.update(this.body.position)

    }

    draw(graphics) {

        super.draw(graphics)

        this.fov.draw(graphics)

        if (this.debug && this.path.length) {
            this.collider.draw(graphics)
            graphics.save()
            graphics.beginPath()
            let gradient = graphics.createLinearGradient(this.path[0].position.x, this.path[0].position.y, this.path[this.path.length - 1].position.x, this.path[this.path.length - 1].position.y)
            gradient.addColorStop(0, 'purple')
            gradient.addColorStop(0.5, 'royalblue')
            gradient.addColorStop(0.7, 'cyan')
            gradient.addColorStop(1, '#eee')
            graphics.strokeStyle = gradient
            graphics.lineWidth = 2
            graphics.lineCap = 'butt'
            for (let i = 0; i < this.path.length; i++) {
                if (this.path[i + 1]) {
                    const currentStep = this.path[i].position
                    const nextStep = this.path[i + 1].position
                    graphics.moveTo(currentStep.x, currentStep.y)
                    graphics.lineTo(nextStep.x, nextStep.y)
                }
            }
            graphics.closePath()
            graphics.stroke()
            graphics.restore()
        }

    }

}