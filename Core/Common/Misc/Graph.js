/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */

class Graph {

    constructor() {

        this.collision = new CollisionHandler()

        this.nodes = []

        // when working with graph from polygon
        this.polygons = []
        this.offset = 0
        this.tmpLines = []
        this.tmpPoints = []
        this.tmpLine = new Line()
        this.tmpCircle = new Circle(new Vector, this.offset * 0.5, 'transparent', 2, 'white')

        // when working with graph from grid
        this.position = new Vector
        this.tileSize = 40

    }

    addNode(position, id, connections = [], isObstacle = false) {
        const insertedId = id ? id : this.nodes.length
        this.nodes.push({ id: insertedId, position: position, connections: connections, obstacle: isObstacle })
        if (!connections)
            this.updateNode(insertedId, position, isObstacle)
    }

    updateNode(id, position, isObstacle) {

        const toUpdate = this.nodes.filter(node => node.id == id)[0]

        if (isObstacle != undefined)
            toUpdate.obstacle = isObstacle

        if (position)
            toUpdate.position.update(position)

        // dealing with graph from polygon vertices
        if (this.polygons.length) {

            // avoid end point to enter polygon
            if (id === 'end') {
                this.tmpCircle.position.update(toUpdate.position)
                this.tmpCircle.radius = this.offset * 0.5
                this.polygons.map((polygon) => {
                    if (this.collision.check(this.tmpCircle, polygon)) {
                        toUpdate.position.add(this.collision.mtv)
                    }
                })
            }

            // remove updated node from it's connections
            toUpdate.connections.map((connectedId) => {
                const connected = this.nodes.filter(node => node.id == connectedId)[0]
                connected.connections = connected.connections.filter(connectionId => connectionId != id)
            })

            // remove updated node connections
            toUpdate.connections.length = 0

            this.tmpLine.start = toUpdate.position

            this.nodes.map((node) => {

                if (id != node.id) {

                    this.tmpLine.end = node.position

                    let isValid = true
                    this.tmpLines.map((line) => {
                        if (this.collision.check(line, this.tmpLine)) {
                            isValid = false
                        }
                    })

                    if (isValid) {
                        toUpdate.connections.push(node.id)
                        if (!node.connections.includes(id))
                            node.connections.push(id)
                    }

                }

            })

        }

    }

    getNode(id) {
        return this.nodes.filter(node => node.id === id)[0]
    }

    getNodeAt(x, y) {
        // if passed vector as coordinates
        if (arguments.length === 1) {
            const nodeX = Math.round((x.x - this.position.x) / this.tileSize)
            const nodeY = Math.round((x.y - this.position.y) / this.tileSize)
            return this.getNode(`${nodeX}_${nodeY}`)
        } else {
            const nodeX = Math.round((x - this.position.x) / this.tileSize)
            const nodeY = Math.round((y - this.position.y) / this.tileSize)
            return this.getNode(`${nodeX}_${nodeY}`)
        }
    }

    fromGrid(grid, position, tileSize = 40, diagonals = false) {

        const gridW = grid[0].length
        const gridH = grid.length

        const center = position ? position : new Vector((DEVICE_CENTER_X) - ((gridW * tileSize * 0.5) - (tileSize * 0.5)) | 0, (DEVICE_CENTER_Y) - ((gridH * tileSize * 0.5) - (tileSize * 0.5)) | 0)

        this.tileSize = tileSize
        this.position.x = center.x
        this.position.y = center.y

        for (let y = 0; y < gridH; y++) {
            for (let x = 0; x < gridW; x++) {

                const tileId = `${x}_${y}`
                const tileType = grid[y][x]
                const tileConnections = []

                if (x + 1 < gridW)
                    tileConnections.push(`${x + 1}_${y}`)
                if (x - 1 >= 0)
                    tileConnections.push(`${x - 1}_${y}`)
                if (y + 1 < gridH)
                    tileConnections.push(`${x}_${y + 1}`)
                if (y - 1 >= 0)
                    tileConnections.push(`${x}_${y - 1}`)

                if (diagonals) {
                    if (x + 1 < gridW && y + 1 < gridH) {
                        tileConnections.push(`${x + 1}_${y + 1}`)
                        tileConnections.push(`${x - 1}_${y + 1}`)
                        tileConnections.push(`${x - 1}_${y - 1}`)
                        tileConnections.push(`${x + 1}_${y - 1}`)
                    }
                }

                const tilePosition = new Vector(center.x + x * tileSize, center.y + y * tileSize)

                this.addNode(
                    tilePosition,
                    tileId,
                    tileConnections,
                    tileType === 1 ? true : false
                )

            }
        }

    }

