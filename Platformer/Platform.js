/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Package Platformer
 * 
 * Helper class to create platforms to interact with Entity
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
     * Ex : 
     *      let platforms = []
     *      Platform.add(platforms, 45, 100, new Vector(100, 100))
     *      Platform.add(platforms, 0, 100)
     *      Platform.add(platforms, -45, 100)
     * 
     * Output : 
     *        _____
     *       /     \
     *      /       \
     * 
     * @param {array<EmagJS.Platform.Platform>} platforms 
     * @param {number} angle 
     * @param {number} size 
     * @param {number} start
     * @param {object} type
     * 
     * @return {void} 
     */
    static add(platforms, angle, size, start, type = {}) {

        // get last platform created
        let lastPlatform = platforms[platforms.length - 1]

        // default platform start position
        let position

        if (start) {
            position = start
        } else {
            position = new Vector(100, 100)
        }

        // if there is a platform and not passed where to position
        if (lastPlatform && !start) {
            // get last platform position
            position = lastPlatform.position.clone()
            // updates new platform position to start at last platform end
            position.x += lastPlatform.width * Math.cos(lastPlatform.angle * toRad)
            position.y -= lastPlatform.width * Math.sin(lastPlatform.angle * toRad)
        }

        // creates a platform - TODO - object pool
        let platform = new Platform(position.x, position.y, size, 1, angle)

        // defines platform types
        let platformTypes = Object.assign({ across: true, sticky: false }, type)
        platform.across = platformTypes.across
        platform.sticky = platformTypes.sticky

        // add created platform to platform array
        platforms.push(platform)

    }

}