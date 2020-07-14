class ParticleSystem {

    constructor(particleDefinition) {

        this.particleDefinition = particleDefinition

        this.particles = []

        this.externalForces = []

        this.timer = new Timer(10)

        this.duration = 100

        this.durationTimer = new Timer(this.duration)

        this.direction = null

        this.particlePool = new ObjectPool(
            () => {
                const particle = new Sprite(
                    this.particleDefinition && this.particleDefinition.position ? this.particleDefinition.position.clone() : new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y),
                    this.particleDefinition && this.particleDefinition.width ? this.particleDefinition.width : 2,
                    this.particleDefinition && this.particleDefinition.height ? this.particleDefinition.height : 2,
                    this.particleDefinition && this.particleDefinition.fillColor ? this.particleDefinition.fillColor : 'orange',
                    this.particleDefinition && this.particleDefinition.lineWidth ? this.particleDefinition.lineWidth : 0,
                    this.particleDefinition && this.particleDefinition.lineColor ? this.particleDefinition.lineColor : 'transparent'
                )
                particle.image = this.particleDefinition && this.particleDefinition.image ? this.particleDefinition.image : null
                particle.body = new Body(particle)
                particle.compositeOperation = this.particleDefinition && this.particleDefinition.compositeOperation ? this.particleDefinition.compositeOperation : 'lighter'
                particle.shadowBlur = this.particleDefinition && this.particleDefinition.shadowBlur ? this.particleDefinition.shadowBlur : 3
                particle.shadowColor = this.particleDefinition && this.particleDefinition.shadowColor ? this.particleDefinition.shadowColor : 'red'
                return particle
            },
            (particle) => {
                const x = this.particleDefinition && this.particleDefinition.position ? this.particleDefinition.position.x : DEVICE_CENTER_X
                const y = this.particleDefinition && this.particleDefinition.position ? this.particleDefinition.position.y : DEVICE_CENTER_Y
                particle.position.update(x, y)
                particle.body.position.update(x, y)
                particle.body.velocity.x = this.direction ? this.direction.x * 5 : random(1) * 5
                particle.body.velocity.y = this.direction ? this.direction.y * 5 : random(1) * 5
                particle.body.mass = this.particleDefinition && this.particleDefinition.mass ? this.particleDefinition.mass : 1
                particle.lifeSpan = this.particleDefinition && this.particleDefinition.lifeSpan ? this.particleDefinition.lifeSpan : 1
                particle.lifeFade = this.particleDefinition && this.particleDefinition.lifeFade ? this.particleDefinition.lifeFade : .018
                return particle
            }
        )

    }

    update(dt) {

        this.timer.start
        this.durationTimer.start

        if (this.durationTimer.count === 0 || this.duration === Infinity) {
            if (this.timer.tick)
                this.particles.push(this.particlePool.create())
        }

        this.particles.map((particle, i) => {

            particle.lifeSpan -= particle.lifeFade
            particle.alpha = particle.lifeSpan

            if (particle.lifeSpan > 0) {
                particle.body.update(dt)
                this.externalForces.map((force) => particle.body.applyForce(force))
                particle.position.update(particle.body.position)
            } else {
                this.particlePool.destroy(particle)
                this.particles.splice(i, 1)
            }
        })

    }

    draw(graphics) {
        this.particles.map((particle) => particle.draw(graphics))
    }

}