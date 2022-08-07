let cloth = new Movie('cloth')

cloth.addScene('main', {

    index: 1,

    fullscreen: true,

    backgroundColor: '#242528',

    onCreate: (scene) => {

        // collision handler
        scene.collision = new CollisionHandler()

        // input handler
        scene.input = new Input(new Keyboard, new Touch(scene))
        scene.input.touch.removeButton('A', 'B', 'C', 'LEFT', 'RIGHT')
        scene.input.touch.buttons['D'].lineColor = 'white'

        // inverse kinematic
        scene.ik = new IK()

        // create nodes
        scene.ik.createNodes()
        // gravity vector
        scene.ik.gravity = new Vector(0, .4)

        // function to create cloth structure
        scene.createCloth = () => {

            // reset nodes before create
            scene.ik.nodes.length = 0

            // column based on scene width
            scene.column = scene.width / 30 | 0
            scene.column = scene.column < 13 ? scene.column : 13

            // nodes needed to create a grid
            scene.ik.createNodes(scene.column * scene.column)

            scene.ik.nodes.map((node) => node.radius = 2)

            // space between nodes
            let space = 20
            // grid center
            let center = new Vector(scene.width * 0.5 - scene.column * space * 0.5, 0)

            let y = 0

            // positionate nodes - 2d grid
            scene.ik.nodes.map((node, i) => {

                let x = i % scene.column

                if (i % scene.column == 0) y++

                if (i < scene.column)

                    if (i == 0 || i == scene.column - 1)
                        scene.ik.fix(i)

                scene.ik.updateNode(i, center.x + (x * space), center.y + (y * space))

            })

            // reset connections before create
            scene.ik.connections.length = 0

            // create connections
            scene.ik.nodes.map((node, i) => {

                // horizontal connection
                if ((i + 1) % scene.column != 0) {
                    if (scene.ik.nodes[i + 1])
                        scene.ik.connect(i, i + 1)
                }

                // vertical connection
                if (scene.ik.nodes[i + scene.column])
                    scene.ik.connect(i, i + scene.column)

            })

        }

        // create cloth
        scene.createCloth()

        // apply initial random force
        scene.ik.applyForce(Vector.fromAngle(random(360, 0), 50), scene.ik.nodes.length - 1)

        // circle that follows mouse
        scene.pointer = new Circle(mouse, 10, 'transparent', 1)

        // current grabbed node
        scene.currentNode = null

    },

    onLoop: (scene, dt, elapsedTime) => {

        // enter debug mode
        if (scene.input.pressed('D'))
            scene.ik.debug = !scene.ik.debug

        // update and solve ik
        scene.ik.update(dt)
        // apply gravity
        scene.ik.applyForce(scene.ik.gravity)

        // grap a node
        if (mousedown || touches.length) {
            if (scene.currentNode == null) {
                scene.ik.nodes.map((node) => {
                    if (scene.collision.check(scene.pointer, node))
                        scene.currentNode = node
                })
            }
        } else {
            scene.currentNode = null
        }

        // move node with mouse
        if (scene.currentNode) {
            scene.currentNode.body.velocity.update(0, 0)
            scene.currentNode.body.position.update(mouse.x, mouse.y)
        }

        // update touch input
        if (MOBILE)
            scene.input.touch.update()

    },

    onDraw: (scene) => {

        let angleColor = 225

        // draw ik
        scene.ik.nodes.map((node, i) => {

            scene.graphics.beginPath()

            if (scene.ik.nodes[i + scene.column]) {

                let a1 = scene.ik.nodes[i]
                let b1 = scene.ik.nodes[i + 1]
                let a2 = scene.ik.nodes[i]
                let b2 = scene.ik.nodes[i + scene.column]

                let vector1 = b1.body.position.clone().subtract(a1.body.position).normalize
                let vector2 = b2.body.position.clone().subtract(a2.body.position).normalize

                let colorFactor = vector2.cross(vector1).z + i * 0.004

                scene.graphics.fillStyle = 'hsl(' + angleColor + ', 100%, ' + (30 + (20 * -colorFactor)) + '%)'

            }

            if ((i + 1) % scene.column != 0) {
                if (scene.ik.nodes[i + 1]) {

                    let a = scene.ik.nodes[i]
                    let b = scene.ik.nodes[i + 1]

                    scene.graphics.moveTo(a.body.position.x, a.body.position.y)
                    scene.graphics.lineTo(b.body.position.x, b.body.position.y)

                }
            }

            if ((i + 1) % scene.column != 0) {
                if (scene.ik.nodes[i + scene.column]) {

                    let b = scene.ik.nodes[i + scene.column + 1]
                    scene.graphics.lineTo(b.body.position.x, b.body.position.y)

                }
            }

            if ((i + 1) % scene.column != 0) {

                if (scene.ik.nodes[i + scene.column + 1]) {
                    let b = scene.ik.nodes[i + scene.column]
                    scene.graphics.lineTo(b.body.position.x, b.body.position.y)
                }

            }

            scene.graphics.closePath()

            scene.graphics.fill()

        })

        // debug mode
        if (scene.ik.debug)
            scene.ik.draw(scene.graphics)

        // draw mobile touch
        if (MOBILE)
            scene.input.touch.draw(scene.graphics)

    },

    onResize: (scene) => {

        scene.createCloth()

        scene.input.touch.updatePositions()

    }

})

stage.addMovie(cloth)

stage.play('cloth')