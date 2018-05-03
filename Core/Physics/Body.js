/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Physics body
 */
class Body {

    /**
     * 
     * @param {EmagJs.Core.Render.Shape | EmagJs.Core.Render.Sprite} representation - Visual representation
     */
    constructor(representation) {

        /**
         * @type {EmagJs.Core.Math.Vector}
         */
        this.acceleration = new Vector();

        /**
         * @type {EmagJs.Core.Math.Vector}
         */
        this.velocity = new Vector();

        /**
         * @type {EmagJs.Core.Math.Vector}
         */
        this.position = new Vector();

        /**
         * @type {number}
         */
        this.mass = 1;

        /**
         * @type {number}
         */
        this.bounce = 0.5;

        /**
         * @type {EmagJs.Core.Render.Shape | EmagJs.Core.Render.Sprite}
         */
        this.representation = representation;

        // initialize position based on it's representation
        this.position.x = this.representation.position.x
        this.position.y = this.representation.position.y

    }

    /**
     * Applies force to it
     * 
     * @param {number}                  - scalar force, applies to both x and y ex: apply(1, 1)  
     * @param {EmagJs.Core.Math.Vector} - applies a vector force ex: apply(new Vector(1, 1))
     * 
     * @return {void}
     */
    applyForce() {

        let force

        // if applying a scalar force
        if (arguments.length > 1) {
            force = new Vector(arguments[0], arguments[1])
        } else {
            // applying a vector force
            force = arguments[0]
        }

        // get inverse mass
        let mass = this.mass > 0 ? 1 / this.mass : 0;

        // integrates force to acceleration
        this.acceleration.x += force.x * mass;
        this.acceleration.y += force.y * mass;

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

    }

}