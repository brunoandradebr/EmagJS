let experiment = new Movie('experiment')

experiment.addScene('main', {

    fullscreen: true,

    onCreate: (scene) => {

        stage.container.style.background = 'url(Assets/wood.jpg) center center /cover'

        // collision handler
        scene.collision = new CollisionHandler()

        // sound
        scene.sound = new SoundFx()

        // shape pool
        scene.shapeRespawnTimer = new Timer(1000)
        scene.shape = new ObjectPool(() => {
            let shape = new Shape(new Square, new Vector(random(DEVICE_WIDTH, 0), DEVICE_HEIGHT), 70, 70, 'rgba(0, 0, 0, 0.3)', 1, 'hsl(' + random(360, 0) + ', 100%, 50%)')
            shape.body = new Body(shape)
            shape.body.gravity = new Vector(0, .3)
            return shape
        }, (shape) => {
            let limitY = DEVICE_HEIGHT <= 600 ? DEVICE_HEIGHT * .8 : DEVICE_HEIGHT * 0.5
            shape.body.velocity.update(shape.position.x < DEVICE_WIDTH * 0.5 ? random(5, 0) : -random(5, 0), -randomPick(limitY * .04, limitY * 0.034))
            return shape
        })

        // polygon
        scene.polygons = [scene.shape.create()]

        // lines to cut shapes
        scene.lines = []
        scene.lines.push()

        // sliced pieces
        scene.pieces = []

        // slice points
        scene.points = []
        scene.pointsTimer = new Timer(30)

        // slice style
        scene.sliceLineColor = 'cyan'
        scene.sliceColor = 'white'

    },

    onLoop: (scene, dt) => {

        // trail effect
        scene.pointsTimer.start
        if (mousedown || touches.length) {

            if (scene.points.length < 8)
                scene.points.push(mouse.clone())

        }
        if (scene.pointsTimer.tick)
            scene.points.splice(0, 1)

        // create trail lines
        scene.lines.length = 0
        for (let i = 0; i < scene.points.length; i++) {

            if (!scene.points[i + 3]) continue

            let p1 = scene.points[i]
            let p2 = scene.points[i + 3]

            let line = new Line(p1, p2)

            scene.lines.push(line)

        }

        // start shape respawn timer
        scene.shapeRespawnTimer.start
        // create new shape
        if (scene.shapeRespawnTimer.tick) {

            scene.polygons.push(scene.shape.create())

            if (random(10, 0) > 7) {
                scene.sliceLineColor = 'red'
                scene.sliceColor = '#f46'
            } else {
                scene.sliceLineColor = 'cyan'
                scene.sliceColor = 'white'
            }

        }

        // update polygons
        scene.polygons.map((polygon) => {
            if (!polygon.newPiece) {
                polygon.body.update(dt)
                polygon.body.applyForce(polygon.body.gravity)
                polygon.body.angle++
                polygon.rotateZ(polygon.body.angle)
                polygon.transform()
            }
        })

        // slice shapes
        scene.lines.map((line) => {

            let pieces = scene.collision.sliceShape(line, scene.polygons)

            if (pieces) {

                scene.sound.play(assets.sounds.hit)

                pieces.map((piece) => {

                    piece.body = new Body(piece)
                    piece.body.velocity.update(piece.originalShape.body.velocity.x * .5, piece.originalShape.body.velocity.y * .5)
                    piece.body.gravity = new Vector(0, .2)

                })

                scene.pieces.push(...pieces)
            }

        })

        // update shape pieces
        for (let i = scene.pieces.length - 1; i >= 0; i--) {

            let piece = scene.pieces[i]

            piece.body.update(dt)
            piece.body.applyForce(piece.body.gravity)

            if (piece.leftSide) {
                piece.body.angle--
                piece.rotateZ(piece.body.angle)
                piece.transform()
            } else if (piece.rightSide) {
                piece.body.angle++
                piece.rotateZ(piece.body.angle)
                piece.transform()
            }

        }

        // remove pieces and shapes
        for (let i = scene.polygons.length - 1; i >= 0; i--) {

            let polygon = scene.polygons[i]

            if (polygon.body.velocity.y > 0) {
                if (polygon.body.position.x - polygon.width * 0.5 > scene.width ||
                    polygon.body.position.x + polygon.width * 0.5 < 0 ||
                    polygon.body.position.y - polygon.height * 0.5 > scene.height) {
                    scene.polygons.splice(i, 1)
                }
            }

            if (polygon.sliced)
                scene.polygons.splice(i, 1)

        }

    },

    onDraw: (scene) => {

        // draw shapes
        scene.polygons.map((polygon) => {
            polygon.draw(scene.graphics)
        })

        // draw pieces
        scene.pieces.map((piece) => {
            piece.draw(scene.graphics)
        })

        // draw slice effect
        scene.graphics.shadowBlur = 5
        scene.graphics.shadowColor = scene.sliceLineColor
        scene.graphics.strokeStyle = scene.sliceColor
        scene.graphics.globalCompositeOperation = 'lighter'
        for (let i = 0; i < scene.points.length; i++) {

            if (!scene.points[i + 1]) continue

            let p1 = scene.points[i]
            let p2 = scene.points[i + 1]

            scene.graphics.beginPath()
            scene.graphics.lineWidth = i * 2
            scene.graphics.moveTo(p1.x, p1.y)
            scene.graphics.lineTo(p2.x, p2.y)
            scene.graphics.stroke()

        }

    }

})

stage.addMovie(experiment)
stage.play('experiment')