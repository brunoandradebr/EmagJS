/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Rectangle
 * 
 * @extends EmagJS.Core.Geom.Polygon
 */
class Rectangle extends Polygon {

    constructor() {

        super();

        /**
         * @type {array<EmagJS.Core.Math.Vector>}
         */
        this.points = [
            new Vector(1, 0.4),
            new Vector(-1, 0.4),
            new Vector(-1, -0.4),
            new Vector(1, -0.4),
        ];

    }

}