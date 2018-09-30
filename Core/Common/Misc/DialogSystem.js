class DialogSystem extends SpriteText {

    constructor(spriteFont, position = new Vector(0, 0), width = 200, height = 200) {
        super(spriteFont)

        // dialog properties
        this.width = width
        this.height = height
        this.position = position

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

        // last write properties
        this._lastText = null
        this._lastTextWidth = null
        this._lastTextHeight = null
        this._lastArrowPositionX = this.arrowPosition.x

        this.openAnimation = new Tween(this)
        this.openAnimation.animate({ width: -width + this.arrowWidth }, 0, 0)
        this.openAnimation.animate({ height: -height + this.arrowHeight }, 0, 0)
        this.openAnimation.animate({ width: width - this.arrowWidth }, 800, 100, 'elasticInOut')
        this.openAnimation.animate({ height: height - this.arrowHeight }, 500, 100, 'elasticInOut')
        
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

        // rewrite actual text
        this.write(this._lastText, this._lastTextWidth, this._lastTextHeight, this._lastArrowPositionX)
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

        // rewrite actual text
        this.write(this._lastText, this._lastTextWidth, this._lastTextHeight, this._lastArrowPositionX)
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
     * Create all letters to be drawn
     * 
     * @param {string} string 
     * @param {number} width 
     * @param {number} height
     * 
     * @return {void}
     */
    write(string, width, height, arrowPoisitionX = 0.5) {

        // clear letters
        this.clear()

        // decides font size, passed or last one
        let fontWidth = width || this._lastTextWidth
        let fontHeight = height || this._lastTextHeight

        this.arrowPosition.x = arrowPoisitionX

        // create letters needed to be drawn
        super.write(string, this.position.x + this.top_left_corner.width, this.position.y + this.top_left_corner.height, fontWidth, fontHeight, this.width)

        // update last text properties
        this._lastText = string
        this._lastTextWidth = fontWidth
        this._lastTextHeight = fontHeight
        this._lastArrowPositionX = arrowPoisitionX

    }

    close() {
        this.openAnimation.resetAnimations()
    }

    /**
     * Draw all letters and UI components
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        // draw top left corner
        this.top_left_corner.draw(graphics)
        // draw top corner
        this.top_corner.draw(graphics)
        // draw top right corner
        this.top_right_corner.draw(graphics)
        // draw right corner
        this.right_corner.draw(graphics)
        // draw bottom right corner
        this.bottom_right_corner.draw(graphics)
        // draw bottom corner
        this.bottom_corner.draw(graphics)
        // draw bottom left corner
        this.bottom_left_corner.draw(graphics)
        // draw left corner
        this.left_corner.draw(graphics)
        // draw text box
        this.text_box.draw(graphics)

        // start open animation
        if (!this.openAnimation.completed) {
            this.openAnimation.play()
            this.updateSize(this.width, this.height)
        }

        // open animation completed
        if (this.openAnimation.completed) {

            // draw arrow
            this.arrow.draw(graphics)

            // animate letters
            this.letters.map((letter, i) => {
                letter.width = letter.initialWidth * letter.interpolation
                letter.height = letter.initialHeight * letter.interpolation
            })

            // draw letters
            super.draw(graphics)

        }

    }

}