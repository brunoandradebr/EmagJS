/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Square
 * 
 * @extends EmagJS.Core.Geom.Polygon
 */
class Square extends Polygon {

    constructor() {

        super();

        /**
         * @type {array<EmagJS.Core.Math.Vector>}
         */
        this.points = [
            new Vector(0.5, 0.5),
            new Vector(-0.5, 0.5),
            new Vector(-0.5, -0.5),
            new Vector(0.5, -0.5),
        ];

    }

}