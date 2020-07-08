class ParticleSystem {

    constructor() {

        this.particles = []

        this.externalForces = []

        this.timer = new Timer(300)

        this.particlePool = new ObjectPool(
            () => {
                const particle = new Sprite(new Vector(0, 0), 2, 2, 'orange', 0)
                particle.body = new Body(particle)
                particle.compositeOperation = 'lighter'
                particle.shadowBlur = 2
                particle.shadowColor = 'red'
                return particle
            },
            (particle) => {
                const size = 10
                particle.width = particle.height = size
                const x = DEVICE_CENTER_X + random(0)
                const y = DEVICE_CENTER_Y + random(0)
                particle.position.update(x, y)
                particle.body.position.update(x, y)
                particle.body.velocity.update(0, -10)
                particle.body.mass = 1
                particle.lifeSpan = 1
                particle.lifeFade = .018
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