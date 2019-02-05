/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Sprite
 */
class Sprite {

    /**
     * 
     * @param {EmagJS.Core.Math.Vector} position 
     * @param {number} width 
     * @param {number} height 
     * @param {string} fillColor 
     * @param {number} lineWidth 
     * @param {string} lineColor
     *  
     */
    constructor(position = new Vector(0, 0), width = 50, height = 50, fillColor = '#f06', lineWidth = 2, lineColor = 'black') {

        /**
         * @type {EmagJS.Core.Math.Vector}
         */
        this.position = position

        /**
         * @type {number}
         */
        this.width = width

        /**
         * @type {number}
         */
        this.height = height

        /**
         * @type {string}
         */
        this.fillColor = fillColor

        /**
         * @type {string}
         */
        this.lineColor = lineColor

        /**
         * @type {number}
         */
        this.lineWidth = lineWidth

        /**
         * @type {number}
         */
        this.shadowBlur = undefined

        /**
         * @type {string}
         */
        this.shadowColor = 'black'

        /**
         * @type {number}
         */
        this.shadowOffsetX = 0

        /**
         * @type {number}
         */
        this.shadowOffsetY = 0

        /**
         * @type {number}
         */
        this.alpha = 1

        /**
         * Sprite's anchor orientation, to render and transform
         * 
         * @type {object}
         */
        this.anchor = { x: 0.5, y: 0.5 }

        /**
         * transformation matrix
         * 
         * @type {EmagJS.Core.Math.Matrix}
         */
        this.matrix = new Matrix()

        /**
         * sprite's image source
         * 
         * @type {EmagJS.Core.Common.Image.ImageProcessor}
         */
        this.image = null
        this.imageOffsetX = 0
        this.imageOffsetY = 0
        this.imageOffsetWidth = null
        this.imageOffsetHeight = null

        /**
         * sprite animations pool
         * 
         * @type {array}
         */
        this.animations = []

        /**
         * @type {object}
         */
        this.currentAnimation = null

        /**
         * @type {DOMHighResTimeStamp}
         */
        this.animationStartTime = window.performance.now()

        /**
         * @type {number}
         */
        this.animationElapsedTime = 0

        /**
         * @type {integer}
         */
        this.animationFPS = 0

        /**
         * @type {bool}
         */
        this.animationPaused = false;

    }

    /**
     * Adds a new animation object to sprite's animation pool
     * 
     * @param {string}   label 
     * @param {array}    keyFrames [0, 1, 2, 3, ...] | ['0..3']
     * @param {interger} repeate 
     * @param {integer}  fps
     * 
     * @return {void}
     */
    addAnimation(label, keyFrames, repeate = 1, fps = 10) {

        let frames = []

        // if keyframes is a range
        if (typeof (keyFrames[0]) == 'string') {

            let range = keyFrames[0].split('..')
            let start = range[0] | 0
            let end = range[1] | 0

            keyFrames.length = 0

            for (let i = start; i < end; i++) {
                keyFrames.push(i)
            }
        }

        keyFrames.map((keyFrame) => {
            frames.push(this.image.frames[keyFrame])
        })

        frames.fps = fps
        frames.repeate = repeate

        this.animations[label] = frames
        this.animations.length++

        this.setAnimation(label)

    }

    /**
     * Defines current animation
     * 
     * @param {string} label
     * 
     * @return {void} 
     */
    setAnimation(label) {

        // if setting a animation already playing
        if (this.currentAnimation && this.currentAnimation.label === label)
            return false

        // set current animation
        this.currentAnimation = this.animations[label]
        this.currentAnimation.label = label
        this.currentFrame = 0
        this.currentAnimationLoopCount = 0
        this.currentAnimation.lastFrame = false

        // reset animation tick
        this.animationStartTime = window.performance.now()
        this.animationElapsedTime = 0
        // animation fps 1 (second) / desired fps
        this.animationFPS = 1 / this.currentAnimation.fps
    }

