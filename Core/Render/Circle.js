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

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics 
     * 
     * @return {void}
     */
    draw(graphics) {

        graphics.save()

        graphics.globalAlpha = this.alpha

        graphics.globalCompositeOperation = this.compositeOperation || 'none'

        graphics.fillStyle = this.fillColor
        graphics.strokeStyle = this.lineColor
        graphics.lineWidth = this.lineWidth

        graphics.beginPath()
        graphics.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)

        graphics.fill()

        if (this.lineWidth)
            graphics.stroke()

        graphics.restore()

    }

}