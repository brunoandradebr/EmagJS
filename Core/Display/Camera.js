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
        this.target = null
        this.zoom = 1
    }

    /**
     * Update camera's position based on it's target
     * 
     * @return {void}
     */
    update() {

        // move camera
        this.x = this.x + (((this.target.position.x + 40 * this.target.directionX)) - (this.x + this.width * 0.5)) * 0.05
        this.y = this.y + ((this.target.position.y) - (this.y + this.height * 0.5)) * 0.05

        // zoom camera to it's target
        if (this.zoom != 1) {
            this.x = ((this.target.position.x * this.zoom) - this.width * 0.5)
            this.y = ((this.target.position.y * this.zoom) - this.height * 0.5)
        }

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