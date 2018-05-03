/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Triangle polygon
 * 
 * @extends EmagJS.Core.Geom.Polygon
 */
class Triangle extends Polygon {

    constructor() {

        super();

        /**
         * @type {array<EmagJS.Core.Math.Vector>}
         */
        this.points = [
            new Vector(1, -0.025),
            new Vector(-0.5, 0.5),
            new Vector(-0.5, -0.5),
        ];

    }

}