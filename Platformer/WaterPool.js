class WaterPool {

    constructor(position = new Vector(0, 0), width = 200, height = 80) {

        /**
         * position
         * 
         * @type {EmagJS.Core.Math.Vector}
         */
        this.position = position

        /**
         * @type {number}
         */
        this.width = width

        /**
         * @type {number}
         */
        this.height = height

        /**
         * WaterPool's anchor orientation, to help positionate
         * 
         * @type {object}
         */
        this.anchor = { x: 0.5, y: 0.5 }

        /**
         * @type {string}
         */
        this.lineColor = 'black'

        /**
         * @type {string}
         */
        this.fillColor = 'transparent'

        /**
         * Container that holds pooled objects
         * 
         * @type {array}
         */
        this.nodes = []

        /**
         * @type {number}
         */
        this.nodeRadius = 6

        /**
         * @type {number}
         */
        this.nodeSpace = 30

        /**
         * Object Pool to manager nodes creation
         * 
         * @type {EmagJS.Core.Common.Misc.ObjectPool}
         */
        this.nodePool = new ObjectPool(() => {
            let node = new Circle(new Vector, this.nodeRadius, this.fillColor, 2, this.lineColor)
            node.startPosition = node.position.clone()
            node.body = new Body(node)
            return node
        }, (node) => {
            node.fillColor = this.fillColor
            node.lineColor = this.lineColor
            node.static = false
            return node
        })

        // create nodes
        this.createNodes()

    }

    /**
     * Create water pool nodes
     * 
     * @return {void}
     */
    createNodes() {

        // clear node pool
        this.nodes.map((node) => this.nodePool.destroy(node))

        // clear node array
        this.nodes.length = 0


        // calculate necessary node number to fill width
        this.nNodes = Math.round((this.width / (this.nodeSpace + this.nodeRadius))) + 3

        // create nodes
        for (let i = 0; i < this.nNodes; i++) {

            // get a node from node pool
            let node = this.nodePool.create()
            // positionate node
            node.body.position.x = this.position.x - (this.width * this.anchor.x + (this.nodeSpace + this.nodeRadius)) + ((this.nodeSpace + this.nodeRadius) * i)
            node.body.position.y = this.position.y - this.height * this.anchor.y

            // first node goes under to shape a pool
            // o--o--o--o--o--o--o--o--o--o--o
            // |                             |
            // X-----------------------------o
            if (i == 0) {
                node.body.position.y += this.height
                node.body.position.x += this.nodeSpace + this.nodeRadius
                node.static = true
            }

            if (i == 1 || i == this.nNodes - 2) {
                node.static = true
            }

            // last node goes under to shape a pool
            // o--o--o--o--o--o--o--o--o--o--o
            // |                             |
            // o-----------------------------X
            if (i == this.nNodes - 1) {
                node.body.position.y += this.height
                node.body.position.x -= this.nodeSpace + this.nodeRadius
                node.static = true
            }

            // node rest position
            node.startPosition = node.body.position.clone()

            this.nodes.push(node)

        }

    }

    update(dt) {

        // each node
        this.nodes.map((node, i) => {

            // integrate node body
            node.body.update(dt)

            // distance from rest position
            let heightDiff = node.body.position.y - node.startPosition.y
            // calculate spring force
            let springForce = heightDiff * -0.025
            // accelerate node body
            node.body.acceleration.y += springForce * dt
            // apply friction to stop node from infinity oscillation
            node.body.velocity.y *= .99

        })

        // propagate waves
        for (let i = 0; i < this.nNodes; i++) {

            let currentNode = this.nodes[i]

            if (currentNode.static) continue

            if (i > 1) {
                let leftNode = this.nodes[i - 1]

                let springForce = .025 * (currentNode.body.position.y - leftNode.body.position.y)

                leftNode.body.acceleration.y += springForce
                leftNode.body.position.y += springForce
            }

            if (i < this.nNodes - 2) {
                let rightNode = this.nodes[i + 1]

                let springForce = .025 * (currentNode.body.position.y - rightNode.body.position.y)

                rightNode.body.acceleration.y += springForce
                rightNode.body.position.y += springForce
            }

        }

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        // draw outlines
        graphics.strokeStyle = this.lineColor
        graphics.fillStyle = this.fillColor
        graphics.beginPath()
        for (let i = 0; i < this.nNodes; i++) {

            let B = this.nodes[i + 1]

            if (i == this.nNodes - 1)
                B = this.nodes[0]

            graphics.lineTo(B.position.x, B.position.y)

        }
        graphics.closePath()
        graphics.fill()
        graphics.stroke()

        // draw nodes
        // this.nodes.map((node) => {

        //     if (node.static) node.fillColor = 'grey'

        //     node.draw(graphics)

        // })

    }

}