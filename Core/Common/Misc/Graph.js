class Graph {

    constructor() {

        this.collision = new CollisionHandler()

        this.nodes = []

        this.tmpLines = []
        this.tmpPoints = []
        this.tmpLine = new Line()

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

    fromPolygon(polygons) {

        this.tmpLines.length = 0
        polygons.map((polygon) => {
            polygon.getLines().map((line) => {
                this.tmpLines.push(line)
            })
        })

        this.tmpPoints.length = 0
        polygons.map((polygon) => {
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
                polygons.map((polygon) => {
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
            graphics.arc(node.position.x, node.position.y, 8, 0, 2 * Math.PI)
            graphics.fill()
            const width = graphics.measureText(node.id).width
            graphics.fillStyle = 'black'
            graphics.fillText(node.id, ((node.position.x - width * 0.5) + 1) | 0, ((node.position.y + 3) | 0) + 1)
            graphics.fillStyle = 'white'
            graphics.fillText(node.id, (node.position.x - width * 0.5) | 0, (node.position.y + 3) | 0)

        })

    }

}