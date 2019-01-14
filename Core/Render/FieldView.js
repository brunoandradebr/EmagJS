class FieldView {

    /**
     * Field of view
     * 
     * @param {EmagJS.Core.Math.Vector} position 
     * @param {string} fillColor 
     * @param {number} lineWidth 
     * @param {string} lineColor 
     * @param {number} width 
     * @param {number} height 
     * @param {EmagJS.Core.Collision.CollisionHandler} collisionHandler 
     */
    constructor(position = new Vector(), fillColor = 'rgba(0, 0, 0, 0.2)', lineWidth = 2, lineColor = 'rgba(0, 0, 0, 0.8)', width = 200, height = 200, collisionHandler = new CollisionHandler()) {

        this.collisionHandler = collisionHandler

        this.position = position

        this.width = width
        this.height = height

        this.lineColor = lineColor
        this.lineWidth = lineWidth
        this.shadowColor = 'white'

        /**
         * Field of view color
         * 
         * @type {string}
         */
        this.fillColor = fillColor

        /**
         * Field of view polygon's angle
         * 
         * @type {number}
         */
        this.angle = 0

        /**
         * Field of view shape
         * 
         * @type {EmagJS.Core.Render.Shape}
         */
        this.polygon = new Shape(new Triangle, this.position, this.width, this.height, 'transparent', 2, 'rgba(0, 0, 0, 0.1)')

        /**
         * Polygons to cast rays at
         * 
         * @type {array<EmagJS.Core.Render.Shape>}
         */
        this.polygons = []

        /**
         * Rays casted to form field of view shape
         * 
         * @type {array<EmagJS.Core.Render.Line>}
         */
        this.rays = []

        /**
         * Points from polygons vertices and field of view polygon
         * 
         * @type {array<EmagJS.Core.Math.Vector>}
         */
        this.points = []

        /**
         * Temporary line to check ray intersection
         * 
         * @type {array<EmagJS.Core.Render.Line>}
         */
        this.tmpLine = new Line(new Vector, new Vector)

        /**
         * Temporary line to contains method
         * 
         * @type {array<EmagJS.Core.Render.Line>}
         */
        this.tmpPointToSegmentLine = new Line(new Vector, new Vector)

        /**
         * Temporary line to contains method
         * 
         * @type {array<EmagJS.Core.Render.Line>}
         */
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
     * Adds points from polygons vertices and field of view vertices
     * 
     * @return {void}
     */
    _addPoints() {

        this.points.length = 0

        // add field of view polygon points
        this.polygon.getVertices().map((vertex) => this.points.push(vertex))

        // points from polygons
        this.polygons.map((polygon) => {
            polygon.getVertices().map((vertex) => {
                if (this.polygon.contains(vertex)) {
                    this.points.push(vertex)
                }
            })
        })

        // points from field of view polygon to polygons intersection
        this.polygon.getLines().map((line) => {
            this.polygons.map((polygon) => {
                if (this.collisionHandler.check(line, polygon)) {
                    this.collisionHandler.points.map((cp) => {
                        this.points.push(cp)
                    })
                }
            })
        })

    }

    /**
     * Casts rays to polygons to get field of view shape
     * 
     * @return {void}
     */
    castRays() {

        // rotate polygon to it's angle
        this.polygon.rotateZ(180 + this.angle, -this.polygon.width + 1, 5)
        this.polygon.transform()

        // get polygons points
        this._addPoints()

        // clear current rays
        this.rays.length = 0

        // create rays
        this.points.map((point) => {
            this.tmpLine.start = this.polygon.position
            this.tmpLine.end = point

            let tmpLineLeft = this.tmpLine.clone()
            tmpLineLeft.rotate(tmpLineLeft.angle * toDegree - .1)

            let tmpLineRight = this.tmpLine.clone()
            tmpLineRight.rotate(tmpLineRight.angle * toDegree + .1)

            tmpLineLeft.scale(this.polygon.width * 2)
            tmpLineRight.scale(this.polygon.width * 2)

            this.rays.push(this.tmpLine.clone(), tmpLineLeft, tmpLineRight)
        })

        // ray to field of view polygon intersection
        this.rays.map((ray) => {

            if (this.collisionHandler.check(ray, this.polygon)) {
                ray.end.update(this.collisionHandler.closestPoint)
            }

            this.polygons.map((polygon) => {
                if (this.collisionHandler.check(ray, polygon)) {
                    ray.end.update(this.collisionHandler.closestPoint)
                }
            })
        })

        // sort rays by angle
        this.rays.sort((a, b) => a.angle - b.angle)

    }

    /**
     * Checks if a point is inside field of view polygon 
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
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        // draw field view polygon
        if (this.debug)
            this.polygon.draw(graphics)

        if (this.compositeOperation || this.shadowBlur)
            graphics.save()

        if (this.compositeOperation) {
            graphics.globalCompositeOperation = this.compositeOperation
        }

        if (this.shadowBlur) {
            graphics.shadowBlur = this.shadowBlur
            graphics.shadowColor = this.shadowColor
        }

        // draw field of view shape
        graphics.fillStyle = this.fillColor
        graphics.strokeStyle = this.lineColor
        graphics.lineWidth = this.lineWidth

        graphics.beginPath()
        this.rays.map((ray) => {
            graphics.lineTo(ray.end.x, ray.end.y)
        })
        graphics.closePath()

        if (this.lineWidth)
            graphics.stroke()

        graphics.fill()

        if (this.compositeOperation || this.shadowBlur)
            graphics.restore()

    }

}