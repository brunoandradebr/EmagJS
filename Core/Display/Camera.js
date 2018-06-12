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

        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.offsetHorizontal = 40
        this.offsetVertical = 0
        this.speed = 0.1
        this.zoom = 1

        this.target = null
    }

    /**
     * Update camera's position based on it's target
     * 
     * @return {void}
     */
    update() {

        let centerX = this.x + this.width * 0.5
        let centerY = this.y + this.height * 0.5

        let targetCenterX = this.target.position.x + this.target.width * 0.5
        let targetCenterY = this.target.position.y + this.target.height * 0.5

        let targetDirectionX = this.target.direction.x || 1
        let targetDirectionY = this.target.direction.y || 1

        let distanceX = (targetCenterX + (targetDirectionX * this.offsetHorizontal)) - centerX
        let distanceY = (targetCenterY + (targetDirectionY * this.offsetVertical)) - centerY

        this.x += distanceX * this.speed
        this.y += distanceY * this.speed

        // avoid floats
        this.x = this.x | 0
        this.y = this.y | 0
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

        if (this.x + this.width > maxX * this.zoom) {
            this.x = maxX * this.zoom - this.width
        }

        if (this.x < 0) {
            this.x = 0
        }

        if (this.y + this.height > maxY) {
            this.y = maxY - this.height
        }

        if (this.y < 0) {
            this.y = 0
        }

    }

}