class DialogSystem extends SpriteText {

    constructor(spriteFont, position = new Vector(0, 0), width = 200, height = 200, lineHeight = 2) {
        super(spriteFont)

        // dialog properties
        this.width = width
        this.height = height
        this.position = position
        this.alpha = 0

        /**
         * All dialogs
         */
        this.dialogs = []

        /**
         * Current dialog index
         */
        this.currentDialogIndex = -1

        /**
         * Count current dialog rendered letters
         */
        this.renderedLettersCount = 0

        /**
         * Flag - already rendered all letters
         */
        this.talking = false

        /**
         * Dialog line height
         */
        this.lineHeight = lineHeight

        // corner properties
        this.cornerWidth = 4
        this.cornerHeight = 4
        this.cornerFillColor = 'transparent'
        this.cornerLineWidth = 0

        // arrow properties
        this.arrowWidth = 14
        this.arrowHeight = 14
        this.arrowPosition = { x: 0.5, y: 1 }
        this.arrowAngle = 90

        // dialog top left corner
        this.top_left_corner = new Sprite(this.position, this.cornerWidth, this.cornerHeight, this.cornerFillColor, this.cornerLineWidth)
        this.top_left_corner.anchor.x = this.top_left_corner.anchor.y = 0
        this.top_left_corner.image = new ImageProcessor(assets.files.dialog_top_left)
        // dialog top corner
        this.top_corner = new Sprite(new Vector(this.top_left_corner.position.x + this.top_left_corner.width, this.top_left_corner.position.y), this.width, this.cornerHeight, this.cornerFillColor, this.cornerLineWidth)
        this.top_corner.anchor.x = this.top_corner.anchor.y = 0
        this.top_corner.image = new Pattern(assets.files.dialog_top, 'repeat-x')
        // dialog top right corner
        this.top_right_corner = new Sprite(new Vector(this.top_left_corner.position.x + this.top_left_corner.width + this.width, this.top_left_corner.position.y), this.cornerWidth, this.cornerHeight, this.cornerFillColor, this.cornerLineWidth)
        this.top_right_corner.anchor.x = this.top_right_corner.anchor.y = 0
        this.top_right_corner.image = new ImageProcessor(assets.files.dialog_top_right)
        // dialog right corner
        this.right_corner = new Sprite(new Vector(this.top_left_corner.position.x + this.width + this.top_left_corner.width, this.top_left_corner.position.y + this.top_left_corner.height), this.cornerWidth, this.height, this.cornerFillColor, this.cornerLineWidth)
        this.right_corner.anchor.x = this.right_corner.anchor.y = 0
        this.right_corner.image = new Pattern(assets.files.dialog_right, 'repeat-y')
        // dialog bottom right corner
        this.bottom_right_corner = new Sprite(new Vector(this.top_left_corner.position.x + this.width + this.top_left_corner.width, this.top_left_corner.position.y + this.height + this.top_left_corner.height), this.cornerWidth, this.cornerHeight, this.cornerFillColor, this.cornerLineWidth)
        this.bottom_right_corner.anchor.x = this.bottom_right_corner.anchor.y = 0
        this.bottom_right_corner.image = new ImageProcessor(assets.files.dialog_bottom_right)
        // dialog bottom corner
        this.bottom_corner = new Sprite(new Vector(this.top_left_corner.position.x + this.top_left_corner.width, this.top_left_corner.position.y + this.height + this.top_left_corner.height), this.width, this.cornerHeight, this.cornerFillColor, this.cornerLineWidth)
        this.bottom_corner.anchor.x = this.bottom_corner.anchor.y = 0
        this.bottom_corner.image = new Pattern(assets.files.dialog_bottom, 'repeat-x')
        // dialog bottom left corner
        this.bottom_left_corner = new Sprite(new Vector(this.top_left_corner.position.x, this.top_left_corner.position.y + this.height + this.top_left_corner.height), this.cornerWidth, this.cornerHeight, this.cornerFillColor, this.cornerLineWidth)
        this.bottom_left_corner.anchor.x = this.bottom_left_corner.anchor.y = 0
        this.bottom_left_corner.image = new ImageProcessor(assets.files.dialog_bottom_left)
        // dialog left corner
        this.left_corner = new Sprite(new Vector(this.top_left_corner.position.x, this.top_left_corner.position.y + this.top_left_corner.height), this.cornerWidth, this.height, this.cornerFillColor, this.cornerLineWidth)
        this.left_corner.anchor.x = this.left_corner.anchor.y = 0
        this.left_corner.image = new Pattern(assets.files.dialog_left, 'repeat-y')
        // dialog text box
        this.text_box = new Sprite(new Vector(this.top_left_corner.position.x + this.top_left_corner.width, this.top_left_corner.position.y + this.top_left_corner.height), this.width, this.height, 'transparent', 0)
        this.text_box.anchor.x = this.text_box.anchor.y = 0
        this.text_box.image = new Pattern(assets.files.dialog_box)
        // dialog arrow
        this.arrow = new Sprite(new Vector(this.top_left_corner.position.x + this.top_left_corner.width + this.width * this.arrowPosition.x | 0, (this.top_left_corner.position.y + this.top_corner.height + this.bottom_corner.height + this.arrowHeight * 0.5) + this.height * this.arrowPosition.y - 3), this.arrowWidth, this.arrowHeight, 'transparent', 0)
        this.arrow.image = new ImageProcessor(assets.files.dialog_arrow)
        this.arrow.matrix.rotateZ(this.arrowAngle)

        // open animation
        this.openAnimation = new Tween(this)
        this.openAnimation.animate({ alpha: 1 }, 200, 0, 'cubicInOut')
        this.openAnimation.animate({ width: -width + this.arrowWidth }, 0, 0)
        this.openAnimation.animate({ height: -height + this.arrowHeight }, 0, 0)
        this.openAnimation.animate({ width: width - this.arrowWidth }, 800, 100, 'elasticInOut')
        this.openAnimation.animate({ height: height - this.arrowHeight }, 500, 100, 'elasticInOut')

    }

