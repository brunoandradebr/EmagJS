let flappyBird = new Movie('flappyBird')

flappyBird.addScene('main', {

    index: 1,

    fullscreen: true,

    onCreate: (scene) => {

        // collision handler
        scene.collision = new CollisionHandler()

        // sound handler
        scene.sound = new SoundFx()

        // set stage background
        stage.container.style.background = 'url(Assets/image/background.png) 0px ' + (DEVICE_HEIGHT - 64) + 'px / cover'

        // bird!
        scene.bird = new Sprite(new Vector(), 46, 32, 'transparent', 0)
        // bird initial position
        scene.bird.initialPosition = new Vector()
        // physic body
        scene.bird.body = new Body(scene.bird)
        scene.bird.body.gravity = new Vector(0, .6)
        scene.bird.body.jump = new Vector(0, -10)
        // collision mask
        scene.bird.collisionMask = new Circle(scene.bird.body.position, 18, 'transparent', 2)
        // bird sprite
        scene.birdSprite = new SpriteSheet(assets.images.bird, 92, 64)
        scene.bird.image = scene.birdSprite
        // bird animations
        scene.bird.addAnimation('died', [0], 1)
        scene.bird.addAnimation('fly', [0, 1, 2], Infinity)

        // bird input handler
        scene.bird.inputHandler = () => {

            switch (scene.state) {

                case 'TITLE':

                    // go to game state
                    scene.state = 'GAME'

                    // apply initial force
                    scene.bird.body.applyForce(scene.bird.body.jump)

                    // play wing sound
                    scene.sound.play(assets.sounds.sfx_wing)

                    break

                case 'GAME':

                    // reset y velocity
                    scene.bird.body.velocity.y = 0
                    // apply impulse force
                    scene.bird.body.applyForce(scene.bird.body.jump)
                    // play wing sound
                    scene.sound.play(assets.sounds.sfx_wing)

                    break

                case 'GAME_OVER':

                    // reset pipes initial position    
                    scene.resetPipes()
                    // reset bird state
                    scene.bird.resetState()
                    // go to title state
                    scene.state = 'TITLE'
                    // apply random background hue filter
                    stage.container.style.filter = 'hue-rotate(' + randomPick(0, 320) + 'deg)'
                    // reset score
                    scene.scoreLabel.resetState()

                    break

            }

        }

        // reset bird state
        scene.bird.resetState = () => {

            // reset bird initial position
            scene.bird.initialPosition.x = DEVICE_WIDTH * 0.30 | 0
            scene.bird.initialPosition.y = scene.height * 0.5
            // reset physic body velocity
            scene.bird.body.velocity.x = 0
            scene.bird.body.velocity.y = 0
            // reset physic body position
            scene.bird.body.position.x = scene.bird.initialPosition.x
            scene.bird.body.position.y = scene.bird.initialPosition.y
            // update bird position as well
            scene.bird.position.x = scene.bird.body.position.x
            scene.bird.position.y = scene.bird.body.position.y
            // reset bird rotation
            scene.bird.matrix.identity()
            scene.bird.matrix.rotateZ(0)

            // reset bird sprite
            scene.bird.image = scene.birdSprite.clone()
            // generate random rgb colors
            let r = random(255, 0)
            let g = random(255, 0)
            let b = random(255, 0)

            // replace bird sprite colors
            scene.bird.image.replaceColor([212, 191, 39], [r, g, b])
            scene.bird.image.replaceColor([228, 129, 22], [r - 100, g, b])

        }

        // touch input
        scene.canvas.addEventListener('touchend', (e) => {
            scene.bird.inputHandler()
        })

        // mouse input
        scene.canvas.addEventListener('click', (e) => {
            scene.bird.inputHandler()
        })

        // object move speed
        scene.objectSpeed = 4

        // create ground sprites
        scene.grounds = []
        scene.createGroundSprites = () => {

            // reset grounds container
            scene.grounds.length = 0

            // calculates number needed to fill the ground
            let nGround = Math.round(DEVICE_WIDTH / 18) + 2

            for (let i = 0; i < nGround; i++) {

                let ground = new Sprite(new Vector(i * 18, DEVICE_HEIGHT), 18, 64, 'transparent', 0)

                ground.anchor.x = 0
                ground.anchor.y = 1

                ground.image = new ImageProcessor(assets.images.ground)

                scene.grounds.push(ground)

            }

        }

        // pipes container
        scene.pipes = []
        // horizontal space between pipes
        scene.pipeHorizontalSpace = 130
        // vertical space between pipes
        scene.pipeVerticalSpace = 60
        // generate random pipes vertical space
        scene.randomHeight = (pipeTop, pipeBottom) => {
            // random height pick
            let randomHeight = randomPick(0.25, 0.3, 0.4, 0.5, 0.6, 0.65)
            // top pipe
            pipeTop.position.y = DEVICE_HEIGHT * (randomHeight - scene.pipeVerticalSpace / DEVICE_HEIGHT)
            pipeTop.collisionMask.position.x = pipeTop.position.x
            pipeTop.collisionMask.position.y = pipeTop.position.y - pipeTop.height * 0.5
            // bottom pipe
            pipeBottom.position.y = DEVICE_HEIGHT * (randomHeight + scene.pipeVerticalSpace / DEVICE_HEIGHT)
            pipeBottom.collisionMask.position.x = pipeBottom.position.x
            pipeBottom.collisionMask.position.y = pipeBottom.position.y + pipeBottom.height * 0.5
        }
        // reset initial pipes
        scene.resetPipes = () => {

            scene.pipes.length = 0

            // pipes start vector - outside screen
            scene.startPipesPosition = new Vector(DEVICE_WIDTH + scene.pipeHorizontalSpace, 0)

            // pipes needed to fill screen width
            let nPipes = ((DEVICE_WIDTH / (scene.pipeHorizontalSpace)) | 0) + 1

            for (let i = 0; i < nPipes; i += 2) {

                // horizontal pipe position
                let x = scene.startPipesPosition.x + (i * scene.pipeHorizontalSpace)

                // create top pipe
                let pipeTop = new Sprite(new Vector(x, 0), 93, 793, 'transparent', 0)
                pipeTop.anchor.y = 0
                pipeTop.image = new ImageProcessor(assets.images.pipe)
                pipeTop.matrix.scale(-1, 1)
                pipeTop.matrix.rotateZ(180)
                pipeTop.active = true
                // create bottom pipe
                let pipeBottom = new Sprite(new Vector(x, 0), 93, 793, 'transparent', 0)
                pipeBottom.anchor.y = 0
                pipeBottom.image = new ImageProcessor(assets.images.pipe)
                pipeBottom.active = true

                // create pipes collision mask
                pipeTop.collisionMask = new Shape(new Square, new Vector, pipeTop.width, pipeTop.height, 'rgba(255, 0, 0, 0.1)', 2)
                pipeBottom.collisionMask = new Shape(new Square, new Vector, pipeBottom.width, pipeBottom.height, 'rgba(255, 0, 0, 0.1)', 2)

                // generate random height
                scene.randomHeight(pipeTop, pipeBottom)

                scene.pipes.push(pipeBottom, pipeTop)

            }

        }

        // score label
        scene.scoreLabel = new Text('0', new Vector(DEVICE_WIDTH * 0.5, 64), 'font_fb', 'white', 36, 6)
        // reset score label
        scene.scoreLabel.resetState = () => {
            scene.scoreLabel.text = '0'
        }

        // interpolation to animate die feedback
        scene.interpolation = new Tween({ i: 1 })
        scene.interpolation.animate({ i: 1 }, 150, 0, 'cubicInOut')
        scene.interpolation.animate({ i: -1 }, 150, 150, 'cubicInOut')

        // game initial state
        scene.state = 'TITLE'

        scene.bird.resetState()
        scene.resetPipes()
        scene.createGroundSprites()

    },

    onLoop: (scene, dt, elapsedTime) => {

        switch (scene.state) {

            case 'TITLE':

                // set fly animation
                scene.bird.setAnimation('fly')

                // float bird
                scene.bird.body.position.y = scene.bird.initialPosition.y + Math.sin(elapsedTime * 0.006 * dt) * 8

                break;

            case 'GAME':

                // set fly animation
                scene.bird.setAnimation('fly')

                // update bird physic body
                scene.bird.body.update(dt)
                // apply gravity
                scene.bird.body.applyForce(scene.bird.body.gravity)
                // rotate bird based on bird y velocity
                scene.bird.matrix.identity()
                scene.bird.matrix.rotateZ(scene.bird.body.velocity.y * 3)

                // limit y velocity
                if (scene.bird.body.velocity.y > 12) scene.bird.body.velocity.y = 12

                // fix infinite sky - joaquim gonna cry :)
                if (scene.bird.body.position.y < -scene.bird.height)
                    scene.bird.body.position.y = -scene.bird.height

                // move pipe
                for (let i = 0; i < scene.pipes.length; i += 2) {

                    let pipeTop = scene.pipes[i + 1]
                    let pipeBottom = scene.pipes[i]

                    // move top pipe
                    pipeTop.position.x -= scene.objectSpeed * dt
                    pipeTop.collisionMask.position.x = pipeTop.position.x
                    // move bottom pipe
                    pipeBottom.position.x -= scene.objectSpeed * dt
                    pipeBottom.collisionMask.position.x = pipeBottom.position.x

                    // outside screen
                    if (pipeTop.position.x + pipeTop.width < 0) {

                        // send pipes to right most
                        pipeTop.position.x = scene.pipeHorizontalSpace + DEVICE_WIDTH
                        pipeBottom.position.x = scene.pipeHorizontalSpace + DEVICE_WIDTH

                        // create new random height
                        scene.randomHeight(pipeTop, pipeBottom)

                        // activate pipe to compute point again
                        pipeBottom.active = true

                    }

                    // scores a point
                    if (pipeBottom.position.x < scene.bird.body.position.x && pipeBottom.active) {

                        pipeBottom.active = false

                        // play point sound
                        scene.sound.play(assets.sounds.sfx_point)

                        // increment score
                        scene.scoreLabel.text = parseInt(scene.scoreLabel.text) + 1

                    }

                    // avoid pixel incorrection
                    pipeTop.position.x = Math.round(pipeTop.position.x)
                    pipeBottom.position.x = Math.round(pipeBottom.position.x)

                }

                // collides with pipes
                scene.pipes.map((pipe) => {

                    if (scene.collision.check(scene.bird.collisionMask, pipe.collisionMask)) {

                        scene.bird.body.velocity.y = 0

                        // play hit sound
                        scene.sound.play(assets.sounds.sfx_hit)
                        scene.sound.play(assets.sounds.sfx_die)

                        // enter game over state
                        scene.state = 'GAME_OVER_WITH_ANIMATION'

                        // interpolate animation
                        scene.interpolation.resetAnimations()

                    }

                })

                break;

            case 'GAME_OVER_WITH_ANIMATION':

                scene.interpolation.play()

                // update bird physic body
                scene.bird.body.update(dt)
                // apply gravity
                scene.bird.body.applyForce(scene.bird.body.gravity)
                // rotate bird based on bird y velocity
                scene.bird.matrix.identity()
                scene.bird.matrix.rotateZ(70 + scene.bird.body.velocity.y)

                stage.shake(150, 2)

                break;

            case 'GAME_OVER':

                scene.interpolation.play()

                // set died animation
                scene.bird.setAnimation('died')

                break;
        }

        // collides with floor
        if (scene.state != 'GAME_OVER') {

            if (scene.bird.body.position.y + scene.bird.collisionMask.radius > DEVICE_HEIGHT - 65) {

                scene.bird.body.position.y = DEVICE_HEIGHT - 65 - scene.bird.collisionMask.radius + 3

                // play hit sound
                if (scene.state != 'GAME_OVER_WITH_ANIMATION')
                    scene.sound.play(assets.sounds.sfx_hit)

                // enter game over state
                scene.state = 'GAME_OVER'

            }

        }

        // move ground
        if (scene.state != 'GAME_OVER' && scene.state != 'GAME_OVER_WITH_ANIMATION') {

            scene.grounds.map((ground) => {

                ground.position.x -= scene.objectSpeed * dt

                if (ground.position.x + ground.width < 0)
                    ground.position.x = DEVICE_WIDTH

                ground.position.x = Math.round(ground.position.x)

            })

        }

        // center score label
        scene.scoreLabel.position.x = DEVICE_WIDTH * 0.5 - scene.scoreLabel.width * 0.5

        // die feedback animation
        if (scene.interpolation.value)
            stage.container.style.filter = 'brightness(' + scene.interpolation.value + ')'

        scene.bird.position.update(scene.bird.body.position)

    },

    onDraw: (scene) => {

        // render pipes
        scene.pipes.map((pipe) => pipe.draw(scene.graphics))

        // render bird
        scene.bird.draw(scene.graphics)

        // render grounds
        scene.grounds.map((ground) => ground.draw(scene.graphics))

        // draw score label
        scene.scoreLabel.draw(scene.graphics)

    },

    onResize: (scene) => {

        // reset stage background position
        stage.container.style.backgroundPositionY = DEVICE_HEIGHT - 60 + 'px'

        // reset game objects state
        scene.bird.resetState()
        scene.resetPipes()
        scene.createGroundSprites()
        scene.scoreLabel.resetState()

    }

})

stage.addMovie(flappyBird)
stage.play('flappyBird')