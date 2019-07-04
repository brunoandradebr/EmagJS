/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */

/**
 * Chaikin Algorithm
 * Creates a smooth curve based on a list of anchor points
 * 
 * @see {http://graphics.cs.ucdavis.edu/~joy/GeometricModelingLectures/Unit-7-Notes/Chaikins-Algorithm.pdf}
 */
class Chaikin {

    /**
     * 
     * @param {array<EmagJS.Core.Math.Vector>} referencePoints 
     * @param {number} quality 
     */
    constructor(referencePoints = [], quality = 4) {

        /**
         * When render, show control points and curve points
         * 
         * @type {bool}
         */
        this.debug = true

        /**
         * Curve quality
         * 
         * @type {number}
         */
        this.quality = quality

        /**
         * Reference points to create a curve
         * 
         * @type {array<EmagJS.Core.Math.Vector>}
         */
        this.referencePoints = referencePoints

        /**
         * Curve points created by chaikin algorithm
         * 
         * @type {array<EmagJS.Core.Math.Vector>}
         */
        this.points = null

        /**
         * @type {string}
         */
        this.lineColor = 'lightgreen'

        /**
         * @type {number}
         */
        this.lineWidth = 2

    }

    /**
     * Creates curve points based on reference points
     * 
     * @return {void}
     */
    update() {

        // cache curve quality
        let quality = this.quality

        // reset to reference points
        this.points = this.referencePoints

        // quality iterations - default 4 - smooth
        for (let k = 0; k < quality; k++) {

            // cache curve points
            let points = this.points
            // cache points length
            let length = points.length

            // tmp array to hold curve points
            let nPoints = []

            // for each reference point
            for (let i = 0; i < length; i++) {

                // if last point, end
                if (!points[i + 1]) continue

                // cache p1 and p2
                let p1 = points[i]
                let p2 = points[i + 1]
                // creates a line segment from p1 to p2
                let segment = p2.clone().subtract(p1)
                // get first new point (segment offset near p1)
                let curvePoint1 = p1.clone().add(segment.clone().multiplyScalar(0.3))
                // get second new point (segment offset near p2)
                let curvePoint2 = p1.clone().add(segment.clone().multiplyScalar(0.7))
                // push both
                nPoints.push(curvePoint1, curvePoint2)

            }

            // update curve with smoothed points
            this.points = nPoints

        }

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        if (this.points) {

            let points = this.points
            let length = points.length

            graphics.save()
            for (let i = 0; i < length; i++) {

                if (!points[i + 1]) continue

                let p1 = points[i]
                let p2 = points[i + 1]

                graphics.strokeStyle = this.lineColor
                graphics.lineWidth = this.lineWidth
                graphics.lineCap = 'round'
                graphics.lineJoin = 'round'
                graphics.beginPath()
                graphics.moveTo(p1.x, p1.y)
                graphics.lineTo(p2.x, p2.y)
                graphics.stroke()

                // debug only - show curve points
                if (this.debug) {
                    let c = new Circle(p1, this.lineWidth + 2, 'transparent', 0.2, this.lineColor)
                    c.draw(graphics)
                }

            }
            graphics.restore()

        }

        // debug only - show reference points and segments
        if (this.debug) {

            let points = this.referencePoints
            let length = points.length

            graphics.save()

            for (let i = 0; i < length; i++) {

                if (!points[i + 1]) continue

                let p1 = points[i]
                let p2 = points[i + 1]

                graphics.strokeStyle = 'rgba(0, 0, 0, 0.08)'
                graphics.lineWidth = 4
                graphics.beginPath()
                graphics.moveTo(p1.x, p1.y)
                graphics.lineTo(p2.x, p2.y)
                graphics.stroke()

                let c1 = new Circle(p1, 3, 'rgba(255, 180, 80, 1)', 0)
                let c2 = new Circle(p2, 3, 'rgba(255, 180, 80, 1)', 0)
                c1.draw(graphics)
                c2.draw(graphics)

            }

            graphics.restore()

        }

    }

}