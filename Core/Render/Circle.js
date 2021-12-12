/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Circle
 */
class Circle {

    /**
     * 
     * @param {EmagJS.Core.Math.Vector} position 
     * @param {number} radius 
     * @param {string} fillColor 
     * @param {number} lineWidth 
     * @param {string} lineColor 
     */
    constructor(position = new Vector(0, 0), radius = 25, fillColor = '#f46', lineWidth = 1, lineColor = 'black') {

        /**
         * @type {EmagJS.Core.Math.Vector}
         */
        this.position = position

        /**
         * @type {number}
         */
        this.radius = radius

        /**
         * @type {number}
         */
        this.angle = 0

        /**
         * transformation matrix
         * 
         * @type {EmagJS.Core.Math.Matrix}
         */
        this.matrix = new Matrix()

        /**
         * @type {string}
         */
        this.fillColor = fillColor

        /**
         * @type {number}
         */
        this.lineWidth = lineWidth

        /**
         * @type {string}
         */
        this.lineColor = lineColor

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
        this.shadowOffsetX = 5

        /**
         * @type {number}
         */
        this.shadowOffsetY = 5

        /**
         * @type {number}
         */
        this.alpha = 1

    }

    /**
     * get it's bounding box object
     * 
     * @return {object}
     */
    getBoundingBox(offsetWidth = 0, offsetHeight = 0) {

        let startX = this.position.x - this.radius
        let startY = this.position.y - this.radius
        let centerX = this.position.x
        let centerY = this.position.y
        let width = this.radius * 2
        let height = this.radius * 2

        return {
            startX: startX - offsetWidth * 0.5,
            startY: startY - offsetHeight * 0.5,
            centerX: centerX,
            centerY: centerY,
            width: width + (offsetWidth * 0.5),
            height: height + (offsetHeight * 0.5)
        }
    }

    rotateZ(angle) {
        this.matrix.rotateZ(-angle)
        this.angle = -angle
    }

    scale(xScale, yScale = xScale) {
        this.matrix.scale(xScale, yScale)
    }

    contains(point) {
        const dx = point.x - this.position.x
        const dy = point.y - this.position.y
        const distance = dx * dx + dy * dy
        const radii = this.radius * this.radius
        return (distance <= radii)
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics 
     * 
     * @return {void}
     */
    draw(graphics) {

        // save graphics state
        graphics.save()

        // alpha
        graphics.globalAlpha = this.alpha

        // composite operation
        graphics.globalCompositeOperation = this.compositeOperation || 'none'

        // fill style
        graphics.fillStyle = this.fillColor
        // line width
        graphics.lineWidth = this.lineWidth
        // line color
        graphics.strokeStyle = this.lineColor

        // shadow
        if (this.shadowBlur != undefined) {
            graphics.shadowBlur = this.shadowBlur
            graphics.shadowColor = this.shadowColor
            graphics.shadowOffsetX = this.shadowOffsetX
            graphics.shadowOffsetY = this.shadowOffsetY
        }

        // transformation matrix
        let m = this.matrix.m
        graphics.transform(m[0][0], m[0][1], m[1][0], m[1][1], this.position.x, this.position.y)

        // draw circle
        graphics.beginPath()
        graphics.arc(0, 0, this.radius, 0, Math.PI * 2)
        graphics.moveTo(0, 0)
        graphics.lineTo(this.radius, 0)
        graphics.closePath()

        // fill circle
        graphics.fill()

        // draw line
        if (this.lineWidth) {
            // do not shadow line
            graphics.shadowColor = 'transparent'
            // stroke!
            graphics.stroke()
        }

        // restore graphics state
        graphics.restore()

    }

}