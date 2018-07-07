/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Shape
 */
class Shape {

    /**
     * 
     * @param {EmagJS.Core.Geom.Polygon} polygon 
     * @param {EmagJS.Core.Math.Vector} position 
     * @param {number} width 
     * @param {number} height 
     * @param {string} fillColor 
     * @param {number} lineWidth 
     * @param {string} lineColor
     *  
     */
    constructor(polygon = new RandomPolygon, position = new Vector(0, 0), width = 50, height = 50, fillColor = '#f06', lineWidth = 0, lineColor = 'black') {

        /**
         * shape's model points
         * 
         * @type {EmagJS.Core.Geom.Polygon}
         */
        this.polygon = polygon;

        /**
         * @type {EmagJS.Core.Math.Vector}
         */
        this.position = position;

        /**
         * @type {string}
         */
        this.fillColor = fillColor;

        /**
         * @type {number}
         */
        this.lineWidth = lineWidth;

        /**
         * @type {string}
         */
        this.lineColor = lineColor;

        /**
         * copy it's polygon base points
         * 
         * @type {array<EmagJS.Core.Math.Vector>}
         */
        this.points = polygon.points.slice()

        /**
         * @type {number}
         */
        this.width = width

        /**
         * @type {number}
         */
        this.height = height

        /**
         * shape's transformation matrix
         * 
         * @type {EmagJS.Core.Math.Matrix}
         */
        this.matrix = new Matrix()

        // initial scale
        this.scale(this.width, this.height)

        // initial transformation
        this.transform()

        /**
         * Temporary shape lines
         * 
         * @type {array<EmagJS.Core.Render.Line>}
         */
        this._tmpLines = []

        // creates and cache all shape's lines
        for (let i = 0; i < this.points.length; i++) {
            this._tmpLines.push(new Line(undefined, undefined))
        }

        /**
         * Temporary shape normals
         * 
         * @type {array<EmagJS.Core.Math.Vector>}
         */
        this._tmpNormals = []

        // creates and cache all shape's normals
        for (let i = 0; i < this.points.length; i++) {
            this._tmpNormals.push(new Vector())
        }

    }

    /**
     * Scales width and height
     * 
     * @param {number} width 
     * @param {number} height
     * 
     * @return {void}
     */
    scale(width, height) {

        this.width = width
        this.height = height

        this.matrix.multiply([
            [this.width, 0, 0],
            [0, this.height, 0],
            [0, 0, 1],
        ])

    }

    /**
     * Rotates polygon
     * 
     * @param {number} angle
     * 
     * @return {void} 
     */
    rotateZ(angle) {
        this.matrix.identity()
        this.scale(this.width, this.height)
        this.matrix.rotateZ(angle)
    }

    /**
     * Transforms all points by it's transformation matrix
     * 
     * @return {void}
     */
    transform() {

        // transform all points
        this.polygon.points.forEach((point, i) => {
            this.points[i] = this.matrix.transform(point)
        });

        // reset matrix
        this.matrix.identity()

    }

    /**
     * get it's normals
     * 
     * @return {array<EmagJS.Core.Math.Vector>}
     */
    getNormals() {

        let points = this.points
        let pointsLength = points.length
        for (let i = 0; i < pointsLength; i++) {

            let pointA = points[i]
            let pointB = points[i + 1] ? points[i + 1] : points[0]

            this._tmpNormals[i] = pointB.clone().subtract(pointA).normalize.leftNormal

        }

        return this._tmpNormals

    }

    /**
     * get it's lines
     * 
     * @return {array<EmagJS.Core.Render.Line>}
     */
    getLines() {

        let points = this.points
        let pointsLength = points.length
        for (let i = 0; i < pointsLength; i++) {

            let pointA = points[i].clone()
            let pointB = points[i + 1] ? points[i + 1].clone() : points[0].clone()

            pointA.x += this.position.x
            pointA.y += this.position.y
            pointB.x += this.position.x
            pointB.y += this.position.y

            let line = this._tmpLines[i]
            line.start = pointA
            line.end = pointB

        }

        return this._tmpLines

    }

    /**
     * get it's support points - minimum projection/point
     *                           and maximum projection/point
     * 
     * @param {number} x 
     * @param {number} y 
     * 
     * @return {object}
     */
    getSupportPoints(x, y) {

        let points = this.points,
            pointsLength = points.length

        let minDot = Infinity
        let maxDot = -Infinity
        let minPoint = points[0],
            maxPoint = points[0]

        // finds min/max point and dot product - projection component
        for (let i = 0; i < pointsLength; i++) {

            let point = points[i].clone()
            point.x = this.position.x + point.x
            point.y = this.position.y + point.y

            let dot = point.x * x + point.y * y

            if (dot <= minDot) {
                minDot = dot
                minPoint = point
            }

            if (dot >= maxDot) {
                maxDot = dot
                maxPoint = point
            }

        }

        return {
            minProjection: minDot,
            maxProjection: maxDot,
            minPoint: minPoint,
            maxPoint: maxPoint
        }

    }

    /**
     * get it's bounding box object
     * 
     * @return {object}
     */
    getBoundingBox(offsetWidth = 0, offsetHeight = 0) {

        let horizontalSupportPoints = this.getSupportPoints(1, 0)
        let verticalSupportPoints = this.getSupportPoints(0, 1)

        let startX = horizontalSupportPoints.minPoint.x
        let startY = verticalSupportPoints.minPoint.y

        let width = horizontalSupportPoints.maxPoint.x - horizontalSupportPoints.minPoint.x
        let height = verticalSupportPoints.maxPoint.y - verticalSupportPoints.minPoint.y

        let centerX = startX + width * 0.5
        let centerY = startY + height * 0.5

        return {
            startX: startX - offsetWidth * 0.5,
            startY: startY - offsetHeight * 0.5,
            centerX: centerX,
            centerY: centerY,
            width: width + (offsetWidth * 0.5),
            height: height + (offsetHeight * 0.5)
        }

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics 
     * 
     * @return {void}
     */
    draw(graphics) {

        // shape border portion - to sharpen render borders
        let borderPortion = this.lineWidth * 0.5 || 0;

        graphics.save();

        graphics.lineCap = 'round';
        graphics.lineJoin = 'round';

        // shape appearance
        graphics.fillStyle = this.fillColor;
        graphics.lineWidth = this.lineWidth;
        graphics.strokeStyle = this.lineColor;


        // line shape
        graphics.beginPath();
        this.points.forEach((point) => {
            graphics.lineTo(this.position.x + point.x + borderPortion | 0, this.position.y + point.y + borderPortion | 0);
        });
        graphics.closePath();

        // fill shape
        if (this.fillColor != undefined)
            graphics.fill();

        // stroke shape
        if (this.lineWidth > 0)
            graphics.stroke();

        graphics.restore();

    }

}