/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Physics body
 */
class Body {

    /**
     * 
     * @param {EmagJS.Core.Render.Shape | EmagJS.Core.Render.Sprite} representation - Visual representation
     */
    constructor(representation) {

        /**
         * @type {EmagJS.Core.Math.Vector}
         */
        this.acceleration = new Vector();

        /**
         * @type {EmagJS.Core.Math.Vector}
         */
        this.velocity = new Vector();

        /**
         * @type {EmagJS.Core.Math.Vector}
         */
        this.position = new Vector();

        /**
         * @type {number}
         */
        this.angularAcceleration = 0;

        /**
         * @type {number}
         */
        this.angularVelocity = 0;

        /**
         * @type {number}
         */
        this.angle = 0;

        /**
         * @type {number}
         */
        this.mass = 1;

        /**
         * @type {number}
         */
        this.inertia = 1;

        /**
         * @type {number}
         */
        this.bounce = 0.5;

        /**
         * @type {number}
         */
        this.friction = 1

        /**
         * @type {number}
         */
        this.angularFriction = .99

        /**
         * @type {EmagJS.Core.Render.Shape | EmagJS.Core.Render.Sprite}
         */
        this.representation = representation;

        // initialize position based on it's representation
        this.position.x = this.representation.position.x
        this.position.y = this.representation.position.y

        // initialize angle based on it's representation
        this.angle = this.representation.angle

    }

    /**
     * Returns inverse mass
     * 
     * @return {number}
     */
    get invMass() {
        return this.mass > 0 ? 1 / this.mass : 0
    }

    /**
     * Returns inverse inertia
     * 
     * @return {number}
     */
    get invInertia() {
        return this.inertia > 0 ? 1 / this.inertia : 0
    }

    /**
     * Applies force to it
     * 
     * @param {number}                  - scalar force, applies to both x and y ex: apply(1, 1)  
     * @param {EmagJS.Core.Math.Vector} - applies a vector force ex: apply(new Vector(1, 1))
     * 
     * @return {void}
     */
    applyForce() {

        let forceX = 0
        let forceY = 0

        // if applying a scalar force
        if (arguments.length > 1) {
            forceX = arguments[0]
            forceY = arguments[1]
        } else {
            // applying a vector force
            forceX = arguments[0].x
            forceY = arguments[0].y
        }

        let invMass = this.invMass

        // integrates force to acceleration
        this.acceleration.x += forceX * invMass;
        this.acceleration.y += forceY * invMass;

    }

    applyTorque(torque) {
        this.angularAcceleration += torque * this.invInertia
    }

    /**
     * Numerical integration
     * 
     * Semi-implicit Euler - integrates velocity before position
     * @see {@link https://en.wikipedia.org/wiki/Semi-implicit_Euler_method}
     * 
     * @param {number} dt - fixed delta time
     */
    update(dt = 1) {

        // integrates velocity
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;

        // integrates position
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

        // clear forces been applied
        this.acceleration.x = 0;
        this.acceleration.y = 0;

        this.representation.position.x = this.position.x
        this.representation.position.y = this.position.y

        // angular velocity

        this.angularVelocity += this.angularAcceleration * dt
        this.angle += this.angularVelocity * dt

        this.angularAcceleration = 0

        this.representation.angle = this.angle

        this.angularVelocity *= this.angularFriction

    }

}