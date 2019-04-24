/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Text
 */
class Text {

    /**
     * 
     * @param {string}                  text 
     * @param {EmagJS.Core.Math.Vector} position 
     * @param {string}                  font 
     * @param {string}                  color 
     * @param {number}                  size 
     */
    constructor(text, position, font, color, size, lineWidth, lineColor) {

        /**
         * @type {string}
         */
        this.text = text || ''

        /**
         * @type {EmagJS.Core.Math.Vector}
         */
        this.position = position || new Vector(0, 0)

        /**
         * @type {string}
         */
        this.font = font || 'Alagard'

        /**
         * @type {string}
         */
        this.color = color || 'black'

        /**
         * @type {number}
         */
        this.size = size || 42

        /**
         * @type {number}
         */
        this.lineWidth = lineWidth || 0

        /**
         * @type {string}
         */
        this.lineColor = lineColor || 'black'

        /**
         * @type {number}
         */
        this.shadowBlur = 0

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

        this.tmpGraphics = document.createElement('canvas').getContext('2d')

    }

    /**
     * Measures text width
     * 
     * @return {number}
     */
    get width() {

        this.tmpGraphics.font = this.size + 'px ' + this.font

        return this.tmpGraphics.measureText(this.text).width
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void} 
     */
    draw(graphics) {

        this.lines = this.text.split('\n')

        graphics.save()

        graphics.globalAlpha = this.alpha

        // shadow
        if (this.shadowBlur) {
            graphics.shadowBlur = this.shadowBlur
            graphics.shadowColor = this.shadowColor
            graphics.shadowOffsetX = this.shadowOffsetX
            graphics.shadowOffsetY = this.shadowOffsetY
        }

        // pixelated
        graphics.mozImageSmoothingEnabled = false
        graphics.webkitImageSmoothingEnabled = false
        graphics.msImageSmoothingEnabled = false
        graphics.imageSmoothingEnabled = false

        graphics.font = this.size + 'px ' + this.font
        graphics.lineWidth = this.lineWidth

        if (this.lineWidth) {
            graphics.strokeStyle = this.lineColor
            this.lines.map((line, i) => {
                graphics.strokeText(line, this.position.x, this.position.y + i * this.size)
            })
        }

        if (this.color != 'transparent') {
            graphics.fillStyle = this.color
            this.lines.map((line, i) => {
                graphics.fillText(line, this.position.x, this.position.y + i * this.size)
            })
        }

        graphics.restore()

    }

}