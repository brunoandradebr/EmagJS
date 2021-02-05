/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


class VisibilityPolygon {

    constructor(position = new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y), fillColor = 'rgba(255, 255, 255, 0.7)', width = DEVICE_WIDTH, height = DEVICE_HEIGHT, collisionHandler = new CollisionHandler()) {

        /**
         * light color
         * 
         * @type {string}
         */
        this.fillColor = fillColor

        /**
         * light color 2
         * 
         * @type {string}
         */
        this.fillColor2 = "rgba(255,255,255,0)"

        /**
         * shadow color
         * 
         * @type {string}
         */
        this.shadowColor = 'rgba(0, 0, 0, 0.6)'

        /**
         * shadow penumbra color
         * 
         * @type {string}
         */
        this.penumbraColor = 'white'

        /**
         * inside color radius
         * 
         * @type {number}
         */
        this.colorRadius0 = 0

        /**
         * outside color radius
         * 
         * @type {number}
         */
        this.colorRadius1 = 800

        /**
         * polygon center
         * 
         * @type {EmagJS.Core.Math.Vector}
         */
        this.position = position

        /**
         * polygons to cast rays
         * 
         * @type {array<EmagJS.Core.Render.Shape>}
         */
        this.polygons = [
            new Shape(new Square, new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y), width, height, this.shadowColor)
        ]

        /**
         * Rays pool
         * 
         * @type {array<EmagJS.Core.Render.Line>}
         */
        this.rays = []

        /**
         * Collision handler object to check ray to polygon intersection
         * 
         * @type {EmagJS.Core.Collision.CollisionHandler}
         */
        this.collisionHandler = collisionHandler

        this.tmpLinesToCheckIntersection = []
        this.tmpPointsToCastRays = []
        this.tmpPointToSegmentLine = new Line(new Vector, new Vector)
        this.tmpSegmentLine = new Line(new Vector, new Vector)

    }

    /**
     * Adds a polygon to polygons pool
     * 
     * @param {EmagJS.Core.Render.Shape | array<EmagJS.Core.Render.Shape>} polygon
     * 
     * @return {void} 
     */
    addPolygon(polygon) {

        if (polygon.constructor.name == 'Array') {
            polygon.map((p) => this.polygons.push(p))
        } else {
            this.polygons.push(polygon)
        }

    }

    /**
     * Checks if a point is inside visibility polygon 
     * 
     * @type {EmagJS.Core.Math.Vector} point 
     * 
     * @return {bool}
     */
    contains(point) {

        // creates a line from point to light center
        // object <- ☺ ------------ o -> light center
        //
        // update tmp point to segment line start
        this.tmpPointToSegmentLine.start.x = this.position.x
        this.tmpPointToSegmentLine.start.y = this.position.y
        // update tmp point to segment line end
        this.tmpPointToSegmentLine.end.x = point.x
        this.tmpPointToSegmentLine.end.y = point.y

        // get rays end points
        let endPoints = []
        this.rays.map((ray) => {
            endPoints.push(ray.end)
        })

        let inside = true

        // for each light shape segment
        for (let i = 0; i < endPoints.length; i++) {

            // get segments points
            let A = endPoints[i]
            let B = endPoints[i + 1] ? endPoints[i + 1] : endPoints[0]

            // update tmp segment line start
            this.tmpSegmentLine.start.x = A.x
            this.tmpSegmentLine.start.y = A.y
            // update tmp segment line end
            this.tmpSegmentLine.end.x = B.x
            this.tmpSegmentLine.end.y = B.y

            // if point to center line intersects with any light shape segment
            if (this.collisionHandler.check(this.tmpSegmentLine, this.tmpPointToSegmentLine)) {
                inside = false
                break
            }

        }

        return inside
    }

    /**
     * Casts rays to all polygons
     * 
     * @return {void}
     */
    castRays() {

        // clear previous data
        this.rays.length = 0
        this.tmpPointsToCastRays.length = 0
        this.tmpLinesToCheckIntersection.length = 0

        // for each polygon
        this.polygons.map((polygon) => {

            // for each polygon line
            polygon.getLines().map((line) => {

                // save line to further intersection check
                this.tmpLinesToCheckIntersection.push(line)

                this.tmpPointsToCastRays.push(line.end)

            })

        })

        // get extra points from polygons intersection
        for (let i = 0; i < this.tmpLinesToCheckIntersection.length; i++) {
            const lineA = this.tmpLinesToCheckIntersection[i]
            for (let j = i + 1; j < this.tmpLinesToCheckIntersection.length; j++) {
                const lineB = this.tmpLinesToCheckIntersection[j]
                if (this.collisionHandler.check(lineA, lineB)) {
                    if (!this.tmpPointsToCastRays.includes(this.collisionHandler[0]))
                        this.tmpPointsToCastRays.push(this.collisionHandler.points[0])
                }
            }
        }

        // cast rays to all valid points
        this.tmpPointsToCastRays.map((point) => {

            // create a line from it's position to point
            let ray = new Line(this.position, point)

            // create a left ray very close ray
            let leftRay = ray.clone()
            leftRay.rotate((leftRay.angle * toDegree) - 0.1)
            leftRay.scale(2048)

            // create a right ray very close ray
            let rightRay = ray.clone()
            rightRay.rotate((rightRay.angle * toDegree) + 0.1)
            rightRay.scale(2048)

            // add rays to rays pool
            this.rays.push(ray, leftRay, rightRay)

        })

        // for each ray
        this.rays.map((ray) => {
            // for each polygon
            this.polygons.map((polygon) => {
                // check ray to polygon intersection
                if (this.collisionHandler.check(ray, polygon)) {
                    // update ray end to intersection point
                    ray.end.update(this.collisionHandler.closestPoint)
                }
            })
        })

        // sort rays by angle
        this.rays.sort((a, b) => a.angle - b.angle)

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        this.polygons[0].fillColor = this.shadowColor
        this.polygons[0].draw(graphics)

        if (this.compositeOperation || this.shadowBlur)
            graphics.save()

        if (this.compositeOperation) {
            graphics.globalCompositeOperation = this.compositeOperation
        }

        if (this.shadowBlur) {
            graphics.shadowBlur = this.shadowBlur
            graphics.shadowColor = this.penumbraColor
        }

        let gradient = graphics.createRadialGradient(this.position.x, this.position.y, this.colorRadius0, this.position.x, this.position.y, this.colorRadius1)
        gradient.addColorStop(0, this.fillColor);
        gradient.addColorStop(1, this.fillColor2);

        graphics.fillStyle = gradient
        graphics.beginPath()
        this.rays.map((ray) => {
            graphics.lineTo(ray.end.x, ray.end.y)
        })
        graphics.closePath()
        graphics.fill()

        if (this.compositeOperation || this.shadowBlur)
            graphics.restore()

    }


}