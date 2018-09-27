class DialogSystem extends SpriteText {

    constructor(spriteFont) {
        super(spriteFont)

        // temporary
        this.scale = 3

        // bg
        this.background = new Sprite(new Vector(0, 0), 174 * this.scale, 60 * this.scale, 'transparent', 0)
        this.background.anchor.x = 0
        this.background.anchor.y = 0
        this.background.image = new ImageProcessor(assets.files.dialog_bg)
        // left bg
        this.left_background = new Sprite(new Vector(0, 0), 3 * this.scale, 60 * this.scale, 'transparent', 0)
        this.left_background.anchor.x = 0
        this.left_background.anchor.y = 0
        this.left_background.image = new ImageProcessor(assets.files.dialog_left_bg)
        // right bg
        this.right_background = new Sprite(new Vector(0, 0), 3 * this.scale, 60 * this.scale, 'transparent', 0)
        this.right_background.anchor.x = 0
        this.right_background.anchor.y = 0
        this.right_background.image = new ImageProcessor(assets.files.dialog_right_bg)
        // arrow
        this.arrow = new Sprite(new Vector(0, 0), 8 * this.scale, 14 * this.scale, 'transparent', 0)
        this.arrow.anchor.x = 0
        this.arrow.anchor.y = 0
        this.arrow.image = new ImageProcessor(assets.files.dialog_arrow)
        this.arrow.matrix.rotateZ(90)

    }

    write(string, x, y, width, height) {

        super.write(string, x, y, width, height)

        // background
        this.background.position.x = x
        this.background.position.y = y + (height / this.scale)
        // left background
        this.left_background.position.x = x - this.left_background.width
        this.left_background.position.y = y + (height / this.scale)
        // right background
        this.right_background.position.x = (x + this.background.width)
        this.right_background.position.y = y + (height / this.scale)
        // arrow
        this.arrow.position.x = (x + (this.background.width * 0.5)) | 0
        this.arrow.position.y = ((y + this.background.height + height / this.scale - 2 * this.scale) | 0)

    }

    draw(graphics) {

        this.background.draw(graphics)
        this.left_background.draw(graphics)
        this.right_background.draw(graphics)
        this.arrow.draw(graphics)

        super.draw(graphics)

    }

}