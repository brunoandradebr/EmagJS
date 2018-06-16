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
        this.speed = this.originalSpeed = 0.1
        this.zoomScale = 1

        this.target = null

        this.zoomInAnimation = new Tween(this)
        this.zoomInAnimation.animate({ zoomScale: 1 }, 500, 0, 'cubicOut')
        this.zoomOutAnimation = new Tween(this)
        this.zoomOutAnimation.animate({ zoomScale: 1 }, 500, 0, 'cubicOut')

    }

    /**
     * Update camera's position based on it's target
     * 
     * @return {void}
     */
    update() {

        let centerX = this.x + this.width * 0.5
        let centerY = this.y + this.height * 0.5

        let targetCenterX = (this.target.position.x * this.zoomScale) + (this.target.width * 0.5)
        let targetCenterY = (this.target.position.y * this.zoomScale) + (this.target.height * 0.5)

        let targetDirectionX = this.target.direction ? this.target.direction.x : 1
        let targetDirectionY = this.target.direction ? this.target.direction.y : 1

        let distanceX = (targetCenterX + (targetDirectionX * this.offsetHorizontal)) - centerX
        let distanceY = (targetCenterY + (targetDirectionY * this.offsetVertical)) - centerY

        this.x += distanceX * this.speed
        this.y += distanceY * this.speed

        // avoid floats
        this.x = this.x | 0
        this.y = this.y | 0
    }

    zoomIn() {
        // set camera speed to 1 to zoom nicely
        // double scene height
        // ver o metodo que reseta a animacao...
        this.zoomInAnimation.play()
    }

    zoomOut() {
        this.zoomOutAnimation.updateAnimation(0, this.zoomScale, 1)
        this.zoomOutAnimation.play()
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