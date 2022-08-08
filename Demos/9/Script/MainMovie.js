let raycasting = new Movie('raycasting')

const resolution = {
    width: 320,
    height: 200
}

raycasting.addScene('map', {

    index: 1,

    fullscreen: true,

    onCreate: (scene) => {

        scene.framerate = new FrameRate()

        scene.mainScene = raycasting.scenes['main']

        scene.transform = new Matrix()
        scene.transform.scale(0.1, 0.1)
        scene.transform.translate(DEVICE_CENTER_X + (100 / 0.1), DEVICE_CENTER_Y + (100 / 0.1))
        scene.transform.rotateX(60)
        scene.transform.rotateZ(45)

        scene.aim = new Circle(new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y), 2, 'black', 0)

    },

    onLoop: (scene) => {

        scene.mainScene.agent.radius = 20
        scene.mainScene.agent.sov.lineWidth = 5
        scene.mainScene.agent.sov.lineColor = 'red'

    },

    onDraw: (scene) => {

        scene.graphics.save()
        const m = scene.transform.m
        scene.graphics.transform(m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1])

        if (scene.mainScene.agent) {

            scene.mainScene.agent.sov.draw(scene.graphics)

            scene.mainScene.walls.map((wall) => {
                wall.draw(scene.graphics)
            })

            scene.mainScene.agent.draw(scene.graphics)

        }

        scene.graphics.restore()
        scene.framerate.draw(scene.graphics)
        scene.aim.draw(scene.graphics)

    }
})

