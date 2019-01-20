/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Package Platformer
 * 
 * Helper class to create platforms
 */
class Platform extends Shape {

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {number} angle 
     */
    constructor(x, y, width, height, angle = 0) {

        super(new Square, new Vector(x, y), width, height, 'rgba(0, 0, 255, 0.4)', 0)

        // to collision handler see platform as a shape
        this.extends = 'Shape'

        // rotates platform to it's angle
        this.rotateZ(angle, this.width * 0.5, 0)
        this.transform()

        // calculates it's slope factor
        angle = angle * toRad
        this.slope = Math.tan(angle)

        // pre calculates it's bounding box
        this.boundingBox = this.getBoundingBox()

    }

    /**
     * Adds a new platform to an array with platforms
     * 
     * @param {array<EmagJS.Platform.Platform>} platforms 
     * @param {number} angle 
     * @param {number} size 
     * @param {number} start
     * 
     * @return {void} 
     */
    static add(platforms, angle, size, start) {

        let lastPlatform = platforms[platforms.length - 1]

        let position
        if (start) {
            position = start
        } else {
            position = new Vector(100, 100)
        }

        if (lastPlatform && !start) {
            position = lastPlatform.position.clone()
            position.x += lastPlatform.width * Math.cos(lastPlatform.angle * toRad)
            position.y -= lastPlatform.width * Math.sin(lastPlatform.angle * toRad)
        }

        let platform = new Platform(position.x, position.y, size, 1, angle)

        platforms.push(platform)

    }

}