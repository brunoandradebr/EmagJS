/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Random polygon
 * 
 * @extends EmagJS.Core.Geom.Polygon
 */
class RandomPolygon extends Polygon {

    constructor() {

        super();

        /**
         * @type {array<EmagJS.Core.Math.Vector>}
         */
        this.points = [
            new Vector(Math.random(), Math.random()),
            new Vector(-Math.random(), Math.random()),
            new Vector(-Math.random(), -Math.random()),
            new Vector(Math.random(), -Math.random()),
        ];

    }

}