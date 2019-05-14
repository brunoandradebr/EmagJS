/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Stick - creates a touch stick
 */
class Stick {

    /**
     * @param {EmagJS.Core.Display.Scene} scene 
     */
    constructor(scene) {

        if (!scene)
            throw new Error('scene not defined for stick constructor')

        /**
         * @type {EmagJS.Core.Display.Scene}
         */
        this.scene = scene

        /**
         * @type {bool}
         */
        this.active = true

        /**
         * Stick radius color
         * 
         * @type {string}
         */
        this.radiusColor = 'rgba(0, 0, 0, 0.3)'

        /**
         * Stick radius line color
         * 
         * @type {string}
         */
        this.radiusLineColor = 'rgba(0, 0, 0, 0.5)'

        /**
         * Stick radius line width
         * 
         * @type {number}
         */
        this.radiusLineWidth = 1

        /**
         * Stick thumb color
         * 
         * @type {string}
         */
        this.thumbColor = 'rgba(255, 255, 255, 0.2)'

        /**
         * Stick thumb line color
         * 
         * @type {string}
         */
        this.thumbLineColor = 'rgba(0, 0, 0, 0.5)'

        /**
         * Stick thumb line width
         * 
         * @type {number}
         */
        this.thumbLineWidth = 1

        /**
         * Interact area radius
         * 
         * @type {number}
         */
        this.radius = 60

        /**
         * Inverse radius
         * 
         * @type {number}
         */
        this._iRadius = 1 / this.radius

        /**
         * @type {EmagJS.Core.Math.Vector}
         */
        this._initialPosition = new Vector

        /**
         * Stick area appearence
         * 
         * @type {EmagJS.Core.Render.Circle}
         */
        this.radiusSprite = new Circle(this._initialPosition, this.radius, this.radiusColor, this.radiusLineWidth, this.radiusLineColor)

        /**
         * Stick thumb appearence
         * 
         * @type {EmagJS.Core.Render.Circle}
         */
        this.thumbSprite = new Circle(new Vector, this.radius * 0.5, this.thumbColor, this.thumbLineWidth, this.thumbLineColor)

        /**
         * Area where is possible to activate stick interaction
         * 
         * @type {object}
         */
        this.area = {
            center: new Vector(scene.width * 0.5, scene.height * 0.5),
            width: scene.width,
            height: scene.height
        }

        /**
         * Vector with stick direction [x (-1, 1), y (-1, 1)]
         * 
         * @type {EmagJS.Core.Math.Vector}
         */
        this.direction = new Vector(0, 0)

        /**
         * When stick is not down, reset direction (0, 0)
         * 
         * @type {EmagJS.Core.Math.Vector}
         */
        this.autoResetDirection = true

        /**
         * Flag to know if interacting with stick
         * 
         * @type {bool}
         */
        this.isDown = false

        /**
         * Sprite to show stick area (debug only)
         * 
         * @type {EmagJS.Core.Render.Sprite}
         */
        this.area._debug = new Sprite(this.area.center, this.area.width, this.area.height, 'transparent', 2)

        /**
         * Flag to know when stick is active
         * 
         * @type {bool}
         */
        this._touched = false

        /**
         * Touch id
         * 
         * @type {integer}
         */
        this._activeTouchId = null

        /**
         * Activate debug
         * @type {bool}
         */
        this.debug = false

    }

