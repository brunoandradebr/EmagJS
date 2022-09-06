/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */

class Vector {

    constructor(x = 0, y = 0, z = 0) {

        this.x = x
        this.y = y
        this.z = z

    }

    static fromAngle(angle, length = 50) {
        return new Vector(Math.cos(angle * toRad) * length, -Math.sin(angle * toRad) * length)
    }

    static fromArray(arr) {
        return new Vector(arr[0], arr[1], arr[2])
    }

    static random(length = 1) {
        return this.fromAngle((Math.random() * PI * 2) * toDegree, length)
    }

    static angleBetween(v1, v2) {
        let dot = v1.clone().normalize.dot(v2.clone().normalize)
        let cross = v1.clone().normalize.dot(v2.clone().normalize.leftNormal)
        const angle = Math.atan2(cross, dot)
        return angle >= 0 ? angle : 2 * PI + angle
    }

    clone(to = null) {
        if (to) {
            to.x = this.x
            to.y = this.y
            to.z = this.z
        } else {
            return new Vector(this.x, this.y, this.z)
        }
    }

    update(v = new Vector()) {

        if (arguments.length > 1) {

            if (arguments[0] != null)
                this.x = arguments[0]

            if (arguments[1] != null)
                this.y = arguments[1]

            if (arguments[2] != null)
                this.y = arguments[2]

        } else {
            if (arguments[0].constructor.name == 'Vector') {
                this.x = v.x
                this.y = v.y
                this.z = v.z
            } else {
                this.x = arguments[0]
            }
        }

        return this
    }

    add(v, to = this) {

        to.x = this.x + v.x
        to.y = this.y + v.y
        to.z = this.z + v.z

        return to
    }

    addScalar(s, to = this) {
        to.x = this.x + s
        to.y = this.y + s
        to.z = this.z + s
        return to
    }

    subtract(v, to = this) {
        to.x = this.x - v.x
        to.y = this.y - v.y
        to.z = this.z - v.z
        return to
    }

    subtractScalar(s, to = this) {
        to.x = this.x - s
        to.y = this.y - s
        to.z = this.z - s
        return to
    }

    multiply(v, to = this) {
        to.x = this.x * v.x
        to.y = this.y * v.y
        to.z = this.z * v.z
        return to
    }

    multiplyScalar(s, to = this) {
        to.x = this.x * s
        to.y = this.y * s
        to.z = this.z * s
        return to
    }

    divide(v, to = this) {
        to.x = v.x ? this.x / v.x : 0
        to.y = v.y ? this.y / v.y : 0
        to.z = v.z ? this.z / v.z : 0
        return to
    }

    divideScalar(s, to = this) {
        to.x = this.x / s
        to.y = this.y / s
        to.z = this.z / s
        return to
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }

    cross(v) {
        if (v.constructor.name === 'Vector') {
            const x = this.y * v.z - this.z * v.y
            const y = this.z * v.x - this.x * v.z
            const z = this.x * v.y - this.y * v.x
            return new Vector(x, y, z)
        } else {
            return new Vector(-v * this.y, v * this.x, 0)
        }
    }

    rotate(angle, startAngle = 0) {

        let length = this.length

        let _angle = startAngle + angle

        this.x = Math.cos(_angle * toRad)
        this.y = -Math.sin(_angle * toRad)

        this.multiplyScalar(length)

        return this

    }

    project(v, to = new Vector()) {

        let vNormal = v.clone().normalize

        let mag = this.dot(vNormal)

        to.x = vNormal.x * mag
        to.y = vNormal.y * mag
        to.z = vNormal.z * mag

        return to

    }

    get reverse() {
        this.x *= -1
        this.y *= -1
        this.z *= -1
        return this
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    get lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }

    get normalize() {
        let l = this.length ? this.length : 1
        return this.multiplyScalar(1 / l)
    }

    get leftNormal() {
        return new Vector(this.y, -this.x)
    }

    get rightNormal() {
        return new Vector(-this.y, this.x)
    }

    get angle() {

        let angle = -Math.atan2(this.y, this.x)

        if (angle < 0) angle = angle + (PI * 2)

        return angle

    }

    debug(graphics, definition = {}) {

        let option = {
            lineWidth: 1,
            lineColor: 'black',
            center: new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y)
        }

        Object.assign(option, definition)

        let endX = option.center.x + this.x
        let endY = option.center.y + this.y

        // aux lines to create an arrow
        let leftLine = Vector.fromAngle((this.angle * toDegree) + 130, this.x * this.x + this.y * this.y > 10 * 10 ? 10 : 5)
        let rightLine = Vector.fromAngle((this.angle * toDegree) - 130, this.x * this.x + this.y * this.y > 10 * 10 ? 10 : 5)

        graphics.save()
        graphics.strokeStyle = option.lineColor
        graphics.lineWidth = option.lineWidth

        graphics.beginPath()
        graphics.moveTo(option.center.x, option.center.y)
        graphics.lineTo(endX, endY)
        // draw arrow
        graphics.moveTo(endX, endY)
        graphics.lineTo(endX + leftLine.x, endY + leftLine.y)
        graphics.moveTo(endX, endY)
        graphics.lineTo(endX + rightLine.x, endY + rightLine.y)
        graphics.stroke()
        graphics.restore()

    }
}