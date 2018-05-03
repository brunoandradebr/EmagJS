/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Line
 */
class Line {

    /**
     * 
     * @param {EmagJs.Core.Math.Vector} start 
     * @param {EmagJs.Core.Math.Vector} end 
     */
    constructor(start = new Vector(), end = new Vector()) {

        /**
         * @type {EmagJs.Core.Math.Vector}
         */
        this.start = start;

        /**
         * @type {EmagJs.Core.Math.Vector}
         */
        this.end = end;

        /**
         * @type {string}
         */
        this.lineColor = 'black'

        /**
         * @type {number}
         */
        this.lineWidth = 1

    }

    /**
     * Creates a new line from an angle - in degrees
     * 
     * @param {number} angle 
     * @param {number} length 
     * @param {EmagJs.Core.Math.Vector} start
     * 
     * @return {EmagJs.Core.Render.Line} 
     */
    static fromAngle(angle = 0, length = 50, start = new Vector()) {

        let end = start.clone().add(Vector.fromAngle(angle, length));

        return new Line(start, end);

    }

    /**
     * Rotates itself by an angle in degrees
     * 
     * @param {number} angle 
     */
    rotate(angle) {

        let plane = this.plane.rotate(angle);

        this.end.update(this.start.clone().add(plane));

    }

    /**
     * get plane - line's plane
     * 
     * @return {EmagJs.Core.Math.Vector} 
     */
    get plane() {
        return this.end.clone().subtract(this.start);
    }

    /**
     * get normal - line's normal
     * 
     * @return {EmagJs.Core.Math.Vector} 
     */
    get normal() {
        return this.plane.leftNormal;
    }

    /**
     * get length - line's length
     * 
     * @return {number} 
     */
    get length() {
        return this.plane.length;
    }

    /**
     * get lengthSquared - line's squared length
     * 
     * @return {number} 
     */
    get lengthSquared() {
        return this.plane.lengthSquared;
    }

    /**
     * get angle - line's angle
     * 
     * @return {number} 
     */
    get angle() {
        return this.plane.angle;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void} 
     */
    draw(graphics) {

        graphics.strokeStyle = this.lineColor
        graphics.lineWidth = this.lineWidth
        graphics.beginPath();
        graphics.moveTo(this.start.x, this.start.y);
        graphics.lineTo(this.end.x, this.end.y);
        graphics.stroke();

    }

}