    /**
     * Adds a dialog object
     * 
     * @param {string} text 
     * @param {number} letterWidth 
     * @param {number} letterHeight 
     * @param {number} arrowPoisitionX 
     * @param {bool}   reopen 
     * 
     * @return {void}
     */
    addDialog(text, letterWidth, letterHeight, arrowPoisitionX, reopen = false) {

        // calculate total letter
        let length = ((this.width * this.height) / ((letterWidth * letterHeight) + (5 * 5))) | 0

        // divide text
        let sentenses = text.match(new RegExp('(.|[\r\n]){1,' + length + '}', 'g'))

        // total sentenses
        let totalSentenses = sentenses.length

        // for each sentense, create a dialog object
        sentenses.map((sentense, i) => {

            // to add as more text at each sentense end
            let more = '...'

            // if there is no more sentenses
            if (i == totalSentenses - 1)
                more = ''

            if (i > 0)
                reopen = false

            // add a dialog object to system
            this.dialogs.push({
                text: sentense + more,
                letterWidth: letterWidth,
                letterHeight: letterHeight,
                arrowPoisitionX: arrowPoisitionX,
                reopen: reopen
            })
        })
    }

    /**
     * Create all letters to be drawn
     * 
     * @param {string} string 
     * @param {number} width 
     * @param {number} height
     * 
     * @return {void}
     */
    _write(string, width, height, arrowPoisitionX = 0.5) {

        // clear letters
        this.clear()

        // decides font size, passed or last one
        let fontWidth = width || this._lastTextWidth
        let fontHeight = height || this._lastTextHeight

        this.arrowPosition.x = arrowPoisitionX

        // create letters needed to be drawn
        super.write(string, this.position.x, this.position.y - fontHeight * 0.5, fontWidth, fontHeight, this.width, this.lineHeight)

    }

    /**
     * Show next dialog
     * 
     * @return {void}
     */
    next() {

        // if still talking, skip letters animation
        if (this.talking) {

            this.letters.map((letter) => {
                letter.animation.animations[0].delay = 0
            })

            return false
        }

        // clar all letters
        this.clear()

        this.renderedLettersCount = 0

        // increment current dialog index
        this.currentDialogIndex++

        if (this.currentDialogIndex >= this.dialogs.length) {
            this.currentDialogIndex = 0
            this.reopen()
        }

        // if there is remaining dialog to show
        if (this.dialogs[this.currentDialogIndex]) {

            // current dialog
            let dialog = this.dialogs[this.currentDialogIndex]

            // if reopen
            if (dialog.reopen)
                this.reopen()

            // creates all letters
            this._write(dialog.text, dialog.letterWidth, dialog.letterHeight, dialog.arrowPoisitionX)
        }
    }

    /**
     * Restart open animation
     * 
     * @return {void}
     */
    reopen() {
        this.clear()
        this.openAnimation.resetAnimations()
    }

