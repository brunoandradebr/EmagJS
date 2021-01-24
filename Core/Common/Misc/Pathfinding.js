/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */

class Pathfinding {

    constructor(graph = new Graph) {

        this.path = []

        this.lineColor = null

    }

    _getNode(id, graph) {
        return graph.nodes.filter(node => node.id == id)[0]
    }

    euclidean(a, b) {
        const dx = a.x - b.x
        const dy = a.y - b.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    manhattan(a, b) {
        const dx = (a.x - b.x)
        const dy = (a.y - b.y)
        return dx + dy
    }

    search(graph, start, end, heuristic = 'euclidean') {

        graph.nodes.map((node) => {
            node.g = Infinity
            node.f = Infinity
            node.visited = false
            node.parent = null
        })

        let unvisited = [this._getNode(start, graph)]
        const endNode = this._getNode(end, graph)

        if (endNode == undefined) return this.path = []
        if (unvisited[0].obstacle) return this.path = []

        // if start or end node are inside graph polygons
        if (graph.polygons.length) {

            let notReachable = false

            graph.polygons.map((polygon) => {
                if (polygon.contains(unvisited[0].position) || polygon.contains(endNode.position))
                    notReachable = true
            })

            if (notReachable)
                return this.path = []

        }

        unvisited[0].g = 0

        while (unvisited.length) {

            // get current node from unvisted list with lower f cost
            let currentNode = unvisited.sort((a, b) => a.f - b.f)[0]

            // reached the end point
            if (currentNode.id == end) {

                // make the path!
                const path = [{ id: endNode.id, position: endNode.position.clone() }]

                let currentStep = endNode

                while (currentStep.parent) {
                    path.push({ id: currentStep.parent.id, position: currentStep.parent.position.clone() })
                    currentStep = currentStep.parent
                }

                this.path = path.reverse()

                return this.path

            } else {

                // mark current node as visited
                currentNode.visited = true
                // remove current node from unvisited
                unvisited = unvisited.filter(node => node.id != currentNode.id)

                // check each neighbor
                currentNode.connections.map((neighborId) => {

                    const neighbor = this._getNode(neighborId, graph)

                    // neighbor not visited yet and not an obstacle 
                    if (!neighbor.visited && !neighbor.obstacle) unvisited.push(neighbor)

                    const distanceToNeighbor = currentNode.position.clone().subtract(neighbor.position).length
                    const possibleLowerCost = currentNode.g + distanceToNeighbor

                    if (possibleLowerCost < neighbor.g) {

                        let heuristicMethod = heuristic === 'euclidean'
                            ? this.euclidean(neighbor.position, endNode.position)
                            : this.manhattan(neighbor.position, endNode.position)

                        if (heuristic.constructor.name === 'Function')
                            heuristicMethod = heuristic(neighbor.position, endNode.position)

                        neighbor.parent = currentNode
                        neighbor.g = possibleLowerCost
                        neighbor.f = neighbor.g + heuristicMethod

                    }

                })

            }

        }

        return this.path = []

    }

    draw(graphics) {
        if (this.path.length) {
            graphics.save()
            graphics.beginPath()
            if (this.lineColor == null) {
                let gradient = graphics.createLinearGradient(this.path[0].position.x, this.path[0].position.y, this.path[this.path.length - 1].position.x, this.path[this.path.length - 1].position.y)
                gradient.addColorStop(0, 'purple')
                gradient.addColorStop(0.5, 'royalblue')
                gradient.addColorStop(0.7, 'cyan')
                gradient.addColorStop(1, '#eee')
                graphics.strokeStyle = gradient
            } else {
                graphics.strokeStyle = this.lineColor
            }
            graphics.lineWidth = 3
            graphics.lineCap = 'butt'
            for (let i = 0; i < this.path.length; i++) {
                if (this.path[i + 1]) {
                    const currentStep = this.path[i].position
                    const nextStep = this.path[i + 1].position
                    graphics.moveTo(currentStep.x, currentStep.y)
                    graphics.lineTo(nextStep.x, nextStep.y)
                }
            }
            graphics.closePath()
            graphics.stroke()
            graphics.restore()
        }
    }

}