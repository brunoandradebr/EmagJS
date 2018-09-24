class SpriteFont {

    constructor(sprite, width, height) {

        this.image = new ImageProcessor(sprite)

        this.width = width
        this.height = height

        /**
         * all possible chars to be mapped
         */
        this.chars = `ABCDEFGHIJKLM\nNOPQRSTUVWXYZ\nabcdefghijklm\nnopqrstuvwxyz\n1234567890+-=\n.,:;!?´~'\"@#$\n&¢£€*()<>%≪≫/`

        this.map = []

        this.mapChars()

    }

    mapChars() {

        let x = 0
        let y = 0

        for (let i = 0; i < this.chars.length; i++) {

            let char = this.chars[i]

            let posX = x * this.width
            let posY = y * this.height

            // finds each letter recoil
            let letterPixels = this.image.clone().crop(posX, posY, this.width, this.height)
            let letterPixelsArray = letterPixels.imageArray
            let letterPixelsLength = letterPixelsArray.length

            let pixelPosition = 0
            let extremePixel = -Infinity

            // read each pixel
            for (let i = 0; i < letterPixelsLength; i += 4) {

                // pixel alpha channel
                let alpha = letterPixelsArray[i + 3];

                // if pixel is visible
                if (alpha > 0) {

                    // finds pixel position in x axis
                    pixelPosition = (i / 4) % this.width

                    if (pixelPosition >= extremePixel) {
                        extremePixel = pixelPosition
                    }

                }
            }

            // -2 to avoid too close letters
            let recoil = ((this.width - extremePixel) - 2)

            if (char != '\n') {
                this.map[char] = {
                    x: posX,
                    y: posY,
                    recoil: recoil
                }
            }

            x++

            if (char == '\n') {
                y++
                x = 0
            }
        }

        //trace(this.map)

    }

}