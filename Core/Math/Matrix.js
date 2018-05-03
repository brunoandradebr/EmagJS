/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Matrix
 */
class Matrix {

    /**
     * 
     * @param {array<array>} entries
     *           [1, 0, 0],
     *           [0,-1, 0],
     *           [0, 0, 1],
     */
    constructor(entries = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]) {

        /**
         * @type {array<array>}
         */
        this.m = entries;

    }

    /**
     * clone itself
     * 
     * @return {EmagJS.Core.Math.Matrix}
     */
    clone() {
        return new Matrix(this.m)
    }

    /**
     * Transforms a vector
     * 
     * @param {EmagJS.Core.Math.Vector} v
     * 
     * @return {EmagJS.Core.Math.Vector} 
     */
    transform(v) {

        let transformed = new Vector()

        transformed.x = v.x * this.m[0][0] + v.y * this.m[1][0] + this.m[0][2];
        transformed.y = v.x * this.m[0][1] + v.y * this.m[1][1] + this.m[1][2];

        return transformed

    }

    /**
     * Multiply by another matrix or 2D array
     * 
     * @param {EmagJS.Core.Math.Matrix | array<array>} m
     * 
     * @return {EmagJS.Core.Math.Matrix}
     */
    multiply(m) {

        if (m.constructor.name == 'Array')
            m.m = m

        // first row
        let _00 = this.m[0][0] * m.m[0][0] + this.m[0][1] * m.m[0][1] + this.m[0][2] * m.m[0][2];
        let _01 = this.m[0][0] * m.m[1][0] + this.m[0][1] * m.m[1][1] + this.m[0][2] * m.m[1][2];
        let _02 = this.m[0][0] * m.m[2][0] + this.m[0][1] * m.m[2][1] + this.m[0][2] * m.m[2][2];

        // // second row
        let _10 = this.m[1][0] * m.m[0][0] + this.m[1][1] * m.m[0][1] + this.m[1][2] * m.m[0][2];
        let _11 = this.m[1][0] * m.m[1][0] + this.m[1][1] * m.m[1][1] + this.m[1][2] * m.m[1][2];
        let _12 = this.m[1][0] * m.m[2][0] + this.m[1][1] * m.m[2][1] + this.m[1][2] * m.m[2][2];

        // // third row
        let _20 = this.m[2][0] * m.m[0][0] + this.m[2][1] * m.m[0][1] + this.m[2][2] * m.m[0][2];
        let _21 = this.m[2][0] * m.m[1][0] + this.m[2][1] * m.m[1][1] + this.m[2][2] * m.m[1][2];
        let _22 = this.m[2][0] * m.m[2][0] + this.m[2][1] * m.m[2][1] + this.m[2][2] * m.m[2][2];

        this.m = [
            [_00, _01, _02],
            [_10, _11, _12],
            [_20, _21, _22],
        ];

        return this

    }

    /**
     * set itself as identity matrix
     * 
     * @return {void}
     */
    identity() {

        this.m = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ]

    }

    /**
     * Scales itself
     * 
     * @param {number} x 
     * @param {number} y
     * 
     * @return {EmagJS.Core.Math.Matrix}
     */
    scale(x, y) {

        let mScale = [
            [x, 0, 0],
            [0, y, 0],
            [0, 0, 1]
        ]

        return this.multiply(mScale);

    }

    /**
     * Translate itself
     * 
     * @param {number} x 
     * @param {number} y
     * 
     * @return {EmagJS.Core.Math.Matrix}
     */
    translate(x, y) {

        let mTranslate = [
            [1, 0, 0],
            [0, 1, 0],
            [x, y, 1]
        ]

        return this.multiply(mTranslate);

    }

    /**
     * Rotates on x axis by an angle in degrees
     * 
     * @param {number} angle
     * 
     * @return {EmagJS.Core.Math.Matrix}
     */
    rotateX(angle) {

        let rad = angle * toRad;

        let cos = Math.cos(rad);
        let sin = Math.sin(rad);

        let mRotate = [
            [1, 0, 0],
            [0, cos, 0],
            [0, 0, 1]
        ]

        return this.multiply(mRotate)

    }

    /**
     * Rotates on y axis by an angle in degrees
     * 
     * @param {number} angle
     * 
     * @return {EmagJS.Core.Math.Matrix}
     */
    rotateY(angle) {

        let rad = angle * toRad;

        let cos = Math.cos(rad);
        let sin = Math.sin(rad);

        let mRotate = [
            [cos, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]

        return this.multiply(mRotate);

    }

    /**
     * Rotates on z axis by an angle in degrees
     * 
     * @param {number} angle
     * 
     * @return {EmagJS.Core.Math.Matrix}
     */
    rotateZ(angle) {

        let rad = angle * toRad;

        let cos = Math.cos(rad);
        let sin = Math.sin(rad);

        let mRotate = [
            [cos, sin, 0],
            [-sin, cos, 0],
            [0, 0, 1]
        ]

        return this.multiply(mRotate);

    }

    /**
     * get x - return x axis vector
     * 
     * @return {EmagJS.Core.Math.Vector}
     */
    getX() {
        return new Vector(this.m[0][0], this.m[1][0])
    }

    /**
     * get y - return y axis vector
     * 
     * @return {EmagJS.Core.Math.Vector}
     */
    getY() {
        return new Vector(this.m[0][1], this.m[1][1])
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics 
     * @param {object}                   definition
     * 
     * @return {void}
     */
    debug(graphics, definition = {}) {

        let m = this.m

        let center = definition.center

        let xLineColor = definition.xLineColor || 'red'
        let yLineColor = definition.yLineColor || 'blue'

        graphics.lineWidth = 2

        graphics.save()
        graphics.strokeStyle = xLineColor
        graphics.beginPath()
        graphics.moveTo(center.x | 0, center.y | 0)
        graphics.lineTo(center.x + m[0][0] * 30, center.y - m[1][0] * 30)
        graphics.closePath()
        graphics.stroke()

        graphics.strokeStyle = yLineColor
        graphics.beginPath()
        graphics.moveTo(center.x | 0, center.y | 0)
        graphics.lineTo(center.x - m[0][1] * 30, center.y + m[1][1] * 30)
        graphics.closePath()
        graphics.stroke()
        graphics.restore()

    }

}