/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Circle
 */
class Circle {

    /**
     * 
     * @param {EmagJs.Core.Math.Vector} position 
     * @param {number} radius 
     * @param {string} fillColor 
     * @param {number} lineWidth 
     * @param {string} lineColor 
     */
    constructor(position = new Vector(0, 0), radius = 25, fillColor = '#f46', lineWidth = 1, lineColor = 'black') {

        /**
         * @type {EmagJs.Core.Math.Vector}
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

        let halfLine = this.lineWidth * 0.5 | 0

        graphics.arc(this.position.x + halfLine, this.position.y + halfLine, this.radius, 0, Math.PI * 2)

        graphics.fill()

        if (this.lineWidth)
            graphics.stroke()

        graphics.restore()

    }

}