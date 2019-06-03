/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Inverse Kinematics
 */
class IK {

    /**
     * 
     * @param {integer} iterations - solver iterations 
     */
    constructor(iterations = 1) {

        this.iterations = iterations

        /**
         * Holds IK nodes (circles with physic body)
         * 
         * @type {array<EmagJS.Core.Render.Circle}
         */
        this.nodes = []

        /**
         * Holds pair connection with constraint information
         * 
         * @type {array<object>}
         */
        this.connections = []

        this.debug = false

    }

    /**
     * Creates nodes to be used by IK
     * 
     * @param {integer} total 
     * 
     * @return {void}
     */
    createNodes(total = 2) {

        for (let i = 0; i < total; i++) {

            // create a circle
            let node = new Circle(new Vector, 5, 'transparent', 1)

            // fixed flag
            node.fixed = false

            // physic body
            node.body = new Body(node)

            this.nodes.push(node)
        }

    }

    /**
     * Updates node position
     * 
     * @param {integer} index 
     * @param {number} x 
     * @param {number} y 
     * 
     * @return {void}
     */
    updateNode(index, x, y) {
        this.nodes[index].position.x = x
        this.nodes[index].position.y = y
        this.nodes[index].body.position.x = x
        this.nodes[index].body.position.y = y
    }

    /**
     * Creates a connection between two nodes
     * 
     * @param {integer} aIndex - node A index
     * @param {integer} bIndex - node B index
     * @param {number} length  - connection length constraint
     * @param {number} stiffness  - connection stiffness
     * 
     * @return {void}
     */
    connect(aIndex, bIndex, length, stiffness = 0.5) {

        // node A
        let a = this.nodes[aIndex]

        // node B
        let b = this.nodes[bIndex]

        // distance length
        length = length ? length : b.body.position.clone().subtract(a.body.position).length

        // create a new connection
        let connection = {
            a: a,
            b: b,
            length: length,
            stiffness: stiffness
        }

        this.connections.push(connection)

    }

    /**
     * Fixes a node - do not update physic
     * 
     * @param {integer} nodeIndex 
     * 
     * @return {void}
     */
    fix(nodeIndex) {
        this.nodes[nodeIndex].fixed = true
    }

    /**
     * Unfixes a node - update physic
     * 
     * @param {integer} nodeIndex 
     * 
     * @return {void}
     */
    unfix(nodeIndex) {
        this.nodes[nodeIndex].fixed = false
    }

    /**
     * Apply a force to IK nodes
     * 
     * @param {EmagJS.Core.Math.Vector} force 
     * @param {integer} nodeIndex 
     * 
     * @return {void}
     */
    applyForce(force, nodeIndex) {

        // if node index is set
        if (nodeIndex != undefined) {
            // get index node
            let node = this.nodes[nodeIndex]
            // apply force if not fixed
            if (!node.fixed)
                node.body.applyForce(force)
        } else {
            // apply force to all nodes
            this.nodes.map((node) => {
                // if not fixed
                if (!node.fixed)
                    node.body.applyForce(force)
            })
        }

    }

    /**
     * IK Solver
     * 
     * Solve distance constraint
     * 
     * @param {number} dt 
     * 
     * @return {void}
     */
    solver(dt) {

        // solver iterations
        for (let i = 0; i < this.iterations; i++) {

            // for each node pair
            this.connections.map((connection) => {

                // node A
                let a = connection.a
                // node B
                let b = connection.b
                // connection distance constraint
                let distanceConstraint = connection.length

                // distance between connection nodes
                let distance = b.body.position.clone().subtract(a.body.position).length
                // relative distance from node B to node A
                let relativeDistance = distanceConstraint - distance

                // connection direction (B - A) normalized
                let direction = b.body.position.clone().subtract(a.body.position).normalize
                // relative velocity
                let relativeVelocity = b.body.velocity.clone().subtract(a.body.velocity)
                // relative velocity in direction
                let normalVelocity = relativeVelocity.dot(direction)

                // calculate impulse
                let impulse = direction.multiplyScalar(normalVelocity - relativeDistance)
                // apply stiffness to impulse
                impulse.multiplyScalar(connection.stiffness)

                // apply impulse if not fixed
                if (!a.fixed)
                    a.body.velocity.add(impulse)
                if (!b.fixed)
                    b.body.velocity.subtract(impulse)

            })

        }

    }

    /**
     * Update nodes physic body
     * 
     * @param {number} dt 
     * 
     * @return {void}
     */
    update(dt) {

        // for each node
        this.nodes.map((node) => {

            // if not fixed, update physic body
            if (!node.fixed)
                node.body.update(dt)

            // apply friction to nodes
            node.body.velocity.multiplyScalar(.99)

            // constraint screen edges - TODO - pass to collision handler
            if (node.body.position.x > DEVICE_WIDTH - node.radius) {
                if (node.body.velocity.x > 0) {
                    node.body.position.x = DEVICE_WIDTH - node.radius
                    node.body.velocity.x *= -0.5
                    node.body.velocity.y *= -0.5
                }
            }
            if (node.body.position.x < node.radius) {
                if (node.body.velocity.x < 0) {
                    node.body.position.x = node.radius
                    node.body.velocity.x *= -0.5
                    node.body.velocity.y *= -0.5
                }
            }
            if (node.body.position.y > DEVICE_HEIGHT - node.radius) {
                if (node.body.velocity.y > 0) {
                    node.body.position.y = DEVICE_HEIGHT - node.radius
                    node.body.velocity.y *= -0.5
                    node.body.velocity.x *= -0.5
                }
            }
            if (node.body.position.y < node.radius) {
                if (node.body.velocity.y < 0) {
                    node.body.position.y = node.radius
                    node.body.velocity.y *= -0.5
                    node.body.velocity.x *= -0.5
                }
            }

            // update node position
            node.position.update(node.body.position)

        })

        // solve constraints
        this.solver(dt)

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        // for each node
        this.connections.map((connection) => {

            // draw node - debug mode only
            if (this.debug) {
                connection.a.draw(graphics)
                connection.b.draw(graphics)
            }

            // move and stroke
            graphics.beginPath()
            graphics.moveTo(connection.a.body.position.x, connection.a.body.position.y)
            graphics.lineTo(connection.b.body.position.x, connection.b.body.position.y)
            graphics.stroke()

        })

    }

}