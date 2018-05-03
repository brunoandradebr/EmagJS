/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Vector 2D
 */
class Vector {

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x = 0, y = 0) {

        /**
         * @type {number}
         */
        this.x = x;

        /**
         * @type {number}
         */
        this.y = y;

    }

    /**
     * Creates a vector from an angle
     * 
     * @param {number}  angle - angle in dregrees
     * @param {number} length - vector length
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    static fromAngle(angle, length = 50) {
        return new Vector(Math.cos(angle * toRad) * length, -Math.sin(angle * toRad) * length);
    }

    /**
     * Creates a vector from an array
     * 
     * @param {array} arr
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    static fromArray(arr) {
        return new Vector(arr[0], arr[1])
    }

    /**
     * Creates a random vector
     * 
     * @param {number} length 
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    static random(length = 1) {
        return this.fromAngle((Math.random() * PI * 2) * toDegree, length);
    }

    /**
     * Calculates the minimum angle between two vectors
     * 
     * @param {EmagJs.Core.Math.Vector} v1 
     * @param {EmagJs.Core.Math.Vector} v2
     * 
     * @return {number} 
     */
    static angleBetween(v1, v2) {

        let dot = v1.clone().normalize.dot(v2.clone().normalize);

        return Math.acos(dot);

    }

    /**
     * Clones a vector
     * 
     * @param {EmagJs.Core.Math.Vector} to
     * 
     * @return {EmagJs.Core.Math.Vector | void}
     */
    clone(to = null) {
        if (to) {
            to.x = this.x;
            to.y = this.y;
        } else {
            return new Vector(this.x, this.y);
        }
    }

    /**
     * Updates a vector by another vector or by two scalars
     * 
     * @param {EmagJs.Core.Math.Vector} v 
     * @param {number} ...
     * 
     * @return {EmagJs.Core.Math.Vector} 
     */
    update(v = new Vector(), ...[]) {

        if (arguments.length > 1) {

            if (arguments[0] != null)
                this.x = arguments[0];

            if (arguments[1] != null)
                this.y = arguments[1];
        } else {
            if (arguments[0].constructor.name == 'Vector') {
                this.x = v.x;
                this.y = v.y;
            } else {
                this.x = arguments[0];
            }
        }

        return this;
    }

    /**
     * Adds a vector by another vector
     * 
     * @param {EmagJs.Core.Math.Vector} v 
     * @param {EmagJs.Core.Math.Vector} to 
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    add(v, to = this) {

        to.x = this.x + v.x;
        to.y = this.y + v.y;

        return to;
    }

    /**
    * Adds a scalar to vector
    * 
    * @param {number} s 
    * @param {EmagJs.Core.Math.Vector} to
    * 
    * @return {EmagJs.Core.Math.Vector} 
    */
    addScalar(s, to = this) {
        to.x = this.x + s;
        to.y = this.y + s;
        return to;
    }

    /**
     * Subtracts a vector by another vector
     * 
     * @param {EmagJs.Core.Math.Vector} v 
     * @param {EmagJs.Core.Math.Vector} to
     * 
     * @return {EmagJs.Core.Math.Vector} 
     */
    subtract(v, to = this) {
        to.x = this.x - v.x;
        to.y = this.y - v.y;
        return to;
    }

    /**
     * Subtracts a vector by a scalar
     * 
     * @param {number} s 
     * @param {EmagJs.Core.Math.Vector} to 
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    subtractScalar(s, to = this) {
        to.x = this.x - s;
        to.y = this.y - s;
        return to;
    }

    /**
     * Multiplies a vector by another vector
     * 
     * @param {EmagJs.Core.Math.Vector} v 
     * @param {EmagJs.Core.Math.Vector} to 
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    multiply(v, to = this) {
        to.x = this.x * v.x;
        to.y = this.y * v.y;
        return to;
    }

    /**
     * Multiplies a vector by a scalar
     * 
     * @param {number} s 
     * @param {EmagJs.Core.Math.Vector} to
     * 
     * @return {EmagJs.Core.Math.Vector} 
     */
    multiplyScalar(s, to = this) {
        to.x = this.x * s;
        to.y = this.y * s;
        return to;
    }

    /**
     * Divides a vector by another vector
     * 
     * @param {EmagJs.Core.Math.Vector} v 
     * @param {EmagJs.Core.Math.Vector} to 
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    divide(v, to = this) {
        to.x = this.x / v.x;
        to.y = this.y / v.y;
        return to;
    }

    /**
     * Divides a vector by a scalar
     * 
     * @param {number} s 
     * @param {EmagJs.Core.Math.Vector} to 
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    divideScalar(s, to = this) {
        to.x = this.x / s;
        to.y = this.y / s;
        return to;
    }

    /**
     * Calculates the dot product between two vectors
     * 
     * @param {EmagJs.Core.Math.Vector} v
     * 
     * @return {number} 
     */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * Calculates the cross product between two vectors - same as perpendicular product
     * 
     * @param {EmagJs.Core.Math.Vector} v 
     * 
     * @return {number}
     */
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    /**
     * Rotates a vector by an angle(in degrees)
     * 
     * @param {number} angle 
     * @param {number} startAngle 
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    rotate(angle, startAngle = 0) {

        let length = this.length;

        let _angle = startAngle + angle;

        this.x = Math.cos(_angle * toRad);
        this.y = -Math.sin(_angle * toRad);

        this.multiplyScalar(length);

        return this;

    }

    /**
     * Projects a vector into another
     * 
     * @param {EmagJs.Core.Math.Vector} v 
     * @param {EmagJs.Core.Math.Vector} to
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    project(v, to = new Vector()) {

        let vNormal = v.clone().normalize;

        let mag = this.dot(vNormal);

        to.x = vNormal.x * mag;
        to.y = vNormal.y * mag;

        return to;

    }

    /**
     * get reverse - reverses vector
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    get reverse() {
        this.x *= -1;
        this.y *= -1;
        return this;
    }

    /**
     * get length - calculates vector's length
     * 
     * @return {number}
     */
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * get lengthSquared - calculates vector's squared length
     * 
     * @return {number}
     */
    get lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * get normalize - unit vector
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    get normalize() {
        return this.multiplyScalar(1 / this.length);
    }

    /**
     * get leftNormal - vector's left normal
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    get leftNormal() {
        return new Vector(this.y, -this.x);
    }

    /**
     * get rightNormal - vector's right normal
     * 
     * @return {EmagJs.Core.Math.Vector}
     */
    get rightNormal() {
        return new Vector(-this.y, this.x);
    }

    /**
     * get angle - vector's angle in radians
     * 
     * @return {number}
     */
    get angle() {

        let angle = -Math.atan2(this.y, this.x);

        if (angle < 0) angle = angle + (PI * 2);

        return angle;

    }

    /**
     * Draw the vector
     * 
     * @param {CanvasRenderingContext2D} graphics 
     * @param {object}                   definition
     * 
     * @return {void}
     */
    debug(graphics, definition = {}) {

        let option = {
            lineWidth: 1,
            lineColor: 'black',
            center: new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y)
        }

        Object.assign(option, definition);

        graphics.strokeStyle = option.lineColor;
        graphics.lineWidth = option.lineWidth;

        graphics.beginPath();
        graphics.moveTo(option.center.x, option.center.y);
        graphics.lineTo(option.center.x + this.x, option.center.y + this.y);
        graphics.stroke();

    }
}