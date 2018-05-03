/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * SpriteSheet
 * 
 * @extends EmagJS.Core.Common.Image.ImageProcessor
 */
class SpriteSheet extends ImageProcessor {

    /**
     * 
     * @param {HTMLImageElement} source 
     * @param {number} frameWidth 
     * @param {number} frameHeight 
     */
    constructor(source, frameWidth, frameHeight) {

        super(source)

        /**
         * Frames pool
         * 
         * @type {array}
         */
        this.frames = []

        /**
         * Frame width
         * 
         * @type {number}
         */
        this.frameWidth = frameWidth

        /**
         * Frame width
         * 
         * @type {number}
         */
        this.frameHeight = frameHeight

        // slices image into frames
        if (this.frameWidth && this.frameHeight) {
            for (let y = 0; y < this.height; y += this.frameHeight) {
                for (let x = 0; x < this.width; x += this.frameWidth) {

                    let frame = {
                        x: x,
                        y: y,
                        width: this.frameWidth,
                        height: this.frameHeight
                    }

                    this.frames.push(frame)

                }
            }
        }

    }

    /**
     * Clone itself
     * 
     * @return {EmagJS.Core.Common.Image.SpriteSheet} 
     */
    clone() {

        let clone = new SpriteSheet(this.source)

        clone.frames = this.frames
        clone.frameWidth = this.frameWidth
        clone.frameHeight = this.frameHeight

        return clone

    }

}