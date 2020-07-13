class ParticleSystem {

    constructor(particleDefinition) {

        this.particleDefinition = particleDefinition

        this.particles = []

        this.externalForces = []

        this.timer = new Timer(100)

        this.particlePool = new ObjectPool(
            () => {
                const particle = new Sprite(
                    this.particleDefinition.position.clone(),
                    this.particleDefinition.width,
                    this.particleDefinition.height,
                    this.particleDefinition.fillColor,
                    this.particleDefinition.lineWidth,
                    this.particleDefinition.lineColor
                )
                particle.image = this.particleDefinition.image
                particle.body = new Body(particle)
                particle.compositeOperation = this.particleDefinition.compositeOperation || 'lighter'
                particle.shadowBlur = this.particleDefinition.shadowBlur || 0
                particle.shadowColor = this.particleDefinition.shadowColor || 'transparent'
                return particle
            },
            (particle) => {
                const x = this.particleDefinition.position.x + random(0)
                const y = this.particleDefinition.position.y + random(0)
                particle.position.update(x, y)
                particle.body.position.update(x, y)
                particle.body.velocity.update(0, -8)
                particle.body.mass = this.particleDefinition.mass || 1
                particle.lifeSpan = this.particleDefinition.lifeSpan || 1
                particle.lifeFade = this.particleDefinition.lifeFade || .018
                return particle
            }
        )

    }

    update(dt) {

        this.timer.start

        if (this.timer.tick)
            this.particles.push(this.particlePool.create())

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