    fromPolygon(polygons, offset = 1) {

        this.polygons = polygons

        if (offset > 0) {

            this.offset = offset

            const modifiedPolygons = []

            polygons.map((polygon) => {
                const clonedPoints = polygon.polygon.points.slice().map((point) => point)
                const clone = new Shape(
                    new Polygon(clonedPoints),
                    polygon.position.clone(),
                    polygon.width + this.offset,
                    polygon.height + this.offset,
                    'rgba(100, 80, 255, 0.05)',
                    2,
                    'rgba(100, 80, 255, 0.08)'
                )
                modifiedPolygons.push(clone)
            })

            this.polygons = modifiedPolygons

        }

        this.tmpLines.length = 0
        this.polygons.map((polygon) => {
            polygon.getLines().map((line) => {
                this.tmpLines.push(line)
            })
        })

        this.tmpPoints.length = 0
        this.polygons.map((polygon) => {
            polygon.getVertices().map((point) => {
                this.tmpPoints.push(point)
            })
        })

        this.nodes.length = 0

        for (let i = 0; i < this.tmpPoints.length; i++) {

            const pointA = this.tmpPoints[i]

            const node = { id: i, position: pointA, connections: [] }

            for (let j = 0; j < this.tmpPoints.length; j++) {

                const pointB = this.tmpPoints[j]

                if (i == j) continue

                this.tmpLine.start = pointA
                this.tmpLine.end = pointB

                let isValid = true
                this.polygons.map((polygon) => {
                    if (polygon.contains(this.tmpLine.center)) {
                        isValid = false
                    }
                })

                if (isValid) {
                    this.tmpLines.map((line) => {
                        if (this.collision.check(line, this.tmpLine))
                            isValid = false
                    })
                }

                if (isValid)
                    node.connections.push(j)

            }

            this.nodes.push(node)

        }

    }

    draw(graphics) {

        if (this.polygons.length)
            this.polygons.map((polygon) => polygon.draw(graphics))

        graphics.lineWidth = 1

        this.nodes.map((node) => {

            if (!node.obstacle) {

                graphics.beginPath()

                graphics.strokeStyle = 'rgba(0, 0, 0, 0.5)'

                // draw connection lines
                node.connections.map((connectedId) => {
                    const connected = this.nodes.filter(node => node.id == connectedId)[0]
                    if (connected && !connected.obstacle) {
                        graphics.moveTo(node.position.x, node.position.y)
                        graphics.lineTo(connected.position.x, connected.position.y)
                    }
                })

                graphics.stroke()

            }

            // draw node id
            graphics.beginPath()
            graphics.fillStyle = node.id === 'start' ? 'royalblue' : node.id === 'end' ? 'orange' : 'rgba(0, 0, 0, 0.5)'
            graphics.fillStyle = node.obstacle ? 'rgba(255, 0, 0, 0.3)' : graphics.fillStyle
            graphics.strokeStyle = node.obstacle ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)'
            graphics.arc(node.position.x, node.position.y, (node.id === 'start' || node.id === 'end') && (this.offset && this.offset * 0.5 >= 10) ? this.offset * 0.5 : 10, 0, 2 * Math.PI)
            graphics.fill()
            graphics.stroke()

            const width = graphics.measureText(node.id).width
            graphics.fillStyle = 'black'
            graphics.fillText(node.id, ((node.position.x - width * 0.5) + 1) | 0, ((node.position.y + 3) | 0) + 1)
            graphics.fillStyle = 'white'
            graphics.fillText(node.id, (node.position.x - width * 0.5) | 0, (node.position.y + 3) | 0)

        })

    }

}