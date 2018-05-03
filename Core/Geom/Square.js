/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Square
 * 
 * @extends EmagJs.Core.Geom.Polygon
 */
class Square extends Polygon {

    constructor() {

        super();

        /**
         * @type {array<EmagJs.Core.Math.Vector>}
         */
        this.points = [
            new Vector(0.5, 0.5),
            new Vector(-0.5, 0.5),
            new Vector(-0.5, -0.5),
            new Vector(0.5, -0.5),
        ];

    }

}