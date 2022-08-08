let untangle = new Movie('untangle')

untangle.addScene('main', {

    fullscreen: true,

    backgroundColor: 'rgba(81, 217, 253, 0.79)',

    onCreate: (scene) => {

        // global muted flag
        scene.muted = false

        // collision handler
        scene.collision = new CollisionHandler()

        // sound
        scene.sound = new SoundFx()

        // play theme music
        if (!scene.muted)
            scene.sound.play(assets.sounds.music, 1, 'music', true)

        // scene padding offset
        scene.offset = {
            x: scene.width * 0.10,
            y: scene.height * 0.10
        }

        // help function to create random position vector
        scene.randomPosition = () => randomInArea(scene.offset.x, scene.offset.y, scene.width - 2 * scene.offset.x, scene.height - 2 * scene.offset.y)

        // create knobs
        scene.knobs = []
        for (let i = 0; i < 8; i++) {

            // create knob
            let knob = new Circle(scene.randomPosition(), 15, 'white', 0)
            // knob position and initial position
            knob.initialPosition = knob.position.clone()
            // knob physic body
            knob.body = new Body(knob)
            knob.body.gravity = new Vector(0, .4)
            // knob appearance
            knob.shadowBlur = 0
            knob.shadowColor = 'rgba(0, 0, 0, 0.1)'

            // drop animation
            knob.interpolation = { i: 0 }
            knob.dropAnimation = new Tween(knob.interpolation)
            knob.dropAnimation.animate({ i: 1 }, 1500, 0, 'elasticOut')

            scene.knobs.push(knob)

        }

        // create lines
        scene.lines = []
        for (let i = 0; i < scene.knobs.length; i++) {
            for (let j = i + 1; j < scene.knobs.length; j++) {

                let a = scene.knobs[i]
                let b = scene.knobs[j]

                let line = new Line(new Vector, new Vector)
                line.start = a.position
                line.end = b.position
                line.lineCap = 'round'
                line.lineColor = line.initialColor = 'white'
                line.lineWidth = line.initialLineWidth = 4
                line.shadowBlur = 0
                line.shadowOffsetX = 10
                line.dashPattern = [10]
                line.shadowColor = 'rgba(0, 0, 0, 0.05)'
                line.offsetSpeed = 0

                scene.lines.push(line)

            }
        }

        // remove crossed lines
        for (let i = 0; i < scene.lines.length; i++) {
            for (let j = i + 1; j < scene.lines.length; j++) {
                let a = scene.lines[i]
                let b = scene.lines[j]
                if (scene.collision.check(a, b)) {
                    //scene.lines.splice(i, 1)
                    scene.lines.splice(j, 1)
                }
            }
        }

        // for some reason, first knob is connecting with all other knobs...
        // force removing first line to avoid non solution
        scene.lines.splice(0, 1)

        // intersections text indicator
        let fontSize = 40
        scene.intersectionLabel = new Text('', new Vector(fontSize * 0.2, fontSize), 'unknown', '#f46', fontSize)
        scene.intersectionLabel.lineWidth = 5
        scene.intersectionLabel.shadowBlur = 0
        scene.intersectionLabel.shadowOffsetX = 0
        scene.intersectionLabel.shadowColor = 'rgba(0, 0, 0, 0.3)'

        // mouse grab radius
        scene.mouseGrabRadius = new Circle(mouse, 10, 'rgba(0, 0, 0, 0.2)', 0)

        // current picked knob
        scene.pickedKnob = null

        // touch end event
        scene.canvas.addEventListener('touchend', (e) => {
            if (scene.pickedKnob) scene.sound.play(assets.sounds.pling1, 1)
        })
        // mouse up event
        scene.canvas.addEventListener('mouseup', (e) => {
            if (scene.pickedKnob) scene.sound.play(assets.sounds.pling1, 1)
        })

        // start level animation timer
        scene.startDurationTimer = new Timer(750)
        // win level animation timer
        scene.winDurationTimer = new Timer(3000)

        // FSM
        scene.state = 'WIN_LEVEL_ANIMATION'

    },

    onLoop: (scene, dt) => {

        // start animation animation timer
        scene.startDurationTimer.start
        // start animation animation timer
        scene.winDurationTimer.start

        // FSM
        switch (scene.state) {

            // create level state
            case 'CREATE_LEVEL':

                // tangle knobs again
                scene.knobs.map((knob) => {
                    knob.initialPosition.update(scene.randomPosition())
                })

                // reset start level timer
                scene.startDurationTimer.reset

                // enter start level animation
                scene.state = 'CREATE_LEVEL_ANIMATION'

                break
            // /create level state


            // creation level animation
            case 'CREATE_LEVEL_ANIMATION':

                // move knobs to it's level initial position
                scene.knobs.map((knob) => {

                    // update knob physic body
                    knob.body.update(dt)
                    // distance from current position to new position
                    let distance = knob.body.position.clone().subtract(knob.initialPosition)
                    // interpolate knob position
                    knob.body.position.subtract(distance.multiplyScalar(0.1))

                })

                // animation completed
                if (scene.startDurationTimer.tick)
                    scene.state = 'PLAY'

                break
            // /create level animation state

            // play state
            case 'PLAY':

                // reset line state
                scene.lines.map((line) => {
                    // fade in
                    line.alpha += .02
                    if (line.alpha > 1) line.alpha = 1
                    // reset intersect flag
                    line.intersect = false
                    // reset line color
                    line.lineColor = line.initialColor
                    // reset line width
                    line.lineWidth = line.initialLineWidth
                })

                // total intersections 
                scene.totalIntersections = 0

                // check if lines are intersecting
                for (let i = 0; i < scene.lines.length; i++) {
                    for (let j = i + 1; j < scene.lines.length; j++) {

                        // line a and b
                        let a = scene.lines[i]
                        let b = scene.lines[j]

                        // if there are lines intersecting
                        if (scene.collision.check(a, b)) {
                            a.intersect = true
                            b.intersect = true
                            scene.totalIntersections++
                        }

                    }
                }

                // update intersection label text
                scene.intersectionLabel.text = scene.totalIntersections ? scene.totalIntersections : ':)'

                // ant march effect!
                scene.lines.map((line) => {

                    line.offsetSpeed += .8

                    // if lines are intersecting
                    if (line.intersect) {
                        // zigzag effect
                        line.dashOffset = Math.cos(Math.sin(line.offsetSpeed * 0.1)) * 15
                    } else {
                        // ant march effect
                        line.dashOffset = line.offsetSpeed
                    }

                })

                // if there is no grabed knob yet
                if (!scene.pickedKnob) {
                    // for each knob
                    scene.knobs.map((knob) => {
                        // if mouse grab radius touches knob
                        if (scene.collision.check(scene.mouseGrabRadius, knob)) {
                            // update picked knob
                            scene.pickedKnob = knob
                        }
                    })
                }

                // mousedown or touching
                if (mousedown || touches.length) {

                    // if knob is picked
                    if (scene.pickedKnob) {
                        // update run drop animation flag
                        scene.pickedKnob.runDropAnimation = false
                        // fixes picked radius
                        scene.pickedKnob.radius = 18
                        // reset drop animation
                        scene.pickedKnob.dropAnimation.resetAnimations()
                        // update knob physic position
                        scene.pickedKnob.body.position.update(mouse)
                        // update knob position based on it's physic position
                        scene.pickedKnob.position.update(scene.pickedKnob.body.position)
                    }

                } else {
                    // mouse up , no touch

                    // dropped knob update drop animation flag
                    if (scene.pickedKnob && scene.pickedKnob.runDropAnimation == false)
                        scene.pickedKnob.runDropAnimation = true

                    // clear picked knob
                    scene.pickedKnob = null

                    // cleared level
                    if (scene.totalIntersections == 0) {

                        // reset win animation duration timer
                        scene.winDurationTimer.reset

                        // explode knobs!
                        scene.knobs.map((knob) => {
                            // random impulse
                            knob.body.velocity.update(random(8), -10 - random(8, 0))
                        })

                        // play win sound
                        if (!scene.muted) {
                            scene.sound.play(assets.sounds.pulse)
                            scene.sound.play(assets.sounds.explosion)
                        }

                        // win level animation
                        scene.state = 'WIN_LEVEL_ANIMATION'
                    }

                }

                break
            // /play state

            // win level animation state
            case 'WIN_LEVEL_ANIMATION':

                // fade out lines
                scene.lines.map((line) => {
                    line.alpha -= .08
                    if (line.alpha < 0) line.alpha = 0
                })

                // all knobs falls apart
                scene.knobs.map((knob) => {

                    // update knob physic body
                    knob.body.update(dt)
                    // apply gravity
                    knob.body.applyForce(knob.body.gravity)

                })

                // animation completed
                if (scene.winDurationTimer.tick)
                    scene.state = 'CREATE_LEVEL'

                break
            // /win level animation state

        }

        // test knob with knob collision
        for (let i = 0; i < scene.knobs.length; i++) {
            for (let j = i + 1; j < scene.knobs.length; j++) {

                let a = scene.knobs[i]
                let b = scene.knobs[j]

                // check collision
                if (scene.collision.check(a, b)) {

                    // relative velocity on collision normal
                    let velR = a.body.velocity.clone().subtract(b.body.velocity).dot(scene.collision.normal)

                    // if knobs will collide
                    if (velR > 0) {

                        // bounce knob A
                        a.body.position.add(scene.collision.mtv)
                        a.body.velocity.add(scene.collision.mtv)
                        // bounce knob B
                        b.body.position.subtract(scene.collision.mtv)
                        b.body.velocity.subtract(scene.collision.mtv)

                        // with colliding and inside win animation
                        if (scene.state == 'WIN_LEVEL_ANIMATION') {
                            // play drop animation to fake an impact
                            a.runDropAnimation = true
                            a.dropAnimation.resetAnimations()
                            scene.sound.play(assets.sounds.pling1, 1, 'sound')
                        }

                    }
                }

            }
        }

        // for each knob
        scene.knobs.map((knob) => {

            // play drop animation
            if (knob.runDropAnimation == true) {

                // play animation
                knob.dropAnimation.play()

                // animate knob radius
                knob.radius = 30 - knob.dropAnimation.value * 15

            }

            // limit knob on screen boundary
            scene.collision.check(knob, 'screen', { x: scene.offset.x, y: scene.offset.y })

        })

    },

    onDraw: (scene) => {

        // draw lines
        scene.lines.map((line) => {

            // change color if intersecting
            if (line.intersect)
                line.lineColor = '#f46'

            // draw line
            line.draw(scene.graphics)

        })

        // draw knobs
        scene.knobs.map((knob) => knob.draw(scene.graphics))

        // draw intersection label
        scene.intersectionLabel.draw(scene.graphics)

    },

})

stage.addMovie(untangle)

stage.play('untangle')