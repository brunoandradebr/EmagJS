class VisibilityPolygon {

    constructor(position = new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y), fillColor = 'rgba(255, 255, 255, 0.7)', collisionHandler = new CollisionHandler()) {

        this.fillColor = fillColor
        this.colorRadius0 = 0
        this.colorRadius1 = 800
        this.shadowColor = 'rgba(0, 0, 0, 0.6)'

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
            new Shape(new Square, new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y), DEVICE_WIDTH, DEVICE_HEIGHT, this.shadowColor)
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

    }

    /**
     * Adds a polygon to polygons pool
     * 
     * @param {EmagJS.Core.Render.Shape} polygon
     * 
     * @return {void} 
     */
    addPolygon(polygon) {
        this.polygons.push(polygon)
    }

    /**
     * Casts rays to all polygons
     * 
     * @return {void}
     */
    castRays() {

        // clear previous rays
        this.rays.length = 0

        // for each polygon
        this.polygons.map((polygon) => {

            // for each polygon line
            polygon.getLines().map((line) => {

                // create a line from it's position to polygon line end
                let ray = new Line(this.position, line.end)

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

        //this.rays.map((ray) => ray.draw(graphics))

        this.polygons[0].fillColor = this.shadowColor
        this.polygons[0].draw(graphics)

        let gradient = graphics.createRadialGradient(this.position.x, this.position.y, this.colorRadius0, this.position.x, this.position.y, this.colorRadius1)
        gradient.addColorStop(0, this.fillColor);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        graphics.fillStyle = gradient
        graphics.beginPath()
        this.rays.map((ray) => {
            graphics.lineTo(ray.end.x, ray.end.y)
        })
        graphics.closePath()
        graphics.fill()

    }


}