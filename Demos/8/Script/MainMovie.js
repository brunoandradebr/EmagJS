let pathfinding = new Movie('pathfinding')

pathfinding.addScene('main', {

    backgroundColor: 'rgba(0, 0, 0, 0.9)',

    fullscreen: true,

    onCreate: (scene) => {

        scene.DEBUG = false

        scene.framerate = new FrameRate()

        scene.input = new Input(new Keyboard)

        scene.collision = new CollisionHandler()

        scene.pathfinding = new Pathfinding()

        scene.startSimulation = () => {

            scene.target = new Circle(new Vector, 5, 'transparent', 1, 'cyan')

            scene.walls = []
            scene.walls[0] = new Shape(new Square, new Vector(DEVICE_CENTER_X, 10), DEVICE_WIDTH, 20, 'rgba(0, 0, 0, 0.8)', 0)
            scene.walls[1] = new Shape(new Square, new Vector(10, DEVICE_CENTER_Y), 20, DEVICE_HEIGHT, 'rgba(0, 0, 0, 0.8)', 0)
            scene.walls[2] = new Shape(new Square, new Vector(DEVICE_CENTER_X, DEVICE_HEIGHT - 10), DEVICE_WIDTH, 20, 'rgba(0, 0, 0, 0.8)', 0)
            scene.walls[3] = new Shape(new Square, new Vector(DEVICE_WIDTH - 10, DEVICE_CENTER_Y), 20, DEVICE_HEIGHT, 'rgba(0, 0, 0, 0.8)', 0)
            scene.walls[4] = new Shape(new Square, new Vector(DEVICE_CENTER_X, (DEVICE_HEIGHT * 0.5) * 0.5), 20, DEVICE_HEIGHT * 0.5, 'rgba(0, 0, 0, 0.8)', 0)
            scene.walls[5] = new Shape(new Square, new Vector(DEVICE_CENTER_X, DEVICE_HEIGHT - 50), 20, DEVICE_HEIGHT * 0.3, 'rgba(0, 0, 0, 0.8)', 0)
            scene.walls[6] = new Shape(new Square, new Vector(DEVICE_CENTER_X - DEVICE_WIDTH * 0.3, (DEVICE_HEIGHT * 0.5) * 0.5), 20, DEVICE_HEIGHT * 0.5, 'rgba(0, 0, 0, 0.8)', 0)
            scene.walls[7] = new Shape(new Square, new Vector(DEVICE_CENTER_X + DEVICE_WIDTH * 0.3, (DEVICE_HEIGHT * 0.5) * 0.5), 20, DEVICE_HEIGHT * 0.5, 'rgba(0, 0, 0, 0.8)', 0)

            if (!MOBILE) {
                scene.walls[8] = new Shape(new Square, new Vector(20, (DEVICE_HEIGHT * 0.5) * 0.5), 200, 20, 'rgba(0, 0, 0, 0.8)', 0)
                scene.walls[9] = new Shape(new Square, new Vector(DEVICE_WIDTH - 200, (DEVICE_HEIGHT * 0.5) * 0.5), 200, 20, 'rgba(0, 0, 0, 0.8)', 0)
                scene.walls[10] = new Shape(new Square, new Vector(20, (DEVICE_HEIGHT * 0.5) * 1.3), 200, 20, 'rgba(0, 0, 0, 0.8)', 0)
            }

            scene.graph = new Graph()
            scene.graph.fromPolygon(scene.walls, 40)

            const center = new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y)

            if (MOBILE) {
                center.x = 100
                center.y = 200
            }

            scene.unities = []
            for (let i = 0; i < 1; i++) {
                const unit = new Unit(new Vector(center.x + random(100), center.y + random(100)), 20, 20)
                unit.id = 'unit_' + i
                unit.fov.addPolygon(scene.walls)
                scene.unities.push(unit)
                scene.graph.addNode(unit.body.position, unit.id)
            }

            scene.graph.addNode(mouse.clone(), 'end')

            scene.light = new VisibilityPolygon(scene.unities[0].position)
            scene.light.fillColor = 'rgba(255, 255, 255, 0.1)'
            scene.light.shadowColor = 'rgba(0, 0, 0, 0.2)'
            scene.light.addPolygon(scene.walls)
            scene.light.castRays()

        }

        scene.startSimulation()

        scene.updateEndNode = (event) => {
            scene.graph.updateNode('end', mouse)
            if (event.touches && event.touches.length > 1) scene.DEBUG = !scene.DEBUG
        }

        scene.findPath = () => {

            scene.target.position.update(scene.graph.getNode('end').position)

            scene.unities.map((unit) => {
                scene.graph.polygons.map((wall) => {
                    if (scene.collision.check(unit.collider, wall)) {
                        unit.body.position.update(scene.collision.points[0].add(scene.collision.mtv.multiplyScalar(0.5)))
                    }
                })
            })
            scene.unities.map((unit) => {
                scene.graph.updateNode(unit.id)
            })
            scene.unities.map((unit) => {
                unit.path = scene.pathfinding.search(scene.graph, unit.id, 'end')
            })
            scene.unities.map((unit) => {
                unit.move()
            })
        }

        window.addEventListener('mousemove', (e) => scene.updateEndNode(e))
        window.addEventListener('touchmove', (e) => scene.updateEndNode(e), { passive: false })
        window.addEventListener('touchstart', (e) => scene.updateEndNode(e), { passive: false })

        window.addEventListener('click', (e) => scene.findPath())
        window.addEventListener('touchend', (e) => scene.findPath())

    },

    onLoop: (scene, dt, elapsedTime) => {

        scene.light.castRays()

        if (scene.input.pressed('D')) scene.DEBUG = !scene.DEBUG

        scene.unities.map((unit, index) => {
            unit.update(dt)
            unit.avoid(index, scene.unities)
            unit.debug = scene.DEBUG
        })

        scene.unities.map((unit) => {
            scene.walls.map((wall) => {
                if (scene.collision.check(unit.collider, wall)) {
                    unit.body.position.add(scene.collision.mtv)
                    unit.body.velocity.add(scene.collision.mtv)
                }
            })
        })

    },

    onDraw: (scene) => {

        scene.light.draw(scene.graphics)

        scene.walls.map((wall) => wall.draw(scene.graphics))

        if (scene.DEBUG)
            scene.graph.draw(scene.graphics)

        scene.framerate.draw(scene.graphics)

        scene.unities.map(unit => unit.draw(scene.graphics))

        scene.target.draw(scene.graphics)

    },

    onResize: (scene) => {
        scene.startSimulation()
    }

})

stage.addMovie(pathfinding)
stage.play('pathfinding')