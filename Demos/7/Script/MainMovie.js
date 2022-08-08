let experiment = new Movie('experiment')

experiment.addScene('main', {

    fullscreen: true,

    backgroundColor: '#2c2956',

    onCreate: (scene) => {

        // collision handler
        scene.collision = new CollisionHandler()

        // input handler
        scene.input = new Input(new Keyboard)

        // method that generates random anchor points
        scene.createRandomPoints = (space = 100) => {

            scene.anchorPoints.length = 0

            scene.center = new Vector(0, scene.height * 0.5)

            let nPoints = ((scene.width / space) | 0) + 1

            for (let i = 0; i < nPoints; i++) {

                let x = scene.center.x + i * space
                let y = scene.center.y + random(100)
                let p = new Vector(x, y)

                scene.anchorPoints.push(p)

            }

            scene.curve.update()

        }

        // anchor points array
        scene.anchorPoints = []

        // chaikin
        scene.curve = new Chaikin(scene.anchorPoints)

        // generates random points
        scene.createRandomPoints()

        // fake touch to drag anchors
        scene.touch = new Circle(mouse, 20, 'rgba(255, 255, 255, 0.5)', 0)

        // dragging anchor
        scene.currentAnchor = null

        // decrease button
        scene.subButton = new Button(scene)
        scene.subButton.lineColor = 'white'
        scene.subButton.position.update(48, 70)
        scene.subLabel = new Text('<', new Vector(40, 80), 'unknown', 'white', 36)
        // increase button
        scene.addButton = new Button(scene)
        scene.addButton.lineColor = 'white'
        scene.addButton.position.update(108, 70)
        scene.addLabel = new Text('>', new Vector(100, 80), 'unknown', 'white', 36)
        // debug button
        scene.debugButton = new Button(scene)
        scene.debugButton.lineColor = 'white'
        scene.debugButton.width = 70
        scene.debugButton.height = 30
        scene.debugButton.position.update(scene.width - 60, 70)
        scene.debugButtonLabel = new Text('on', new Vector(scene.width - 75, 75), 'unknown', 'lightblue', 18)
        // ui label
        scene.uiLabel = new Text('Curve quality', new Vector(20, 30), 'unknown', 'white', 18)
        scene.qualityLabel = new Text('4', new Vector(155, 32), 'unknown', 'orange', 21)
        scene.debugLabel = new Text('debug', new Vector(scene.width - 90, 35), 'unknown', 'white', 18)

    },

    onLoop: (scene, dt) => {

        // enter debug
        if (scene.debugButton.pressed) {
            scene.curve.debug = !scene.curve.debug
            scene.debugButtonLabel.text = scene.curve.debug ? 'on' : 'off'
        }

        // increase quality
        if (scene.subButton.pressed) {
            scene.curve.quality -= scene.curve.quality > 0 ? 1 : 0
            scene.curve.update()
            scene.qualityLabel.text = scene.curve.quality
        }
        // decrease quality
        if (scene.addButton.pressed) {
            scene.curve.quality += scene.curve.quality < 4 ? 1 : 0
            scene.curve.update()
            scene.qualityLabel.text = scene.curve.quality
        }

        // drag anchor
        if ((mousedown || touches.length) && scene.currentAnchor) {
            if (scene.curve.debug) {
                scene.currentAnchor.update(mouse)
                scene.curve.update()
            }
        } else {
            scene.currentAnchor = null
        }

        // hide fake touch
        if (!mousedown && !touches.length)
            scene.touch.position.update(-100, -100)

        // update drag anchor
        if (!scene.currentAnchor) {
            scene.curve.referencePoints.map((point, i) => {
                if (scene.collision.check(point, scene.touch)) {
                    scene.currentAnchor = point
                }
            })
        }

        // update buttons
        if (!scene.currentAnchor) {
            scene.subButton.update()
            scene.addButton.update()
            scene.debugButton.update()
        }

    },

    onDraw: (scene) => {

        // draw curve
        scene.curve.draw(scene.graphics)

        // draw buttons
        scene.subButton.draw(scene.graphics)
        scene.subLabel.draw(scene.graphics)
        scene.addButton.draw(scene.graphics)
        scene.addLabel.draw(scene.graphics)
        scene.debugButton.draw(scene.graphics)
        scene.debugButtonLabel.color = scene.curve.debug ? 'lightblue' : '#f46'
        scene.debugButtonLabel.draw(scene.graphics)

        // draw ui labels
        scene.uiLabel.draw(scene.graphics)
        scene.qualityLabel.draw(scene.graphics)
        scene.debugLabel.draw(scene.graphics)

    },

    onResize: (scene) => {

        scene.createRandomPoints()

        scene.debugButton.position.update(scene.width - 60, 70)
        scene.debugButtonLabel.position.update(scene.width - 75, 75)
        scene.debugLabel.position.update(scene.width - 90, 35)

    }

})

stage.addMovie(experiment)
stage.play('experiment')