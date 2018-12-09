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

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics 
     * 
     * @return {void}
     */
    draw(graphics) {

        graphics.save()
        graphics.beginPath()
        graphics.fillStyle = this.fillColor
        graphics.strokeStyle = this.lineColor
        graphics.lineWidth = this.lineWidth

        graphics.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)

        graphics.fill()

        if (this.lineWidth)
            graphics.stroke()

        graphics.restore()

    }

}