raycasting.addScene('main', {

    debug: true,

    backgroundColor: '#242528',

    width: resolution.width, height: resolution.height,

    onCreate: (scene) => {

        scene.DEBUG = false

        stage.lockPointer = true

        scene.canvas.style.background = 'linear-gradient(royalblue, white 50%)'

        // collision handler
        scene.collision = new CollisionHandler()

        // input handler
        scene.input = new Input(new Keyboard)

        // agent
        scene.agent = new Circle(new Vector(20, 20), 6, 'yellow', 0, 'yellow')
        scene.agent.rays = []
        scene.agent.angle = 0
        scene.agent.fov = 60
        scene.agent.rayLength = 800
        scene.agent.rayAngle = scene.agent.fov / scene.width
        scene.agent.sov = null
        scene.agent.leftmostRay = null
        scene.agent.rightmostRay = null
        scene.agent.distanceToProjectionPlane = Math.round((scene.width / 2) / (Math.tan((scene.agent.fov / 2) * toRad)))
        scene.agent.speed = 4
        scene.agent.verticalAngle = 0
        scene.agent.mouseSense = new Vector(.07, .09)
        scene.agent.strafeLeft = () => {
            scene.agent.position.x += Math.cos((scene.agent.angle - 90) * toRad) * scene.agent.speed * 0.75
            scene.agent.position.y += Math.sin((scene.agent.angle - 90) * toRad) * scene.agent.speed * 0.75
        }
        scene.agent.strafeRight = () => {
            scene.agent.position.x -= Math.cos((scene.agent.angle - 90) * toRad) * scene.agent.speed * 0.75
            scene.agent.position.y -= Math.sin((scene.agent.angle - 90) * toRad) * scene.agent.speed * 0.75
        }
        scene.agent.forward = (dt) => {
            scene.agent.position.x += Math.cos(scene.agent.angle * toRad) * scene.agent.speed * dt
            scene.agent.position.y += Math.sin(scene.agent.angle * toRad) * scene.agent.speed * dt
        }
        scene.agent.backward = (dt) => {
            scene.agent.position.x -= Math.cos(scene.agent.angle * toRad) * scene.agent.speed * dt
            scene.agent.position.y -= Math.sin(scene.agent.angle * toRad) * scene.agent.speed * dt
        }
        // create and cache agent rays
        for (let i = 0; i < scene.width; i++) {

            const ray = new Line(scene.agent.position, new Vector)
            ray.lineWidth = 0.2

            if (i == 0) scene.agent.leftmostRay = ray
            if (i == scene.width - 1) scene.agent.rightmostRay = ray
            if (i == Math.round(scene.width * 0.5)) scene.agent.sov = ray

            scene.agent.rays.push(ray)

        }

        // map array
        scene.map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 9, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]

        scene.tileSize = 64
        scene.mapWidth = scene.map[0].length * scene.tileSize
        scene.mapHeight = scene.map.length * scene.tileSize
        scene.mapCenterX = Math.round((scene.width / 2) - (scene.mapWidth / 2) + (scene.tileSize / 2))
        scene.mapCenterY = Math.round((scene.height / 2) - (scene.mapHeight / 2) + (scene.tileSize / 2))
        scene.walls = []
        for (let i = 0; i < scene.map[0].length; i++) {
            for (let j = 0; j < scene.map.length; j++) {

                let wallType = scene.map[j][i]

                wallType = randomPick(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4)

                const x = Math.round(scene.mapCenterX + (i * scene.tileSize))
                const y = Math.round(scene.mapCenterY + (j * scene.tileSize))

                const wall = new Shape(new Square, new Vector(x, y), scene.tileSize, scene.tileSize, 'transparent', 0)

                if (wallType == 1) wall.color = 0
                if (wallType == 2) wall.color = 90
                if (wallType == 3) wall.color = 280
                if (wallType == 4) wall.color = 60
                if (wallType == 9) scene.agent.position.update(x, y)

                if (wallType != 0 && wallType != 9)
                    scene.walls.push(wall)

            }
        }

        scene.specialWall = scene.walls[scene.walls.length * 0.5 | 0]

        scene.wallToTest = []
        scene.tmpAuxVector = new Vector

        // raycast information
        scene.raycasting = []
        for (let i = 0; i < scene.width; i++) {
            scene.raycasting[i] = {
                length: Infinity,
                normal: new Vector,
                light: new Vector
            }
        }

        scene.light = new Vector(1, 0)

        scene.initialized = true

    },

    onLoop: (scene, dt, elapsedTime) => {

        scene.light.rotate((scene.agent.sov.normal.angle * 2) * toDegree)

        scene.specialWall.rotateZ(elapsedTime * 0.05 * dt)
        scene.specialWall.transform()
        scene.specialWall.fillColor = 'red'

        // enter debug mode
        if (scene.input.pressed('SPACE')) scene.DEBUG = !scene.DEBUG

        // move agent
        if (scene.input.holding('A')) scene.agent.strafeLeft()
        if (scene.input.holding('D')) scene.agent.strafeRight()
        if (scene.input.holding('W')) scene.agent.forward(dt)
        if (scene.input.holding('S')) scene.agent.backward(dt)

        scene.agent.angle += (mouse.movimentX * scene.agent.mouseSense.x) * dt
        scene.agent.verticalAngle += (mouse.movimentY * scene.agent.mouseSense.y) * dt
        mouse.movimentX = 0
        mouse.movimentY = 0

        // update ray end
        scene.agent.rays.map((ray, i) => {
            ray.end.x = scene.agent.position.x + Math.cos(((scene.agent.fov * 0.5) + (scene.agent.angle - (i * scene.agent.rayAngle))) * toRad) * scene.agent.rayLength
            ray.end.y = scene.agent.position.y + Math.sin(((scene.agent.fov * 0.5) + (scene.agent.angle - (i * scene.agent.rayAngle))) * toRad) * scene.agent.rayLength
        })

        // potential wall to cast ray
        scene.wallToTest.length = 0
        scene.walls.map((wall) => {

            wall.fillColor = `rgba(255, 255, 255, 0.3)`

            const dx = scene.agent.position.x - wall.position.x
            const dy = scene.agent.position.y - wall.position.y
            const distance = dx * dx + dy * dy

            if (distance < scene.agent.rayLength * scene.agent.rayLength) {

                // bottom left to agent vector
                scene.tmpAuxVector.x = scene.agent.position.x - wall.position.x - scene.tileSize * 0.5
                scene.tmpAuxVector.y = scene.agent.position.y - wall.position.y + scene.tileSize * 0.5
                let bottomLeftInsideLeftmostRay = scene.tmpAuxVector.dot(scene.agent.leftmostRay.plane.leftNormal)
                let bottomLeftInsideRighttmostRay = scene.tmpAuxVector.dot(scene.agent.rightmostRay.plane.leftNormal)
                // bottom right to agent vector
                scene.tmpAuxVector.x = scene.agent.position.x - wall.position.x + scene.tileSize * 0.5
                scene.tmpAuxVector.y = scene.agent.position.y - wall.position.y + scene.tileSize * 0.5
                let bottomRightInsideLeftmostRay = scene.tmpAuxVector.dot(scene.agent.leftmostRay.plane.leftNormal)
                let bottomRightInsideRighttmostRay = scene.tmpAuxVector.dot(scene.agent.rightmostRay.plane.leftNormal)
                // top left to agent vector
                scene.tmpAuxVector.x = scene.agent.position.x - wall.position.x - scene.tileSize * 0.5
                scene.tmpAuxVector.y = scene.agent.position.y - wall.position.y - scene.tileSize * 0.5
                let topLeftInsideLeftmostRay = scene.tmpAuxVector.dot(scene.agent.leftmostRay.plane.leftNormal)
                let topLeftInsideRighttmostRay = scene.tmpAuxVector.dot(scene.agent.rightmostRay.plane.leftNormal)
                // top right to agent vector
                scene.tmpAuxVector.x = scene.agent.position.x - wall.position.x + scene.tileSize * 0.5
                scene.tmpAuxVector.y = scene.agent.position.y - wall.position.y - scene.tileSize * 0.5
                let topRightInsideLeftmostRay = scene.tmpAuxVector.dot(scene.agent.leftmostRay.plane.leftNormal)
                let topRightInsideRighttmostRay = scene.tmpAuxVector.dot(scene.agent.rightmostRay.plane.leftNormal)

                if (
                    (bottomLeftInsideLeftmostRay < 0 && bottomLeftInsideRighttmostRay > 0)
                    || (bottomRightInsideLeftmostRay < 0 && bottomRightInsideRighttmostRay > 0)
                    || (topLeftInsideLeftmostRay < 0 && topLeftInsideRighttmostRay > 0)
                    || (topRightInsideLeftmostRay < 0 && topRightInsideRighttmostRay > 0)
                ) {
                    scene.wallToTest.push(wall)
                }

            }

        })

        // sort walls to test by sign of view
        scene.wallToTest.sort(CollisionHandler.lineSorting(scene.agent.sov, scene.wallToTest))

        // second wall filter
        for (let i = 0; i < scene.agent.rays.length; i++) {
            const ray = scene.agent.rays[i]
            for (let j = 0; j < scene.wallToTest.length; j++) {
                if (!ray.intersecting) {
                    const wall = scene.wallToTest[j]
                    if (scene.collision.check(ray, wall)) {
                        ray.intersecting = true
                        wall.intersecting = true
                    }
                }
            }

        }

        // get raycasting information
        scene.agent.rays.map((ray, i) => {

            const raycasting = scene.raycasting[i]

            scene.wallToTest.map((wall) => {

                if (wall.intersecting) {

                    wall.fillColor = 'black'

                    if (scene.collision.check(ray, wall)) {
                        ray.end.x = scene.collision.closestPoint.x
                        ray.end.y = scene.collision.closestPoint.y
                        raycasting.normal.x = scene.collision.normal.x
                        raycasting.normal.y = scene.collision.normal.y
                        raycasting.light = raycasting.normal.dot(scene.light)
                        raycasting.color = wall.color
                        const projection = ray.plane.dot(scene.agent.sov.plane.normalize)
                        raycasting.length = projection
                    }
                }

            })
        })

        // reset ray intersecting flag
        scene.agent.rays.map((ray, i) => {
            const raycasting = scene.raycasting[i]
            if (ray.intersecting) {
                ray.intersecting = false
            } else {
                raycasting.length = 0
            }
        })

        // agent collision with walls
        scene.walls.map((wall) => {
            if (scene.collision.check(scene.agent, wall)) {
                scene.agent.position.add(scene.collision.mtv)
            }
            wall.intersecting = false
        })

        scene.specialWall.fillColor = 'cyan'

        scene.raycasting.reverse()

    },

    onDraw: (scene) => {

        scene.raycasting.map((raycasting, i) => {
            const w = 1
            const x = i
            const h = (scene.tileSize / raycasting.length) * scene.agent.distanceToProjectionPlane
            const light = 25 + (0.6 + (raycasting.light * 0.003)) * 25
            scene.graphics.fillStyle = `hsl(${raycasting.color}, 100%, ${light}%)`
            scene.graphics.fillRect(x, ((scene.height / 2) - scene.agent.verticalAngle * 1) - (h / 2), w, h)
        })

        if (scene.DEBUG) {

            // draw walls
            const scaleFactor = 0.1
            const centerX = scene.width * 0.5
            const centerY = scene.height * 0.5
            scene.graphics.lineWidth = 2
            scene.walls.map((wall) => {
                scene.graphics.strokeStyle = wall.fillColor
                scene.graphics.strokeRect(Math.round(centerX - wall.position.x * scaleFactor), Math.round(centerY - wall.position.y * scaleFactor), Math.round(wall.width * scaleFactor), Math.round(wall.height * scaleFactor))
            })

            // // draw map rays
            scene.agent.rays.map((ray) => {
                scene.graphics.beginPath()
                scene.graphics.strokeStyle = 'cyan'
                scene.graphics.lineWidth = 0.03
                scene.graphics.moveTo(centerX - (scene.agent.position.x - scene.tileSize * 0.5) * scaleFactor, centerY - (scene.agent.position.y - scene.tileSize * 0.5) * scaleFactor)
                scene.graphics.lineTo(centerX - (ray.end.x - scene.tileSize * 0.5) * scaleFactor, centerY - (ray.end.y - scene.tileSize * 0.5) * scaleFactor)
                scene.graphics.stroke()
                scene.graphics.closePath()
            })

            // // draw agent
            scene.graphics.beginPath()
            scene.graphics.fillStyle = 'orange'
            scene.graphics.arc(Math.round(centerX - (scene.agent.position.x - scene.tileSize * 0.5) * scaleFactor), Math.round(centerY - (scene.agent.position.y - scene.tileSize * 0.5) * scaleFactor), 2, 0, 2 * PI)
            scene.graphics.fill()
            scene.graphics.closePath()

        }

    }

})

stage.addMovie(raycasting)
stage.play('raycasting')