    /**
     * Process stick interactions
     * 
     * @return {void}
     */
    update() {

        if (!this.active) return false

        // set stick area to scene scale factor
        let areaX = this.area.center.x * this.scene.scale
        let areaY = this.area.center.y * this.scene.scale
        let areaWidth = this.area.width * this.scene.scale
        let areaHeight = this.area.height * this.scene.scale

        // for each touch pointer
        for (let i in touches) {

            let touch = touches[i]

            // touch is an object, so 'length' property is listed as well
            if (typeof (touch) == 'number')
                continue

            // only accept touch start to activate stick area (click event like)
            if (window.performance.now() - touch.startTimeStamp > 50) continue

            // offset touch position
            let x = touch.clientX - this.scene.offsetX
            let y = touch.clientY - this.scene.offsetY

            // adjusts if camera is moving
            if (this.scene.camera) {
                if (this.scene.camera.x >= 0)
                    x = touch.clientX - (this.scene.offsetX - this.scene.camera.x * this.scene.scale)
                if (this.scene.camera.y >= 0)
                    y = touch.clientY - (this.scene.offsetY - this.scene.camera.y * this.scene.scale)
            }

            // touching area
            if (x > ((areaX - areaWidth * 0.5)) && x < ((areaX + areaWidth * 0.5))) {
                if (y > ((areaY - areaHeight * 0.5)) && y < ((areaY + areaHeight * 0.5))) {

                    // if not toucing yet
                    if (!this._touched) {
                        // update initial position
                        this._initialPosition.x = x / this.scene.scale
                        this._initialPosition.y = y / this.scene.scale
                        // save touch id
                        this._activeTouchId = i
                        // update isDown flag
                        this.isDown = true
                    }

                    // update touched flag
                    this._touched = true

                }
            }
        }

        // if there is no touch pointer
        if (!touches.length) {
            this._activeTouchId = null
            this.isDown = false
        }

        // cache active touch
        let activeTouch = touches[this._activeTouchId]

        // if still touching
        if (activeTouch) {

            // offset touch position
            let activeTouchX = activeTouch.clientX - this.scene.offsetX
            let activeTouchY = activeTouch.clientY - this.scene.offsetY

            // adjusts if camera is moving
            if (this.scene.camera) {
                if (this.scene.camera.x >= 0)
                    activeTouchX = activeTouch.clientX - (this.scene.offsetX - this.scene.camera.x * this.scene.scale)
                if (this.scene.camera.y >= 0)
                    activeTouchY = activeTouch.clientY - (this.scene.offsetY - this.scene.camera.y * this.scene.scale)
            }

            // calculate distance
            let dx = activeTouchX - this._initialPosition.x * this.scene.scale
            let dy = activeTouchY - this._initialPosition.y * this.scene.scale

            // if touch inside stick radius, free move
            if ((dx * dx + dy * dy) / this.scene.scale < (this.radius * this.radius) * this.scene.scale) {
                // update thumb sprite position
                this.thumbSprite.position.x = activeTouchX / this.scene.scale
                this.thumbSprite.position.y = activeTouchY / this.scene.scale
                // update stick direction
                this.direction.x = dx * this._iRadius
                this.direction.y = dy * this._iRadius
            } else {
                // lock thumb inside stick radius
                let distanceNormalized = 1 / Math.sqrt(dx * dx + dy * dy)
                this.thumbSprite.position.x = (this._initialPosition.x + ((dx * distanceNormalized) * this.radius))
                this.thumbSprite.position.y = (this._initialPosition.y + ((dy * distanceNormalized) * this.radius))
                // update stick direction
                this.direction.x = dx * distanceNormalized
                this.direction.y = dy * distanceNormalized
            }

        } else { // if touch id is not down anymore
            // reset touch id
            this._activeTouchId = null
            // update isDown flag
            this.isDown = false
            // update touched flag
            this._touched = false
            // reset stick direction
            if (this.autoResetDirection) {
                this.direction.x = 0
                this.direction.y = 0
            }
        }

        // update debug sprite
        this.area._debug.position.x = this.area.center.x
        this.area._debug.position.y = this.area.center.y
        this.area._debug.width = this.area.width
        this.area._debug.height = this.area.height

        // radius fill color
        this.radiusSprite.fillColor = this.radiusColor
        // radius line color
        this.radiusSprite.lineColor = this.radiusLineColor
        // radius line width
        this.radiusSprite.lineWidth = this.radiusLineWidth

        // thumb fill color
        this.thumbSprite.fillColor = this.thumbColor
        // thumb line color
        this.thumbSprite.lineColor = this.thumbLineColor
        // thumb line width
        this.thumbSprite.lineWidth = this.thumbLineWidth

    }

    /**
     * updates stick area information
     * 
     * @return {void}
     */
    updatePositions() {

        this.area.center.x = this.scene.width * 0.5
        this.area.center.y = this.scene.height * 0.5
        this.area.width = this.scene.width
        this.area.height = this.scene.height

    }

    /**
     * Draw stick
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        // if active
        if (this.active) {

            // if touching
            if (this._activeTouchId) {
                // draw radius sprite
                this.radiusSprite.draw(graphics)
                // draw thumb sprite
                this.thumbSprite.draw(graphics)
            }

            // show debug sprite
            if (this.debug)
                this.area._debug.draw(graphics)

        }

    }

}