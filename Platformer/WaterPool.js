class WaterPool {

    constructor(position = new Vector(0, 0), width = 200, height = 80, radius = 6, space = 20) {

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

        this.boundingBox = {
            centerX: this.position.x,
            centerY: this.position.y,
            width: this.width,
            height: this.height
        }

        /**
         * WaterPool's anchor orientation, to help positionate
         * 
         * @type {object}
         */
        this.anchor = { x: 0.5, y: 0.5 }

        /**
         * @type {number}
         */
        this.lineWidth = 2

        /**
         * @type {string}
         */
        this.lineColor = 'rgba(30,120,255,0.3)'

        /**
         * @type {string}
         */
        this.fillColor = 'rgba(30,120,255,0.3)'

        /**
         * @type {number}
         */
        this.alpha = 1

        /**
         * @type {string}
         */
        this.globalCompositeOperation = 'lighter'

        /**
         * Projected light on surface
         * 
         * @type {object}
         */
        this.light = {
            x: this.width * 0.5,
            width: 100,
            color: 'rgba(255, 255, 255, 0.8)'
        }

        /**
         * Container that holds pooled objects
         * 
         * @type {array}
         */
        this.nodes = []

        /**
         * @type {number}
         */
        this.nodeRadius = radius

        /**
         * @type {number}
         */
        this.nodeSpace = space

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

        /**
         * How much propagates wave
         * Lower numbers (0.005) less propagation
         * Higher numbers (0.025) more propagation
         * 
         * @type {number}
         */
        this.propagation = 0.025

        /**
         * How much jelly water behavior is
         * Lower numbers (0.025) less jelly
         * Higher numbers (0.25) more jelly
         * 
         * @type {number}
         */
        this.jelly = 0.025

        /**
         * How fast water back to rest position
         * Lower numbers (0.91) fast rest
         * Higher numbers (0.99) slow rest
         * 
         * @type {number}
         */
        this.recover = .97

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

    /**
     * Creates a wave based on node index
     * 
     * @param {number} nodeIndex 
     * @param {number} force 
     * @param {number} influence 
     * 
     * @return {void}
     */
    createWave(nodeIndex, force = 5, influence = 1) {

        for (let i = nodeIndex - influence; i <= nodeIndex + influence; i++) {
            if (!this.nodes[i].static)
                this.nodes[i].body.applyForce(new Vector(0, force))
        }

    }

    /**
     * Creates a random wave
     * 
     * @param {number} force 
     * @param {number} influence 
     * 
     * @return {void}
     */
    createRandomWave(force, influence) {

        let index = random(this.nNodes, false)

        if (index > 2 && index < this.nNodes - 3)
            this.createWave(index, force, influence)

    }

    /**
     * Calculates spring force and integrate nodes
     * 
     * @param {number} dt 
     * 
     * @return {void}
     */
    update(dt) {

        // each node
        this.nodes.map((node, i) => {

            // integrate node body
            node.body.update(dt)

            // distance from rest position
            let heightDiff = node.body.position.y - node.startPosition.y
            // calculate spring force
            let springForce = heightDiff * -this.jelly
            // accelerate node body
            node.body.acceleration.y += springForce * dt
            // apply friction to stop node from infinity oscillation
            node.body.velocity.y *= this.recover

            if (node.static) {
                node.body.acceleration.y = 0
                node.body.velocity.y = 0
            }

        })

        // propagate waves
        for (let i = 0; i < this.nNodes; i++) {

            let currentNode = this.nodes[i]

            if (currentNode.static) continue

            if (i > 1) {
                let leftNode = this.nodes[i - 1]

                let springForce = this.propagation * (currentNode.body.position.y - leftNode.body.position.y)

                leftNode.body.acceleration.y += springForce
                leftNode.body.position.y += springForce
            }

            if (i < this.nNodes - 2) {
                let rightNode = this.nodes[i + 1]

                let springForce = this.propagation * (currentNode.body.position.y - rightNode.body.position.y)

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


        // create line gradient
        let linearGradient = graphics.createLinearGradient(this.light.x, 0, this.light.x + this.light.width, 0);
        linearGradient.addColorStop(0, this.fillColor);
        linearGradient.addColorStop(0.5, this.light.color);
        linearGradient.addColorStop(1, this.fillColor);

        // draw outlines
        graphics.save()
        graphics.globalCompositeOperation = this.globalCompositeOperation
        graphics.strokeStyle = linearGradient
        graphics.fillStyle = this.fillColor
        graphics.lineWidth = this.lineWidth
        graphics.beginPath()
        for (let i = 0; i < this.nNodes; i++) {

            let B = this.nodes[i + 1]

            if (i == this.nNodes - 1)
                B = this.nodes[0]

            graphics.lineTo(B.position.x, B.position.y)

        }
        graphics.closePath()
        if (this.lineWidth) {
            graphics.globalAlpha = this.alpha + 0.5
            graphics.stroke()
        }
        graphics.globalAlpha = this.alpha
        graphics.fill()
        graphics.restore()

        // draw nodes
        // this.nodes.map((node) => {
        //     if (node.static) node.fillColor = 'grey'
        //     node.draw(graphics)
        // })

    }

}