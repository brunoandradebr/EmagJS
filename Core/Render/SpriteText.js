/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */

/**
 * Sprite Text
 */
class SpriteText {

    /**
     * 
     * @param {EmagJs.Core.Render.SpriteFont} spriteFont 
     */
    constructor(spriteFont) {

        /**
         * sprite font that holds a sprite sheet with letters
         */
        this.spriteFont = spriteFont

        /**
         * all created sprite letters to render
         */
        this.letters = []

        /**
         * sprite characters pool
         */
        this.letterPool = new ObjectPool(() => {
            let letter = new Sprite(new Vector(0, 0), this.spriteFont.width, this.spriteFont.height, 'transparent', 0)
            letter.image = this.spriteFont.image.clone()
            return letter
        }, (letter) => {
            // reset implemented in write method
            return letter
        })

    }

    /**
     * Creates all sprite letters based on passed string
     * 
     * @param {string} string 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height
     * 
     * @return {void} 
     */
    write(string, x, y, width, height, maxWidth = 0) {

        // calculates font recoil scale factor based on passed width
        // to correct positon
        let recoilScaleFactor = width / this.spriteFont.width

        // letter horizontal position
        let xPosition = 0
        // next letter recoil number
        let nextRecoil = 0

        let lastLetterPosition = 0

        // read each character
        string.split('').map((char) => {

            // if is set max width and letter passed it
            if (maxWidth && lastLetterPosition > x + maxWidth && char != ' ') {
                xPosition = nextRecoil = 0
                y += height
            }

            // increment x position
            xPosition++

            // if new line, increment y and reset x position and recoil
            if (char == '\n') {
                xPosition = nextRecoil = 0
                y += height
            }

            // increment recoil when white space
            if (char == ' ') {
                nextRecoil += this.spriteFont.width * 0.5
            }

            // if there is a sprite letter
            if (this.spriteFont.map[char]) {

                let spriteFont = this.spriteFont.map[char]

                // create or get from pool
                let letter = this.letterPool.create()
                // position letter
                letter.position.x = (((x - (width * 0.5) + 0/*padding left*/) - (nextRecoil * recoilScaleFactor)) + (xPosition * 1/*letter space*/ * width))
                letter.position.y = (y + (height * 0.5) + 0/*padding top*/) + (spriteFont.descend * recoilScaleFactor)
                // letter size
                letter.width = width
                letter.height = height
                // set letter image crop
                letter.imageOffsetX = spriteFont.x
                letter.imageOffsetY = spriteFont.y
                letter.imageOffsetWidth = this.spriteFont.width
                letter.imageOffsetHeight = this.spriteFont.height
                // add created letter to letters container
                this.letters.push(letter)

                // increment recoil to position next letter
                nextRecoil += spriteFont.recoil

                lastLetterPosition = letter.position.x

            }

        })
    }

    /**
     * Clear letter container
     * 
     * @return {void}
     */
    clear() {

        // destroy all created sprite letter
        this.letters.map((letter) => {
            this.letterPool.destroy(letter)
        })

        // clear letter container
        this.letters.length = 0
    }

    /**
     * Draw all letters
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        this.letters.map((letter) => {
            letter.draw(graphics)
        })

    }

}