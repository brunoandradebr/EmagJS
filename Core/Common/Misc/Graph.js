/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */

class Graph {

    constructor() {

        this.collision = new CollisionHandler()

        this.nodes = []
        this.polygons = []
        this.offset = 0

        this.tmpLines = []
        this.tmpPoints = []
        this.tmpLine = new Line()
        this.tmpCircle = new Circle(new Vector, this.offset * 0.5, 'transparent', 2, 'white')

    }

    addNode(position, id) {
        const insertedId = id ? id : this.nodes.length
        this.nodes.push({ id: insertedId, position: position, connections: [] })
        this.updateNode(insertedId, position)
    }

    updateNode(id, position) {

        const toUpdate = this.nodes.filter(node => node.id == id)[0]

        if (position)
            toUpdate.position.update(position)

        // avoid end point to enter polygon
        if (id === 'end' && this.polygons) {
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

    getNode(id) {
        return this.nodes.filter(node => node.id === id)[0]
    }

    fromPolygon(polygons, offset = 0) {

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

        if (this.polygons)
            this.polygons.map((polygon) => polygon.draw(graphics))

        this.nodes.map((node) => {

            graphics.beginPath()

            // draw connection lines
            graphics.lineWidth = 2
            graphics.strokeStyle = 'rgba(255, 255, 255, 0.02)'
            node.connections.map((connectedId) => {
                const connected = this.nodes.filter(node => node.id == connectedId)[0]
                graphics.moveTo(node.position.x, node.position.y)
                graphics.lineTo(connected.position.x, connected.position.y)
            })
            graphics.stroke()
            graphics.closePath()

            // draw node id
            graphics.fillStyle = node.id === 'start' ? 'royalblue' : node.id === 'end' ? 'orange' : 'rgba(0, 0, 0, 0.8)'
            graphics.arc(node.position.x, node.position.y, (node.id === 'start' || node.id === 'end') && (this.offset && this.offset * 0.5 >= 10) ? this.offset * 0.5 : 10, 0, 2 * Math.PI)
            graphics.fill()
            const width = graphics.measureText(node.id).width
            graphics.fillStyle = 'black'
            graphics.fillText(node.id, ((node.position.x - width * 0.5) + 1) | 0, ((node.position.y + 3) | 0) + 1)
            graphics.fillStyle = 'white'
            graphics.fillText(node.id, (node.position.x - width * 0.5) | 0, (node.position.y + 3) | 0)

        })

    }

}