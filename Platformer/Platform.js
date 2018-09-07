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
     * @param {number} offset
     */
    constructor(x, y, width, height, angle = 0, offset = 0) {

        super(new Square, new Vector(x, y), width, height, 'rgba(0, 0, 255, 0.4)', 0)

        // to collision handler see platform as a shape
        this.extends = 'Shape'

        // rotates platform to it's angle
        this.rotateZ(angle, this.width * 0.5, this.height * 0.5)
        this.transform()

        // calculates it's slope factor
        angle = angle * toRad
        this.tangent = Math.sin(angle) / Math.cos(angle)

        // offset to be calculate when resolving collision
        this.offset = offset

        // pre calculates it's bounding box
        this.boundingBox = this.getBoundingBox()

    }

}