    /**
     * Plays it's current animation
     * 
     * @return {void}
     */
    playAnimation() {

        // animation paused
        if (this.animationPaused)
            return false

        // if played all repeates
        if (this.currentAnimationLoopCount === this.currentAnimation.repeate) {
            return false
        }

        let dt = window.performance.now() - this.animationStartTime
        // get delta in seconds dt / 1000
        this.animationElapsedTime += dt * 0.001
        this.animationStartTime = window.performance.now()

        // animation tick
        if (this.animationElapsedTime >= this.animationFPS) {

            // playing
            if (this.currentFrame < this.currentAnimation.length - 1) {
                this.animationElapsedTime = 0
                this.currentFrame++
            } else {
                // completed animation
                if (this.currentAnimation.repeate > 1)
                    this.currentFrame = 0

                this.animationElapsedTime = 0
                this.currentAnimationLoopCount++

            }

            if (this.currentFrame == this.animations[this.currentAnimation.label].length - 1) {
                this.currentAnimation.lastFrame = true
            } else {
                this.currentAnimation.lastFrame = false
            }


        }

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        // save graphics context
        graphics.save()

        // sprite appearence
        graphics.fillStyle = this.fillColor
        graphics.strokeStyle = this.lineColor
        graphics.lineWidth = this.lineWidth
        graphics.globalAlpha = this.alpha

        // pixelated
        graphics.mozImageSmoothingEnabled = false
        graphics.webkitImageSmoothingEnabled = false
        graphics.msImageSmoothingEnabled = false
        graphics.imageSmoothingEnabled = false

        // composite operation
        graphics.globalCompositeOperation = this.compositeOperation || 'none'

        // draw shadow
        if (this.shadowBlur != undefined) {
            graphics.shadowBlur = this.shadowBlur
            graphics.shadowColor = this.shadowColor
            graphics.shadowOffsetX = this.shadowOffsetX
            graphics.shadowOffsetY = this.shadowOffsetY
        }

        // transformation matrix
        let m = this.matrix.m
        graphics.transform(m[0][0], m[0][1], m[1][0], m[1][1], this.position.x, this.position.y)

        // draw static image
        if (this.image && this.image.constructor.name == 'ImageProcessor') {
            graphics.drawImage(this.image.source, this.imageOffsetX, this.imageOffsetY, this.imageOffsetWidth ? this.imageOffsetWidth : this.image.source.width, this.imageOffsetHeight ? this.imageOffsetHeight : this.image.source.height, -this.width * this.anchor.x, -this.height * this.anchor.y, this.width, this.height)
        }

        // draw pattern
        else if (this.image && this.image.constructor.name == 'Pattern') {
            graphics.fillStyle = this.image.fillStyle
            graphics.fillRect(-this.width * this.anchor.x, -this.height * this.anchor.y, this.width, this.height)
        }

        // animate spritesheet
        else if (this.image && this.image.constructor.name == 'SpriteSheet') {

            // there is no animations
            if (this.animations.length == 0) {
                trace('please, add some animations to sprite')
                return false
            }

            this.playAnimation()

            graphics.drawImage(
                this.image.source,
                this.currentAnimation[this.currentFrame].x/*current frame x*/,
                this.currentAnimation[this.currentFrame].y/*current frame y*/,
                this.currentAnimation[this.currentFrame].width/*current frame width*/,
                this.currentAnimation[this.currentFrame].height/*current frame height*/,
                -this.width * this.anchor.x,
                -this.height * this.anchor.y,
                this.width,
                this.height
            )

        }

        // fill sprite
        if (this.fillColor != 'transparent')
            graphics.fillRect(-this.width * this.anchor.x, -this.height * this.anchor.y, this.width, this.height)

        // stroke sprite
        if (this.lineWidth)
            graphics.strokeRect(-this.width * this.anchor.x, -this.height * this.anchor.y, this.width, this.height)

        // restore graphics context
        graphics.restore()

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    debug(graphics) {

        this.matrix.debug(graphics, { center: this.position })

        graphics.save()
        graphics.fillStyle = 'lime'
        graphics.fillRect(this.position.x - 2.5 | 0, this.position.y - 2.5 | 0, 5, 5)
        graphics.restore()

    }

}