/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Random polygon
 * 
 * @param {number} nVertices number of points
 * 
 * @extends EmagJS.Core.Geom.Polygon
 */
class RandomPolygon extends Polygon {

    constructor(nVertices = 9) {

        super()

        const points = []

        for (let i = 0; i < nVertices; i++) {

            const r = random(Date.now())

            const x = Math.cos(r + i)
            const y = Math.sin(r + i)

            const point = new Vector(x, y, 0)

            points.push(point)

        }

        points.sort((a, b) => b.angle - a.angle)

        /**
         * @type {array<EmagJS.Core.Math.Vector>}
         */
        this.points = points

    }

}