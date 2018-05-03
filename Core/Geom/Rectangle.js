/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Rectangle
 * 
 * @extends EmagJs.Core.Geom.Polygon
 */
class Rectangle extends Polygon {

    constructor() {

        super();

        /**
         * @type {array<EmagJs.Core.Math.Vector>}
         */
        this.points = [
            new Vector(1, 0.4),
            new Vector(-1, 0.4),
            new Vector(-1, -0.4),
            new Vector(1, -0.4),
        ];

    }

}