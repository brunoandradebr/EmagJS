/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Random polygon
 * 
 * @extends EmagJs.Core.Geom.Polygon
 */
class RandomPolygon extends Polygon {

    constructor() {

        super();

        /**
         * @type {array<EmagJs.Core.Math.Vector>}
         */
        this.points = [
            new Vector(Math.random(), Math.random()),
            new Vector(-Math.random(), Math.random()),
            new Vector(-Math.random(), -Math.random()),
            new Vector(Math.random(), -Math.random()),
        ];

    }

}