    /**
     * Update dialog position
     * 
     * @param {number} x 
     * @param {number} y
     * 
     * @return {void}
     */
    updatePosition(x, y) {

        this.position.x = x
        this.position.y = y

        // update ui positions
        this._updateUIPosition(x, y)

        // rewrite actual dialog
        this._write(this.dialogs[this.currentDialogIndex].text, this.dialogs[this.currentDialogIndex].letterWidth, this.dialogs[this.currentDialogIndex].letterHeight, this.dialogs[this.currentDialogIndex].arrowPoisitionX)
    }

    /**
     * Update dialog size
     * 
     * @param {number} width 
     * @param {number} height
     * 
     * @return {void}
     */
    updateSize(width, height) {

        this.width = width
        this.height = height

        // update ui size
        this.text_box.width = width
        this.text_box.height = height
        this.top_corner.width = this.bottom_corner.width = width
        this.left_corner.height = this.right_corner.height = height

        // update ui position
        this._updateUIPosition(this.position.x, this.position.y)

        // rewrite actual dialog
        this._write(this.dialogs[this.currentDialogIndex].text, this.dialogs[this.currentDialogIndex].letterWidth, this.dialogs[this.currentDialogIndex].letterHeight, this.dialogs[this.currentDialogIndex].arrowPoisitionX)

    }

    /**
     * Update UI position
     * 
     * @param {number} x 
     * @param {number} y
     * 
     * @return {void}
     */
    _updateUIPosition(x, y) {
        this.top_corner.position.update(x + this.top_left_corner.width, y)
        this.top_right_corner.position.update(x + this.width + this.top_left_corner.width, y)
        this.right_corner.position.update(x + this.width + this.top_left_corner.width, y + this.top_left_corner.height)
        this.bottom_right_corner.position.update(x + this.width + this.top_left_corner.width, y + this.height + this.top_left_corner.height)
        this.bottom_corner.position.update(x + this.top_left_corner.width, y + this.height + this.top_left_corner.height)
        this.bottom_left_corner.position.update(x, y + this.height + this.top_left_corner.height)
        this.left_corner.position.update(x, y + this.top_left_corner.height)
        this.text_box.position.update(x + this.top_left_corner.width, y + this.top_left_corner.height)
        this.arrow.position.update(x + this.top_left_corner.width + this.width * this.arrowPosition.x, (this.top_left_corner.position.y + this.top_corner.height + this.bottom_corner.height + this.arrowHeight * 0.5) + this.height - 3 * this.arrowPosition.y)
    }

    /**
     * Draw all letters and UI components
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        if (!this.dialogs[this.currentDialogIndex]) return

        // draw top left corner
        this.top_left_corner.alpha = this.alpha
        this.top_left_corner.draw(graphics)
        // draw top corner
        this.top_corner.alpha = this.alpha
        this.top_corner.draw(graphics)
        // draw top right corner
        this.top_right_corner.alpha = this.alpha
        this.top_right_corner.draw(graphics)
        // draw right corner
        this.right_corner.alpha = this.alpha
        this.right_corner.draw(graphics)
        // draw bottom right corner
        this.bottom_right_corner.alpha = this.alpha
        this.bottom_right_corner.draw(graphics)
        // draw bottom corner
        this.bottom_corner.alpha = this.alpha
        this.bottom_corner.draw(graphics)
        // draw bottom left corner
        this.bottom_left_corner.alpha = this.alpha
        this.bottom_left_corner.draw(graphics)
        // draw left corner
        this.left_corner.alpha = this.alpha
        this.left_corner.draw(graphics)
        // draw text box
        this.text_box.alpha = this.alpha
        this.text_box.draw(graphics)

        // start open animation
        if (!this.openAnimation.completed) {
            this.openAnimation.play()
            this.updateSize(this.width, this.height)
        }

        this.talking = true

        // open animation completed
        if (this.openAnimation.completed) {

            // draw arrow
            this.arrow.draw(graphics)

            // animate letters
            this.letters.map((letter, i) => {

                letter.alpha = letter.interpolation

                // completed letter render
                if (letter.animation.completed && !letter.alreadyRendered) {
                    this.renderedLettersCount++
                    letter.alreadyRendered = true
                }

                // completed sentense render
                if (this.renderedLettersCount === this.letters.length) {
                    this.talking = false
                } else {
                    this.talking = true
                }

            })

            // draw letters
            super.draw(graphics)

        }

    }

}