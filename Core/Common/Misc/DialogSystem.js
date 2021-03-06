class DialogSystem extends SpriteText {

    constructor(spriteFont, position = new Vector(0, 0), width = 200, height = 200, lineHeight = 2, autoHeight = true) {
        super(spriteFont)

        // dialog properties
        this.width = width
        this.height = height
        this.position = position
        this.initialPosition = this.position.clone()
        this.anchor = new Vector(0.5, 0.5)
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
         * Flag - when dialog is close or open
         */
        this.closed = true

        /**
         * Callback function to be called when dialog ended
         * 
         * @type {function}
         */
        this.callback = () => { }

        /**
         * Dialog line height
         */
        this.lineHeight = lineHeight

        /**
         * Auto adjust dialog height
         */
        this.autoHeight = autoHeight

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

        this.top_left_corner_image = new ImageProcessor(core.images.dialog_top_left)
        this.top_corner_image = new Pattern(core.images.dialog_top, 'repeat-x')
        this.top_right_corner_image = new ImageProcessor(core.images.dialog_top_right)
        this.right_corner_image = new Pattern(core.images.dialog_right, 'repeat-y')
        this.bottom_right_corner_image = new ImageProcessor(core.images.dialog_bottom_right)
        this.bottom_corner_image = new Pattern(core.images.dialog_bottom, 'repeat-x')
        this.bottom_left_corner_image = new ImageProcessor(core.images.dialog_bottom_left)
        this.left_corner_image = new Pattern(core.images.dialog_left, 'repeat-y')
        this.text_box_image = new Pattern(core.images.dialog_box)
        this.arrow_image = new ImageProcessor(core.images.dialog_arrow)

        // dialog top left corner
        this.top_left_corner = new Sprite(this.position, this.cornerWidth, this.cornerHeight, this.cornerFillColor, this.cornerLineWidth)
        this.top_left_corner.anchor.x = this.top_left_corner.anchor.y = 0
        this.top_left_corner.image = this.top_left_corner_image
        // dialog top corner
        this.top_corner = new Sprite(new Vector(this.top_left_corner.position.x + this.top_left_corner.width, this.top_left_corner.position.y), this.width, this.cornerHeight, this.cornerFillColor, this.cornerLineWidth)
        this.top_corner.anchor.x = this.top_corner.anchor.y = 0
        this.top_corner.image = this.top_corner_image
        // dialog top right corner
        this.top_right_corner = new Sprite(new Vector(this.top_left_corner.position.x + this.top_left_corner.width + this.width, this.top_left_corner.position.y), this.cornerWidth, this.cornerHeight, this.cornerFillColor, this.cornerLineWidth)
        this.top_right_corner.anchor.x = this.top_right_corner.anchor.y = 0
        this.top_right_corner.image = this.top_right_corner_image
        // dialog right corner
        this.right_corner = new Sprite(new Vector(this.top_left_corner.position.x + this.width + this.top_left_corner.width, this.top_left_corner.position.y + this.top_left_corner.height), this.cornerWidth, this.height, this.cornerFillColor, this.cornerLineWidth)
        this.right_corner.anchor.x = this.right_corner.anchor.y = 0
        this.right_corner.image = this.right_corner_image
        // dialog bottom right corner
        this.bottom_right_corner = new Sprite(new Vector(this.top_left_corner.position.x + this.width + this.top_left_corner.width, this.top_left_corner.position.y + this.height + this.top_left_corner.height), this.cornerWidth, this.cornerHeight, this.cornerFillColor, this.cornerLineWidth)
        this.bottom_right_corner.anchor.x = this.bottom_right_corner.anchor.y = 0
        this.bottom_right_corner.image = this.bottom_right_corner_image
        // dialog bottom corner
        this.bottom_corner = new Sprite(new Vector(this.top_left_corner.position.x + this.top_left_corner.width, this.top_left_corner.position.y + this.height + this.top_left_corner.height), this.width, this.cornerHeight, this.cornerFillColor, this.cornerLineWidth)
        this.bottom_corner.anchor.x = this.bottom_corner.anchor.y = 0
        this.bottom_corner.image = this.bottom_corner_image
        // dialog bottom left corner
        this.bottom_left_corner = new Sprite(new Vector(this.top_left_corner.position.x, this.top_left_corner.position.y + this.height + this.top_left_corner.height), this.cornerWidth, this.cornerHeight, this.cornerFillColor, this.cornerLineWidth)
        this.bottom_left_corner.anchor.x = this.bottom_left_corner.anchor.y = 0
        this.bottom_left_corner.image = this.bottom_left_corner_image
        // dialog left corner
        this.left_corner = new Sprite(new Vector(this.top_left_corner.position.x, this.top_left_corner.position.y + this.top_left_corner.height), this.cornerWidth, this.height, this.cornerFillColor, this.cornerLineWidth)
        this.left_corner.anchor.x = this.left_corner.anchor.y = 0
        this.left_corner.image = this.left_corner_image
        // dialog text box
        this.text_box = new Sprite(new Vector(this.top_left_corner.position.x + this.top_left_corner.width, this.top_left_corner.position.y + this.top_left_corner.height), this.width, this.height, 'transparent', 0)
        this.text_box.anchor.x = this.text_box.anchor.y = 0
        this.text_box.image = this.text_box_image
        // dialog arrow
        this.arrow = new Sprite(new Vector(this.top_left_corner.position.x + this.top_left_corner.width + this.width * this.arrowPosition.x | 0, (this.top_left_corner.position.y + this.top_corner.height + this.bottom_corner.height + this.arrowHeight * 0.5) + this.height * this.arrowPosition.y - 3), this.arrowWidth, this.arrowHeight, 'transparent', 0)
        this.arrow.image = this.arrow_image
        this.arrow.matrix.rotateZ(this.arrowAngle)

        // open animation
        this.openAnimation = new Tween(this)
        this.openAnimation.animate({ alpha: 1 }, 200, 100, 'cubicInOut')
        this.openAnimation.animate({ width: -width + this.arrowWidth }, 0, 0)
        this.openAnimation.animate({ height: -height + this.arrowHeight }, 0, 0)
        this.openAnimation.animate({ width: width - this.arrowWidth }, 800, 100, 'elasticInOut')
        this.openAnimation.animate({ height: height - this.arrowHeight }, 500, 100, 'elasticInOut')

    }

    /**
     * Adds a dialog object
     * 
     * @param {string} text 
     * @param {EmagJS.Core.Math.Vector} position  
     * @param {number} letterWidth 
     * @param {number} letterHeight 
     * @param {number} arrowPositionX 
     * @param {bool}   reopen 
     * 
     * @return {void}
     */
    addDialog(params) {

        let text = params.text
        let position = params.position || this.initialPosition
        let letterWidth = params.letterWidth || this.spriteFont.width
        let letterHeight = params.letterHeight || this.spriteFont.height
        let arrowPositionX = params.arrowPositionX || 0.5
        let reopen = params.reopen || false
        let callback = params.callback || null

        // calculate total letter
        let length = ((this.width * this.height) / ((letterWidth * letterHeight) + (5 * 5) + (this.lineHeight * this.lineHeight))) | 0

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
                position: position,
                letterWidth: letterWidth,
                letterHeight: letterHeight,
                arrowPositionX: arrowPositionX,
                reopen: reopen,
                callback: callback
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
    _write(string, width, height, arrowPositionX = 0.5) {

        // clear letters
        this.clear()

        // decides font size, passed or last one
        let fontWidth = width
        let fontHeight = height

        this.arrowPosition.x = arrowPositionX

        // create letters needed to be drawn
        super.write(string, 0, 0, fontWidth, fontHeight, this.width, this.lineHeight)

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

        // clear all letters
        this.clear()

        this.renderedLettersCount = 0

        // if there is no more dialogs to render
        if (this.dialogs.length == 0)
            return false

        // increment current dialog index
        this.currentDialogIndex++

        // current dialog
        let dialog = this.dialogs[this.currentDialogIndex]

        // if there is remaining dialog to show
        if (dialog) {

            this.closed = false

            // auto height
            if (this.autoHeight) {
                this.updateSize(this.width, dialog.text.length + dialog.letterHeight + this.lineHeight)
                this.openAnimation.updateAnimation(2, this.height, 0)
                this.openAnimation.updateAnimation(4, 0, this.height)
            }

            // if reopen
            if (dialog.reopen)
                this.reopen()

            // update position before open
            if (dialog.position) {
                this.position.update(dialog.position)
                this.initialPosition.update(this.position.clone())
            }

            // creates all letters
            this._write(dialog.text, dialog.letterWidth, dialog.letterHeight, dialog.arrowPositionX)

            // dialog callback 
            this.callback = dialog.callback

        } else {

            // ended dialogs

            // clear dialogs
            this.dialogs.length = 0
            // reset dialog index
            this.currentDialogIndex = -1

            // timeout after ended dialog
            setTimeout(() => {

                // set closed flag
                this.closed = true

                // ended callback
                if (this.callback)
                    this.callback()

            }, 100)

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

        // rewrite actual dialog
        if (this.openAnimation.completed)
            this._write(this.dialogs[this.currentDialogIndex].text, this.dialogs[this.currentDialogIndex].letterWidth, this.dialogs[this.currentDialogIndex].letterHeight, this.dialogs[this.currentDialogIndex].arrowPositionX)

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

        // adjust animation anchor
        this.position.x = (this.initialPosition.x | 0) - (this.width * this.anchor.x | 0)
        this.position.y = (this.initialPosition.y | 0) - (this.height * this.anchor.y | 0)

        // update ui position
        this.top_corner.position.update(this.position.x + this.top_left_corner.width, this.position.y)
        this.top_right_corner.position.update(this.position.x + this.width + this.top_left_corner.width, this.position.y)
        this.right_corner.position.update(this.position.x + this.width + this.top_left_corner.width, this.position.y + this.top_left_corner.height)
        this.bottom_right_corner.position.update(this.position.x + this.width + this.top_left_corner.width, this.position.y + this.height + this.top_left_corner.height)
        this.bottom_corner.position.update(this.position.x + this.top_left_corner.width, this.position.y + this.height + this.top_left_corner.height)
        this.bottom_left_corner.position.update(this.position.x, this.position.y + this.height + this.top_left_corner.height)
        this.left_corner.position.update(this.position.x, this.position.y + this.top_left_corner.height)
        this.text_box.position.update(this.position.x + this.top_left_corner.width, this.position.y + this.top_left_corner.height)
        this.arrow.position.update(this.position.x + this.top_left_corner.width + this.width * this.arrowPosition.x, (this.top_left_corner.position.y + this.top_corner.height + this.bottom_corner.height + this.arrowHeight * 0.5) + this.height - 3 * this.arrowPosition.y)
        // /update ui position

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
            this.closed = false
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