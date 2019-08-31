/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Line
 */
class Line {

    /**
     * 
     * @param {EmagJS.Core.Math.Vector} start 
     * @param {EmagJS.Core.Math.Vector} end 
     */
    constructor(start = new Vector(), end = new Vector()) {

        /**
         * @type {EmagJS.Core.Math.Vector}
         */
        this.start = start;

        /**
         * @type {EmagJS.Core.Math.Vector}
         */
        this.end = end;

        /**
         * @type {number}
         */
        this.alpha = 1

        /**
         * @type {string}
         */
        this.lineColor = 'black'

        /**
         * @type {number}
         */
        this.lineWidth = 1

        /**
         * @type {string}
         */
        this.lineCap = 'butt'

        /**
         * @type {array<number>}
         */
        this.dashPattern = []

        /**
         * @type {number}
         */
        this.dashOffset = 0

        /**
         * @type {number}
         */
        this.shadowBlur = undefined

        /**
         * @type {string}
         */
        this.shadowColor = 'black'

        /**
         * @type {number}
         */
        this.shadowOffsetX = 0

        /**
         * @type {number}
         */
        this.shadowOffsetY = 0

    }

    /**
     * Creates a new line from an angle - in degrees
     * 
     * @param {number} angle 
     * @param {number} length 
     * @param {EmagJS.Core.Math.Vector} start
     * 
     * @return {EmagJS.Core.Render.Line} 
     */
    static fromAngle(angle = 0, length = 50, start = new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y)) {

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
     * Scales
     * 
     * @param {number} size
     * 
     * @return {void} 
     */
    scale(size) {

        let plane = this.plane.normalize

        let scaled = plane.multiplyScalar(size)

        this.end.x = this.start.x + scaled.x
        this.end.y = this.start.y + scaled.y

    }

    /**
     * get line center
     * 
     * @return {EmagJS.Core.Math.Vector}
     */
    get center() {
        return this.start.clone().add(this.plane.multiplyScalar(0.5))
    }

    /**
     * get plane - line's plane
     * 
     * @return {EmagJS.Core.Math.Vector} 
     */
    get plane() {
        return this.end.clone().subtract(this.start);
    }

    /**
     * get normal - line's normal
     * 
     * @return {EmagJS.Core.Math.Vector} 
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
     * Clone
     * 
     * @return {EmagJS.Core.Render.Line}
     */
    clone() {

        let clone = new Line(this.start.clone(), this.end.clone())

        clone.lineWidth = this.lineWidth
        clone.lineColor = this.lineColor
        clone.lineCap = this.lineCap
        clone.dashPattern = this.dashPattern
        clone.dashOffset = this.dashOffset
        clone.shadowBlur = this.shadowBlur
        clone.shadowColor = this.shadowColor
        clone.shadowOffsetX = this.shadowOffsetX
        clone.shadowOffsetY = this.shadowOffsetY

        return clone
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void} 
     */
    draw(graphics) {

        // save graphics context
        graphics.save()

        // alpha
        graphics.globalAlpha = this.alpha

        // composite operation
        graphics.globalCompositeOperation = this.compositeOperation || 'none'

        // draw shadow
        if (this.shadowBlur != undefined) {
            graphics.shadowBlur = this.shadowBlur
            graphics.shadowColor = this.shadowColor
            graphics.shadowOffsetX = this.shadowOffsetX
            graphics.shadowOffsetY = this.shadowOffsetY
        }

        // line color
        graphics.strokeStyle = this.lineColor
        // line width
        graphics.lineWidth = this.lineWidth
        // line cap
        graphics.lineCap = this.lineCap

        // begin path
        graphics.beginPath();
        // line dash pattern
        graphics.setLineDash(this.dashPattern)
        // line dash offset
        graphics.lineDashOffset = -this.dashOffset

        graphics.moveTo(this.start.x, this.start.y);
        graphics.lineTo(this.end.x, this.end.y);

        // stroke!
        graphics.stroke()

        // restore graphics context
        graphics.restore()

    }

}