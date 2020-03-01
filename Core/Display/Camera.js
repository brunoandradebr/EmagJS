class Camera {

    /**
     * Constructor - initialize a camera object
     *  
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(x, y, width, height) {

        /**
         * Camera's target
         * 
         * @type {object}
         */
        this.target = {
            position: new Vector(0, 0),
            width: 0,
            height: 0
        }

        /**
         * @type {number}
         */
        this.x = x

        /**
         * @type {number}
         */
        this.y = y

        /**
         * @type {number}
         */
        this.width = width

        /**
         * @type {number}
         */
        this.height = height

        /**
         * Camera's horizontal offset to it's target's center
         * 
         * @type {number}
         */
        this.offsetHorizontal = this.initialOffsetHorizontal = 40

        /**
         * Camera's vertical offset to it's target's center
         * 
         * @type {number}
         */
        this.offsetVertical = this.initialOffsetVertical = 0

        /**
         * Camera's pan speed - how fast it goes to it's target
         * 
         * @type {number}
         */
        this.speed = this.originalSpeed = 0.1

        /**
         * Camera's zoom factor
         * 
         * @type {number}
         */
        this.zoomScale = 1

        /**
         * Camera's zoom speed - how fast it zooms
         * 
         * @type {number}
         */
        this.zoomSpeed = .1

    }

    /**
     * Update camera's position based on it's target
     * 
     * @return {void}
     */
    update() {

        let centerX = this.x + this.width * 0.5
        let centerY = this.y + this.height * 0.5

        let position = this.target.initialPosition || this.target.position
        let width = this.target.width || this.target.radius
        let height = this.target.height || this.target.radius

        let targetCenterX = (position.x * this.zoomScale) + (width * 0.5)
        let targetCenterY = (position.y * this.zoomScale) + (height * 0.5)

        let targetDirectionX = this.target.direction ? this.target.direction.x : 1
        let targetDirectionY = this.target.direction ? this.target.direction.y : 1

        let distanceX = (targetCenterX + ((targetDirectionX || 1) * this.offsetHorizontal)) - centerX
        let distanceY = (targetCenterY + ((targetDirectionY || 1) * this.offsetVertical)) - centerY

        this.x += distanceX * this.speed
        this.y += distanceY * this.speed

        // avoid floats
        this.x = this.x | 0
        this.y = this.y | 0
    }

    /**
     * Fixes a object inside camera
     * 
     * @param {object} object 
     * 
     * @return {void}
     */
    fix(object) {
        if (this.x > 0) object.position.x += this.x
        if (this.y > 0) object.position.y += this.y
    }

    /**
     * Zoom scene's viewport
     * 
     * @param {number} factor
     * 
     * @return {void} 
     */
    zoomIn(factor = 2) {

        this.speed = this.zoomScale != factor ? 1 : this.originalSpeed

        if (this.zoomScale <= factor)
            this.zoomScale += this.zoomSpeed

        if (this.zoomScale >= factor) this.zoomScale = factor
    }

    /**
     * Zoom out scene's viewport
     * 
     * @param {number} factor
     * 
     * @return {void} 
     */
    zoomOut(factor = 1) {

        this.speed = this.zoomScale != factor ? 1 : this.originalSpeed

        if (this.zoomScale >= factor)
            this.zoomScale -= this.zoomSpeed

        if (this.zoomScale <= factor) this.zoomScale = factor
    }

    /**
     * 
     * @param {number} minX 
     * @param {number} minY 
     * @param {number} maxX 
     * @param {number} maxY
     * 
     * @return {void}
     */
    limitArea(minX, minY, maxX, maxY) {

        if (this.x + this.width > maxX * this.zoomScale) {
            this.x = maxX * this.zoomScale - this.width
        }

        if (this.x < minX) {
            this.x = minX
        }

        if (this.y + this.height > maxY) {
            this.y = maxY - this.height
        }

        if (this.y < minY) {
            this.y = minY
        }

    }

}