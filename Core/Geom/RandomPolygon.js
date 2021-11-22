/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Random polygon
 * 
 * @param {number} quality how squarish is the polygon.
 * 
 * @extends EmagJS.Core.Geom.Polygon
 */
class RandomPolygon extends Polygon {

    constructor(quality = 30) {

        super()

        if (quality < 15) quality = 15

        const randomPoints = []
        for (let i = 0; i < quality; i++) {
            const x = clamp(random(100, false), 0, 100, -.5, .5)
            const y = clamp(random(100, false), 0, 100, -.5, .5)
            const point = new Vector(x, y)
            randomPoints.push(point)
        }

        const points = getConvexHull(randomPoints)

        /**
         * @type {array<EmagJS.Core.Math.Vector>}
         */
        this.points = points

    }

}