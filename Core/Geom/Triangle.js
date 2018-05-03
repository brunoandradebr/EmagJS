/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Triangle polygon
 * 
 * @extends EmagJs.Core.Geom.Polygon
 */
class Triangle extends Polygon {

    constructor() {

        super();

        /**
         * @type {array<EmagJs.Core.Math.Vector>}
         */
        this.points = [
            new Vector(1, -0.025),
            new Vector(-0.5, 0.5),
            new Vector(-0.5, -0.5),
        ];

    }

}