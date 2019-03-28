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

        // default sprite font
        if (!spriteFont) {
            spriteFont = new SpriteFont(core.files.joy_font, 4, 6, `abcdefghijklmnopqrstuvwxyz1234567890.:-+/%!?><'"`)
        } else if (spriteFont && typeof spriteFont == 'string') {
            switch (spriteFont) {
                case 'JOY': case 'joy': spriteFont = new SpriteFont(core.files.joy_font, 4, 6, `abcdefghijklmnopqrstuvwxyz1234567890.:-+/%!?><'"`); break;
                case 'JOY_BORDER': case 'joy_border': spriteFont = new SpriteFont(core.files.joy_font_border, 6, 8, `abcdefghijklmnopqrstuvwxyz1234567890.:-+/%!?><'"`); break;
                case 'JOY_BORDER2': case 'joy_border2': spriteFont = new SpriteFont(core.files.joy_font_border2, 6, 8, `abcdefghijklmnopqrstuvwxyz1234567890.:-+/%!?><'"`); break;
                case 'ALAGARD': case 'alagard': spriteFont = new SpriteFont(core.files.alagard_font, 10, 10, null, ['g', 'j', 'p', 'q', 'y', ',']); break;
            }
        }

        /**
         * sprite font that holds a sprite sheet with letters
         */
        this.spriteFont = spriteFont

        /**
         * where to render
         */
        this.position = new Vector(10, 10)

        /**
         * sprite size - based on sprite font size
         */
        this.size = spriteFont.width

        /**
         * max width to render letters
         */
        this.width = 0

        /**
         * vertical space between lines
         */
        this.lineHeight = 2

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
            letter.initialPosition = letter.position.clone()
            letter.interpolation = 0
            letter.alreadyRendered = false
            letter.animation = new Tween(letter)
            letter.animation.animate({ interpolation: 1 })
            return letter
        }, (letter) => {
            letter.alreadyRendered = false
            letter.animation.animations[0].ease = 'cubicIn'
            letter.animation.animations[0].delay = (this.letters.length) * 80 // letter spawn speed
            letter.animation.animations[0].duration = 200 // letter animation time - can be a big number
            letter.animation.resetAnimations()
            return letter
        })

        // pre create all sprite letter
        this.write(this.spriteFont.chars)
        this.clear()

    }

    /**
     * Set text content - clear before create new letters (from pool)
     */
    set text(content = '') {
        this.clear()
        this.write(content, 0, 0, this.spriteFont.width, this.spriteFont.height, this.width, this.lineHeight)
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
    write(string, x, y, width, height, maxWidth = 0, lineHeight = 2) {

        let currentY, startY, currentX, startX

        currentX = startX = x + width + 3
        currentY = startY = y + height * 0.5 + 3 + lineHeight

        // next letter recoil
        let nextRecoil = 0

        string.split(' ').map((word) => {

            if (currentX + (word.length * width) > startX + maxWidth + nextRecoil) {
                currentX = startX
                currentY += height + lineHeight
                nextRecoil = 0
            }

            word.split('').map((char) => {

                // if there is a sprite letter
                if (this.spriteFont.map[char]) {

                    let spriteFont = this.spriteFont.map[char]

                    // create or get from pool
                    let letter = this.letterPool.create()
                    // position letter
                    letter.position.x = letter.initialPosition.x = currentX - nextRecoil
                    letter.position.y = letter.initialPosition.y = currentY + spriteFont.descend
                    // letter size
                    letter.width = letter.initialWidth = width
                    letter.height = letter.initialHeight = height
                    // set letter image crop
                    letter.imageOffsetX = spriteFont.x
                    letter.imageOffsetY = spriteFont.y
                    letter.imageOffsetWidth = this.spriteFont.width
                    letter.imageOffsetHeight = this.spriteFont.height
                    // add created letter to letters container
                    this.letters.push(letter)

                    // increment recoil to position next letter
                    nextRecoil += spriteFont.recoil

                    currentX += width

                }

            })

            // increment recoil when white space
            nextRecoil -= this.spriteFont.width * 0.5

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
            letter.position.x = this.position.x + letter.initialPosition.x
            letter.position.y = this.position.y + letter.initialPosition.y
            letter.animation.play()
            letter.draw(graphics)
        })

    }

}