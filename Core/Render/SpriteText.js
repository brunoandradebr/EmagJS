class SpriteText {

    constructor(spriteFont) {

        this.spriteFont = spriteFont

        this.letters = []

        this._charPool = new ObjectPool(() => {
            let char = new Sprite(new Vector(0, 0), this.spriteFont.width, this.spriteFont.height, 'transparent', 0)
            char.image = this.spriteFont.image.clone()
            // animation - TODO - move to dialog class
            char.interpolation = 0
            char.tween = new Tween(char)
            char.tween.animate({ interpolation: 1 })
            return char
        }, (char) => {
            char.imageOffsetX = 0
            char.imageOffsetY = 0
            char.imageOffsetWidth = this.spriteFont.width
            char.imageOffsetHeight = this.spriteFont.height
            // animation - TODO - move to dialog class
            char.tween.animations[0].ease = 'elasticOut'
            // TODO - delay based on string length not this.letters
            char.tween.animations[0].delay = (this.letters.length) * 80 // letter spawn speed
            char.tween.animations[0].duration = 1400 // letter animation time - can be a big number
            char.tween.resetAnimations()

            return char
        })

    }

    write(string, x, y, width, height) {

        let fontScaleFactor = width / this.spriteFont.width
        let letterPos = 0
        let nextRecoil = 0

        string.split('').map((char) => {

            letterPos++

            if (char == '\n') {
                y += height
                letterPos = 0
            }

            if (this.spriteFont.map[char]) {

                let letter = this._charPool.create()

                letter.position.x = ((x - nextRecoil * fontScaleFactor) + (letterPos * width))
                letter.position.y = (y * 1.3) + height
                
                letter.width = letter.initialWidth = width
                letter.height = letter.initialHeight = height
                letter.imageOffsetX = this.spriteFont.map[char].x
                letter.imageOffsetY = this.spriteFont.map[char].y
                letter.imageOffsetWidth = this.spriteFont.width
                letter.imageOffsetHeight = this.spriteFont.height

                this.letters.push(letter)

                nextRecoil += this.spriteFont.map[char].recoil

            }

            if (char == '\n') {
                nextRecoil = 0
            }
            if (char == ' ') {
                nextRecoil += this.spriteFont.width * 0.5
            }

        })

    }

    clear() {
        this.letters.map((letter) => {
            this._charPool.destroy(letter)
        })
        this.letters.length = 0
    }

    draw(graphics) {

        this.letters.map((letter) => {

            // animation - TODO - move to dialog class
            letter.tween.play()
            
            letter.width = letter.initialWidth * letter.interpolation
            letter.height = letter.initialHeight * letter.interpolation

            letter.draw(graphics)
        })

    }

}