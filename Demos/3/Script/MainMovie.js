let asteroid = new Movie('asteroid')

let width = 480
let height = 270

/**
 * layer with crt scanlines
 */
asteroid.addScene('crt', {

    index: 3,

    fullscreen: true,

    blend: 'luminosity',

    onCreate: (scene) => {
        scene.canvas.style.background = 'url(http://i.imgur.com/TAJ0Zkw.png)'
    },
    onLoop: (scene, dt, elapsedTime) => {
        scene.canvas.style.backgroundSize = (100 + (Math.cos(elapsedTime * 0.01) * 10)) + '%'
    }

})

asteroid.addScene('overlay2', {

    index: 2,

    fullscreen: true,

    onCreate: (scene) => {
        scene.canvas.style.backgroundColor = '#2540a5'
        scene.canvas.style.opacity = 0.2
    }

})

asteroid.addScene('overlay', {

    index: 1,

    fullscreen: true,

    blend: 'soft-light',

    onCreate: (scene) => {
        scene.canvas.style.backgroundImage = 'radial-gradient(circle farthest-side at 50% 50%, #ff00eb, #0089ff)'
    }

})

asteroid.addScene('main', {

    fullscreen: true,

    backgroundColor: 'black',

    onCreate: (scene) => {

        //      TODO LIST
        //      - reset
        //      - death
        //      - new enemy
        //      - cache as bitmap
        //      - refactory sound fx class

        // sound *********************************************
        scene.sound = new SoundFx()
        // create music buffer
        scene.musicSound = audioContext.createBufferSource()
        scene.musicSound.buffer = assets.sounds.music
        scene.musicSound.loop = true
        // create music gain node
        scene.musicGain = audioContext.createGain()
        scene.musicGain.gain.value = 1
        // connect music buffer to music gain
        scene.musicSound.connect(scene.musicGain)
        // connect music gain to music channel
        scene.musicGain.connect(music)
        // create reverb effect
        scene.reverb = audioContext.createConvolver()
        scene.reverb.buffer = assets.sounds.reverb
        // connect music gain to reverb
        scene.musicGain.connect(scene.reverb)
        // connect reverb effect to music channel
        scene.reverb.connect(music)
        // start music
        scene.musicSound.start()
        // /sound *********************************************



        // input **********************************************
        scene.input = new Input(new Keyboard)
        // touch input
        scene.touch = new Touch(scene)
        scene.touch.removeButton('A', 'B', 'C', 'D', 'LEFT', 'RIGHT')
        scene.touch.leftStick.active = true
        scene.touch.leftStick.thumbLineWidth = 0
        scene.touch.rightStick.active = true
        scene.touch.rightStick.thumbLineWidth = 0
        scene.touch.rightStick.autoResetDirection = false
        // /input *********************************************



        // collision handler **********************************
        scene.collision = new CollisionHandler()
        // /collision handler *********************************



        // ship ***********************************************
        scene.ship = new Shape(new Triangle, new Vector(scene.width * 0.49, scene.height * 0.7), 32, 32, 'white', 0)
        // ship body physic
        scene.ship.body = new Body(scene.ship)
        scene.ship.body.speed = 1
        scene.ship.body.friction = new Vector(.80, .80)
        // ship direction vector
        scene.ship.direction = new Vector(1, 0)
        // ship mechanics properties
        scene.ship.turrets = 1
        scene.ship.bulletSpeed = 20
        scene.ship.bulletSpace = 5
        scene.ship.fireSpeed = 800
        scene.ship.firePower = 1
        // ship distortion radius
        scene.ship.distortionRadius = new Circle(scene.ship.body.position, 100, 'transparent', 2, 'white')
        // ship collision radius
        scene.ship.collisionRadius = new Circle(scene.ship.body.position, 30, 'transparent', 2, 'white')
        // ship hole mask effect
        scene.ship.holeMask = new Sprite(scene.ship.body.position, 400, 400, 'purple', 0)
        // mask radial color - TODO - utils/createRadialColor
        let gradient = scene.graphics.createRadialGradient(0, 0, 50, 0, 0, 150)
        gradient.addColorStop(1, 'transparent')
        gradient.addColorStop(0, "black")
        scene.ship.holeMask.fillColor = gradient
        // ship trail
        scene.ship.trails = []
        // ship trail respawn timer
        scene.ship.trailRespawnTimer = new Timer(0)
        // ship trail pool
        scene.ship.trail = new ObjectPool(() => {
            // create trail object
            let trail = new Shape(new Square, new Vector, 8, 8, 'white')
            trail.body = new Body(trail)
            trail.shadowBlur = 5
            trail.shadowColor = 'yellow'
            trail.compositeOperation = 'lighter'
            trail.shadowOffsetX = trail.shadowOffsetY = 0
            return trail
        }, (trail) => {
            // reset trail object
            trail.body.position.update(scene.ship.body.position.x, scene.ship.body.position.y)
            trail.body.velocity.update(-scene.ship.direction.x * 8 + Math.random(), -scene.ship.direction.y * 8 + Math.random())
            trail.alpha = 2
            trail.rotateZ(scene.ship.angle)
            trail.transform()
            return trail
        })
        // ship bullet
        scene.ship.bullets = []
        // ship fire timer
        scene.ship.bulletFireTimer = new Timer(scene.ship.fireSpeed)
        // ship bullet pool
        scene.ship.bullet = new ObjectPool(() => {
            // create bullet object
            let bullet = new Shape(new Square, new Vector, 10, 10, 'rgba(255, 255, 255, 0.5)', 0)
            bullet.body = new Body(bullet)
            bullet.radius = new Circle(bullet.body.position, 10, 'transparent', 2, 'white')
            return bullet
        }, (bullet) => {
            // reset bullet object
            bullet.body.position.update(scene.ship.body.position.x, scene.ship.body.position.y)
            bullet.body.velocity.update(scene.ship.direction.x * scene.ship.bulletSpeed, scene.ship.direction.y * scene.ship.bulletSpeed)
            bullet.rotateZ(scene.ship.angle)
            bullet.transform()
            return bullet
        })
        // tmp vector to help rotate bullets
        scene.tmpVector = new Vector(1, 0)
        // /ship **********************************************



        // asteroids ******************************************
        scene.asteroids = []
        // asteroid pool
        scene.asteroid = new ObjectPool(() => {
            // create asteroid object
            let asteroid = new Shape(new RandomPolygon, new Vector, 50, 50, 'transparent', 1, 'white')
            asteroid.body = new Body(asteroid)
            asteroid.explosionRadius = new Circle(asteroid.body.position, 100, 'transparent', 1, 'white')
            return asteroid
        }, (asteroid) => {
            // reset asteroid object
            asteroid.position.update(-500, random(scene.height, 0))
            asteroid.body.position.update(asteroid.position.x, asteroid.position.y)
            asteroid.body.velocity.update(randomPick(1, -1), randomPick(1, -1))
            asteroid.life = 5
            let size = 50 + random(30, 0)
            asteroid.scale(size, size)
            asteroid.transform()
            return asteroid
        })
        // /asteroids *****************************************



        // items **********************************************
        scene.SPEED_ITEM = 0
        scene.POWER_ITEM = 1
        scene.GUN_ITEM = 2

        scene.items = []
        // item pool
        scene.item = new ObjectPool(() => {
            // create item object
            let item = new Sprite(new Vector, 15, 15, 'transparent', 2, 'white')
            item.radius = new Circle(item.position, 15, 15, 'transparent', 2, 'white')
            item.shadowBlur = 5
            // item label
            item.letter = new Text('', new Vector, 'arial', 'white', 12, 2, 'black')
            item.letter.shadowBlur = 2
            item.letter.shadowOffsetX = item.letter.shadowOffsetY = 0
            return item
        }, (item) => {
            // reset item object

            item.type = random(2, 0)

            let color, label

            switch (item.type) {
                case scene.SPEED_ITEM: color = 'cyan'; label = 'speed'; break;
                case scene.POWER_ITEM: color = 'lime'; label = 'power'; break;
                case scene.GUN_ITEM: color = 'red'; label = 'gun'; break;
            }

            item.angle = 0
            item.shadowColor = color
            item.letter.shadowColor = color
            item.letter.text = label

            return item
        })
        // /items *********************************************



        // particles ******************************************
        scene.sparkParticles = []
        // spark particle pool
        scene.sparkParticle = new ObjectPool(() => {
            // create spark particle object
            let particle = new Sprite(new Vector, 8, 2, 'white', 0)
            particle.body = new Body(particle)
            particle.body.mass = 1 + random(1, 0)
            return particle
        }, (particle) => {
            // reset spark particle object
            particle.body.velocity.update(0, 0)
            particle.alpha = 1
            return particle
        })

        scene.flameParticles = []
        // flame image
        let flameSprite = new ImageProcessor(assets.images.fire).tint(255, 0, 180)
        // flame particle pool
        scene.flameParticle = new ObjectPool(() => {
            // create flame particle object
            let flame = new Sprite(new Vector, 128 * 2, 128 * 2, 'transparent', 0)
            flame.image = flameSprite
            flame.compositeOperation = 'lighter'
            return flame
        }, (flame) => {
            // reset flame particle object
            flame.alpha = 1
            flame.matrix.rotateZ(random(360, 0))
            return flame
        })
        // /particles *****************************************



        // explosion holes ************************************
        scene.explosionHoles = []
        // explosion hole pool
        scene.explosionHole = new ObjectPool(() => {
            // create explosion hole object
            let explosionHole = new Sprite(new Vector, 400, 400, 'purple', 0)
            // radial gradient
            let gradient = scene.graphics.createRadialGradient(0, 0, 30, 0, 0, 160)
            gradient.addColorStop(1, 'transparent')
            gradient.addColorStop(0, "black")
            explosionHole.fillColor = gradient
            return explosionHole
        }, (explosionHole) => {
            explosionHole.alpha = 1.2
            return explosionHole
        })
        // /explosion holes ***********************************



        // slow motion interpolation **************************
        let slowMotionDuration = 1000
        // interpolates from 1 to 0.2 and back to 1
        scene.slowMotion = new Tween({ t: 1 })
        scene.slowMotion.animate({ t: -.8 }, 800, 0, 'cubicInOut')
        scene.slowMotion.animate({ t: .8 }, 1000, slowMotionDuration, 'cubicInOut')
        // /slow motion interpolation *************************



        // space grid *****************************************
        scene.spaceGridColors = ['purple', 'pink', 'cyan']

        // function that creates the space grid
        scene.createSpaceGrid = () => {

            scene.spaceGrid = []

            let nodeRadius = 20

            // calculates how many nodes are necessary to fill entire screen
            scene.horizontal = ((scene.width / (nodeRadius * 2)) | 0) + 2
            scene.vertical = ((scene.height / (nodeRadius * 2)) | 0) + 2

            // create nodes
            for (let y = 0; y < scene.vertical; y++) {
                for (let x = 0; x < scene.horizontal; x++) {
                    let point = new Circle(new Vector(x * nodeRadius * 2, nodeRadius * 0.5 + y * nodeRadius * 2), nodeRadius, 'transparent', 1, 'white')
                    point.body = new Body(point)
                    point.body.friction = new Vector(.98, .98)
                    point.initialPosition = point.position.clone()
                    scene.spaceGrid.push(point)
                }
            }

            // partitionate space in grid
            // to speed up collision check with bullet and ship
            scene.partitionSpace = new SpatialSpace((scene.width / 120) | 0, (scene.width / 120) | 0)
            // add grid nodes to partition space
            scene.partitionSpace.addObjects(scene.spaceGrid)
            scene.partitionSpace.debug = true

        }
        // create space grid
        scene.createSpaceGrid()
        // space grid *****************************************



        // to speed up collision check with ship and asteroids
        scene.asteroidPartitionSpace = new SpatialSpace((scene.width / 120) | 0, (scene.width / 120) | 0)



        // wave ***********************************************
        scene.wave = 1

        // wave label
        scene.waveLabel = new Text('Wave', new Vector, 'commodore', 'white', 120)
        scene.waveLabel.position.x = -DEVICE_CENTER_X - scene.waveLabel.width * 0.5
        scene.waveLabel.position.y = DEVICE_CENTER_Y - scene.waveLabel.size * 0.5
        // wave level label
        scene.waveLevelLabel = new Text(scene.wave, new Vector, scene.waveLabel.font, scene.waveLabel.color, scene.waveLabel.size)
        scene.waveLevelLabel.position.x = DEVICE_CENTER_X - scene.waveLevelLabel.width * 0.5
        scene.waveLevelLabel.position.y = -scene.waveLabel.position.y + scene.waveLabel.size
        // wave animation - interpolation from -1 to 1 and back to -1
        scene.waveAnimation = new Tween({ i: -1 })
        scene.waveAnimation.animate({ i: 2 }, 2000, 0, 'elasticInOut')
        scene.waveAnimation.animate({ i: -3 }, 2000, 2200, 'elasticInOut')

        // function that creates a new wave
        scene.newWave = () => {

            // play wave animation again
            scene.waveAnimation.resetAnimations()

            // creates asteroids based on wave level
            for (let i = 0; i < scene.wave; i++) {
                // create a new big one
                let asteroid = scene.asteroid.create()
                // add new asteroid
                scene.asteroids.push(asteroid)
            }

            // update wave level label
            scene.waveLevelLabel.text = scene.wave

            scene.wave++

        }
        // /wave **********************************************

    },

    onLoop: (scene, dt) => {

        // add asteroids to partition space
        scene.asteroidPartitionSpace.addObjects(scene.asteroids)

        // play slow motion animation
        scene.slowMotion.play()

        // slow down music
        scene.musicSound.playbackRate.value = scene.slowMotion.value

        // debug mode
        if (scene.input.pressed('SPACE'))
            scene.DEBUG = !scene.DEBUG



        // ship **********************************************
        // update ship physic body
        scene.ship.body.update(dt)

        // update ship direction vector
        if (MOBILE) {
            scene.ship.direction.x = scene.touch.rightStick.direction.x
            scene.ship.direction.y = scene.touch.rightStick.direction.y
        } else {
            let mouseViewport = globalToViewport(mouse, scene)
            scene.ship.direction.x = mouseViewport.x - scene.ship.body.position.x
            scene.ship.direction.y = mouseViewport.y - scene.ship.body.position.y
            scene.ship.direction.normalize
        }

        // move ship
        if (MOBILE) {
            scene.ship.body.applyForce(scene.touch.leftStick.direction.x * scene.ship.body.speed, scene.touch.leftStick.direction.y * scene.ship.body.speed)
        } else {
            if (scene.input.holding('D'))
                scene.ship.body.applyForce(scene.ship.body.speed, 0)
            if (scene.input.holding('A'))
                scene.ship.body.applyForce(-scene.ship.body.speed, 0)
            if (scene.input.holding('W'))
                scene.ship.body.applyForce(0, -scene.ship.body.speed)
            if (scene.input.holding('S'))
                scene.ship.body.applyForce(0, scene.ship.body.speed)
        }

        // apply friction to ship body
        scene.ship.body.velocity.multiply(scene.ship.body.friction)

        // rotate ship
        scene.ship.rotateZ(scene.ship.direction.angle * toDegree)
        scene.ship.transform()

        // warp zone ship
        if (scene.ship.body.position.x > scene.width) scene.ship.body.position.x = 0
        if (scene.ship.body.position.x < 0) scene.ship.body.position.x = scene.width
        if (scene.ship.body.position.y > scene.height) scene.ship.body.position.y = 0
        if (scene.ship.body.position.y < 0) scene.ship.body.position.y = scene.height

        // start trail respawn timer start
        scene.ship.trailRespawnTimer.start
        // create ship trails
        if (scene.ship.trailRespawnTimer.tick)
            scene.ship.trails.push(scene.ship.trail.create())

        // update ship trails
        for (let i = scene.ship.trails.length - 1; i >= 0; i--) {

            let trail = scene.ship.trails[i]

            // update trail physic body
            trail.body.update(dt)
            // fades
            trail.alpha -= .12
            // remove if not visible
            if (trail.alpha <= 0) {
                scene.ship.trail.destroy(trail)
                scene.ship.trails.splice(i, 1)
            }

        }

        // collides with asteroid
        let asteroidsNearShip = scene.asteroidPartitionSpace.getArea(scene.ship.body.position.x, scene.ship.body.position.y, 1)
        asteroidsNearShip.map((asteroid, i) => {
            if (scene.collision.check(scene.ship, asteroid)) {
                asteroid.life = 0
            }
        })

        // bullet fire timer start
        scene.ship.bulletFireTimer.start
        // fire!
        if (mousedown || scene.touch.rightStick.isDown) {
            if (scene.ship.bulletFireTimer.tick) {

                // angle between bullet pair
                // /
                // ------
                // \
                let waveAngle = 0

                for (let i = 0; i < scene.ship.turrets; i++) {

                    // create/get bullet from pool
                    let bullet = scene.ship.bullet.create()
                    // after 3 bullets, increment wave angle
                    waveAngle += i % 2
                    // is left bullet
                    let leftBullet = (i % 2 == 0) ? 1 : -1
                    // rotate bullet to spread
                    scene.tmpVector.rotate(scene.ship.angle + (waveAngle * scene.ship.bulletSpace * leftBullet))
                    // update bullet velocity
                    bullet.body.velocity.update(scene.tmpVector.x * scene.ship.bulletSpeed, scene.tmpVector.y * scene.ship.bulletSpeed)
                    // add bullet
                    scene.ship.bullets.push(bullet)

                }

                scene.sound.play(assets.sounds.bullet, 6)

            }
        }

        // update ship bullets
        for (let i = scene.ship.bullets.length - 1; i >= 0; i--) {

            let bullet = scene.ship.bullets[i]

            // update bullet physic body
            bullet.body.update(dt * scene.slowMotion.value)

            // get points inside same bullet grid
            let gridPoints = scene.partitionSpace.getArea(bullet.body.position.x, bullet.body.position.y)
            // grid distortion
            gridPoints.map((point) => {
                if (scene.collision.check(point, bullet.radius)) {
                    point.body.applyForce(random(2), random(2))
                }
            })

            // off screen
            if (bullet.body.position.x > scene.width ||
                bullet.body.position.x < 0 ||
                bullet.body.position.y < 0 ||
                bullet.body.position.y > scene.height
            ) {
                // remove bullet
                scene.ship.bullet.destroy(bullet)
                scene.ship.bullets.splice(i, 1)
            }

        }

        // ship distorts space grid
        let nodesNearShip = scene.partitionSpace.getArea(scene.ship.body.position.x, scene.ship.body.position.y, 1)
        nodesNearShip.map((node) => {
            if (scene.collision.check(node, scene.ship.distortionRadius)) {
                node.body.position.add(scene.collision.normal.multiplyScalar(-.7))
                node.body.velocity.add(scene.collision.normal.multiplyScalar(.7))
            }
        })
        // /ship *********************************************



        // asteroid ******************************************
        if (scene.waveAnimation.completed) {

            scene.asteroids.map((asteroid, i) => {

                // update asteroid physic body - affected by slow motion
                asteroid.body.update(dt * scene.slowMotion.value)

                // rotate asteroid
                asteroid.angle += (50 / asteroid.width) * scene.slowMotion.value
                asteroid.rotateZ(asteroid.angle)
                asteroid.transform()

                // collides with bullet
                scene.ship.bullets.map((bullet, j) => {

                    // if collided
                    if (scene.collision.check(asteroid, bullet)) {

                        // create spark particle
                        let particle = scene.sparkParticle.create()
                        // update particle start position
                        particle.body.position.update(bullet.body.position)
                        // particle bounce
                        particle.body.applyForce(scene.collision.normal.x * -5, scene.collision.normal.y * -5)
                        particle.matrix.identity()
                        particle.matrix.rotateZ(-scene.collision.normal.angle * toDegree)
                        // fast fade particle
                        particle.alpha = 0.5
                        // add particle
                        scene.sparkParticles.push(particle)

                        // remove bullet
                        scene.ship.bullet.destroy(bullet)
                        scene.ship.bullets.splice(j, 1)

                        // do damage
                        asteroid.life -= scene.ship.firePower

                        // shake screen
                        stage.shake(300, 2)
                        // play impact sound
                        scene.sound.play(assets.sounds.hit, 2)

                    }

                })

                // destroyed asteroid
                if (asteroid.life <= 0) {

                    // drop random item
                    if (random(10, 0) >= 9) {
                        let item = scene.item.create()
                        item.position.update(asteroid.body.position.x, asteroid.body.position.y)
                        scene.items.push(item)
                    }

                    // slow motion!
                    if (random(10, 0) > 9)
                        scene.slowMotion.resetAnimations()

                    // creates spark particles
                    for (let k = 0; k < 20; k++) {

                        let particle = scene.sparkParticle.create()

                        particle.body.position.x = asteroid.body.position.x
                        particle.body.position.y = asteroid.body.position.y

                        let direction = Vector.fromAngle(k * 20, 10)
                        particle.body.applyForce(direction)
                        particle.matrix.identity()
                        particle.matrix.rotateZ(-direction.angle * toDegree)

                        scene.sparkParticles.push(particle)

                    }

                    // flame particle effect
                    for (let l = 0; l < 5; l++) {
                        let flame = scene.flameParticle.create()
                        flame.position.x = asteroid.body.position.x
                        flame.position.y = asteroid.body.position.y
                        scene.flameParticles.push(flame)
                    }

                    // create new small asteroids
                    if (asteroid.width > 20) {
                        for (let l = 0; l < 3; l++) {
                            let newAsteroid = scene.asteroid.create()
                            // update new asteroid position
                            newAsteroid.position.update(asteroid.body.position)
                            newAsteroid.body.position.update(asteroid.body.position)
                            // update asteroid velocity
                            newAsteroid.body.velocity.update(Vector.random())
                            // scales asteroid to a small portion
                            newAsteroid.scale(asteroid.width * 0.5, asteroid.height * 0.5)
                            newAsteroid.transform()
                            // define new asteroid life
                            newAsteroid.life = asteroid.width >= 50 ? 2 : 1
                            // add new asteroid
                            scene.asteroids.push(newAsteroid)
                        }
                    }

                    // create explosion hole
                    let explosionHole = scene.explosionHole.create()
                    explosionHole.position.x = asteroid.body.position.x
                    explosionHole.position.y = asteroid.body.position.y
                    scene.explosionHoles.push(explosionHole)

                    // distort space grid
                    let nodesNearExplosion = scene.partitionSpace.getArea(asteroid.position.x, asteroid.position.y, 1)
                    nodesNearExplosion.map((node) => {
                        if (scene.collision.check(node, asteroid.explosionRadius)) {
                            node.body.position.add(scene.collision.normal.multiplyScalar(-2))
                            node.body.velocity.add(scene.collision.normal.multiplyScalar(2))
                        }
                    })

                    // remove asteroid
                    scene.asteroid.destroy(asteroid)
                    scene.asteroids.splice(i, 1)

                    // play explosion sound
                    scene.sound.play(assets.sounds.explosion, asteroid.width >= 50 ? 6 : 3)

                    // shake screen
                    stage.shake(900, 10)

                }

                // warp zone asteroid
                if (asteroid.body.position.x - asteroid.width > scene.width + asteroid.width) asteroid.body.position.x = -asteroid.width
                if (asteroid.body.position.x + asteroid.width < -asteroid.width) asteroid.body.position.x = scene.width + asteroid.width
                if (asteroid.body.position.y - asteroid.height > scene.height + asteroid.height) asteroid.body.position.y = -asteroid.height
                if (asteroid.body.position.y + asteroid.height < -asteroid.height) asteroid.body.position.y = scene.height + asteroid.height

            })

        }
        // /asteroid *****************************************



        // particles *****************************************
        // update spark particles
        for (let i = scene.sparkParticles.length - 1; i >= 0; i--) {

            let particle = scene.sparkParticles[i]
            // update spark particle physic body
            particle.body.update(dt * scene.slowMotion.value)
            // fade out
            particle.alpha -= .009 * scene.slowMotion.value
            // apply friction
            particle.body.velocity.multiplyScalar(.98)

            // remove particle
            if (particle.alpha <= 0) {
                scene.sparkParticle.destroy(particle)
                scene.sparkParticles.splice(i, 1)
            }

            // bounce particle into wall
            if (particle.body.position.x - particle.width > scene.width || particle.body.position.x + particle.width < 0) {
                particle.body.velocity.x *= -1
                particle.matrix.identity()
                particle.matrix.rotateZ(-particle.body.velocity.angle * toDegree)
            }
            if (particle.body.position.y - particle.height > scene.height || particle.body.position.y + particle.height < 0) {
                particle.body.velocity.y *= -1
                particle.matrix.identity()
                particle.matrix.rotateZ(-particle.body.velocity.angle * toDegree)
            }

        }

        // fades flame particles
        for (let i = scene.flameParticles.length - 1; i >= 0; i--) {
            let flame = scene.flameParticles[i]
            // fade out
            flame.alpha -= .02
            // remove flame particle
            if (flame.alpha <= 0) {
                scene.flameParticle.destroy(flame)
                scene.flameParticles.splice(i, 1)
            }
        }
        // /particles ****************************************



        // explosion holes ***********************************
        for (let i = scene.explosionHoles.length - 1; i >= 0; i--) {

            let explosionHole = scene.explosionHoles[i]

            // fade out
            explosionHole.alpha -= .002

            // remove explosionHole
            if (explosionHole.alpha <= 0) {
                scene.explosionHole.destroy(explosionHole)
                scene.explosionHoles.splice(i, 1)
            }

        }
        // /explosion holes **********************************



        // items *********************************************
        for (let i = scene.items.length - 1; i >= 0; i--) {

            let item = scene.items[i]

            // item animation - bounce and rotate
            item.angle++
            item.matrix.identity()
            item.matrix.rotateX(65)
            item.matrix.rotateZ(item.angle * 0.05 * toDegree)
            item.width = 15 + Math.cos(item.angle * 0.1) * 4 * dt
            item.letter.position.update(item.position.x - item.letter.width * 0.5, item.position.y - item.letter.size * 0.5 + Math.cos(item.angle * 0.1) * 2 * dt)

            // pick item
            if (scene.collision.check(scene.ship.collisionRadius, item.radius)) {

                switch (item.type) {
                    case scene.SPEED_ITEM: scene.ship.bulletFireTimer.interval -= 25; break;
                    case scene.POWER_ITEM: scene.ship.firePower += 0.01; break;
                    case scene.GUN_ITEM: scene.ship.turrets += .4; break;
                }

                // remove item
                scene.item.destroy(item)
                scene.items.splice(i, 1)
                // play pick sound
                scene.sound.play(assets.sounds.item)

            }

        }
        // /items ********************************************



        // space grid ****************************************
        scene.spaceGrid.map((node) => {

            // update space grid node physic body - affected by slow motion
            node.body.update(dt * scene.slowMotion.value)

            // calculate attraction force from current position to initial position
            let fx = (node.initialPosition.x - node.body.position.x) * 0.05
            let fy = (node.initialPosition.y - node.body.position.y) * 0.05

            // apply attraction force
            node.body.applyForce(fx, fy)

            // apply friction to velocity to stop moving
            node.body.velocity.multiply(node.body.friction)

        })
        // /space grid ***************************************



        // wave **********************************************
        scene.waveAnimation.play()
        scene.waveLabel.position.x = scene.waveAnimation.value * scene.width * 0.5 - scene.waveLabel.width * 0.5
        scene.waveLevelLabel.position.y = scene.waveAnimation.value * scene.height * 0.5 + scene.waveLabel.size * 0.5

        // destroyed last asteroid
        if (scene.asteroids.length == 0) {

            // play wave destroyed sound
            if (scene.wave > 1) {
                setTimeout(() => {
                    scene.sound.play(assets.sounds.waveDestroyed, 3)
                }, 1000)
            }

            // creates new wave
            scene.newWave()

        }
        // /wave *********************************************



        // update touch input
        if (MOBILE)
            scene.touch.update()

    },

    onDraw: (scene) => {

        // draw space grid
        scene.graphics.strokeStyle = scene.spaceGridColors[random(2, 0)]
        scene.graphics.lineWidth = 0.2
        for (let i = 0; i < scene.spaceGrid.length; i++) {

            let a = scene.spaceGrid[i]
            let b = scene.spaceGrid[i + 1]

            if ((i + 1) % scene.horizontal == 0) {
                a = scene.spaceGrid[i + scene.horizontal]
                b = scene.spaceGrid[i + scene.horizontal]
            }

            // horizontal lines
            if (b) {
                scene.graphics.moveTo(a.position.x, a.position.y)
                scene.graphics.lineTo(b.position.x, b.position.y)
            }

            // vertical lines
            b = scene.spaceGrid[i + 1 + scene.horizontal]

            if ((i + 1) % scene.horizontal != 0 && b) {
                scene.graphics.lineTo(b.position.x, b.position.y)
            }

        }
        scene.graphics.stroke()
        // render grid again. weird effect
        scene.graphics.strokeStyle = 'white'
        scene.graphics.lineWidth = 0.1
        for (let i = 0; i < scene.spaceGrid.length; i++) {

            let a = scene.spaceGrid[i]
            let b = scene.spaceGrid[i + 1]

            if ((i + 1) % scene.horizontal == 0) {
                a = scene.spaceGrid[i + scene.horizontal]
                b = scene.spaceGrid[i + scene.horizontal]
            }

            // horizontal lines
            if (b) {
                scene.graphics.moveTo(a.position.x + random(5), a.position.y + random(5))
                scene.graphics.lineTo(b.position.x + random(5), b.position.y + random(5))
            }

            // vertical lines
            b = scene.spaceGrid[i + 1 + scene.horizontal]

            if ((i + 1) % scene.horizontal != 0 && b) {
                scene.graphics.lineTo(b.position.x + random(5), b.position.y + random(5))
            }

        }
        scene.graphics.stroke()
        // draw space grid

        // draw explosion holes
        scene.explosionHoles.map((explosionHole) => explosionHole.draw(scene.graphics))

        // draw ship hole mask
        scene.ship.holeMask.draw(scene.graphics)

        // draw ship trails
        scene.ship.trails.map((trail) => trail.draw(scene.graphics))

        // draw ship bullets
        scene.ship.bullets.map((bullet) => bullet.draw(scene.graphics))

        // draw ship
        scene.ship.draw(scene.graphics)

        // draw particles
        scene.sparkParticles.map((particle) => particle.draw(scene.graphics))

        // draw asteroids
        scene.asteroids.map((asteroid) => asteroid.draw(scene.graphics))

        // draw flame particles
        scene.flameParticles.map((flame) => flame.draw(scene.graphics))

        // draw items
        scene.items.map((item) => {
            item.draw(scene.graphics)
            item.letter.draw(scene.graphics)
        })

        // draw wave label
        if (scene.waveAnimation.started) {
            scene.waveLabel.draw(scene.graphics)
            scene.waveLevelLabel.draw(scene.graphics)
        }

        // draw touch
        if (MOBILE)
            scene.touch.draw(scene.graphics)

        // draw partition grid
        if (scene.DEBUG) {
            scene.partitionSpace.draw(scene.graphics)
        }

    },

    onResize: (scene) => {

        // recreate space grid
        scene.createSpaceGrid()

        // update asteroids partition space
        scene.asteroidPartitionSpace = new SpatialSpace((scene.width / 120) | 0, (scene.width / 120) | 0)

        // update left stick area
        scene.touch.leftStick.area.center.update(scene.width * 0.25, scene.height * 0.5)
        scene.touch.leftStick.area.width = scene.width * 0.5
        scene.touch.leftStick.area.height = scene.height
        // update right stick area
        scene.touch.rightStick.area.center.update(scene.width * 0.75, scene.height * 0.5)
        scene.touch.rightStick.area.width = scene.width * 0.5
        scene.touch.rightStick.area.height = scene.height

        // update wave label start position
        scene.waveLabel.position.x = -DEVICE_CENTER_X - scene.waveLabel.width * 0.5
        scene.waveLabel.position.y = DEVICE_CENTER_Y - scene.waveLabel.size * 0.5
        // update wave level label start position
        scene.waveLevelLabel.position.x = DEVICE_CENTER_X - scene.waveLevelLabel.width * 0.5
        scene.waveLevelLabel.position.y = -scene.waveLabel.position.y + scene.waveLabel.size

    }

})

stage.addMovie(asteroid)
stage.play('asteroid')