/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */

/**
 * Sprite Font
 */
class SpriteFont {

    /**
     * 
     * @param {HTMLImageElement} sprite 
     * @param {number} width  - original letter width
     * @param {number} height - original letter height
     * @param {string} chars  - all possible characters
     */
    constructor(sprite, width, height, chars) {

        /**
         * creates a image processor object
         */
        this.image = new ImageProcessor(sprite)

        /**
         * letter width
         */
        this.width = width

        /**
         * letter height
         */
        this.height = height

        /**
         * all possible characters to be mapped
         */
        this.chars = chars || `ABCDEFGHIJKLM\nNOPQRSTUVWXYZ\nabcdefghijklm\nnopqrstuvwxyz\n1234567890+-=\n.,:;!?´~'\"@#$\n&¢£€*()<>%≪≫/`

        /**
         * sprite to data map
         * 
         *  ex : {
         *          x: 108, // letter x position in sprite
         *          y: 56,  // letter x position in sprite
         *          recoil: 4 // letter white space
         *       }
         */
        this.map = []

        this.mapChars()

    }

    /**
     * Maps all letters
     * 
     * @return {void}
     */
    mapChars() {

        this.map = []

        // character position x
        let x = 0
        // character position y
        let y = 0

        // read each character
        for (let i = 0; i < this.chars.length; i++) {

            // current character
            let char = this.chars[i]

            // letter sprite position x
            let posX = x * this.width
            // letter sprite position y
            let posY = y * this.height

            // crop letter from sprite sheet
            let letterPixels = this.image.clone().crop(posX, posY, this.width, this.height)
            // letter pixel array
            let letterPixelsArray = letterPixels.imageArray
            // letter pixel array length
            let letterPixelsLength = letterPixelsArray.length

            // pixel horizontal position
            let pixelPosition = 0
            // extreme horizontal pixel
            let extremePixel = -Infinity

            // read each letter pixel
            for (let i = 0; i < letterPixelsLength; i += 4) {

                // pixel alpha channel
                let alpha = letterPixelsArray[i + 3];

                // if pixel is visible
                if (alpha > 0) {

                    // finds pixel position in x axis
                    pixelPosition = (i / 4) % this.width

                    // updates extreme pixel
                    if (pixelPosition >= extremePixel) {
                        extremePixel = pixelPosition
                    }
                }
            }

            // calculates letter recoil factor -2 to avoid too close letters
            let recoil = ((this.width - extremePixel) - 2)

            // avoid line break
            if (char != '\n') {

                // add mapped letter
                this.map[char] = {
                    x: posX,
                    y: posY,
                    recoil: recoil
                }

            }

            // increment x char position
            x++

            // if new line, reset x position and increment y position
            if (char == '\n') {
                y++
                x = 0
            }
            
        }

    }

}