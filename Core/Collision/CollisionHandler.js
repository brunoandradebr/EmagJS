/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Collision handler
 */
class CollisionHandler {


    constructor() {

        /**
         * Penetration length
         * 
         * @type {number}
         */
        this.overlap = null;

        /**
         * Collision normal
         * 
         * @type {EmagJS.Core.Math.Vector}
         */
        this.normal = new Vector(0, 0);

        /**
         * Points of collision
         * 
         * @type {array}
         */
        this.points = [];

        /**
         * Closest point among all collision points
         * 
         * @type {EmagJS.Core.Math.Vector}
         */
        this.closestPoint = null;

        /**
         * Minimum Translation Vector
         * 
         * @type {EmagJS.Core.Math.Vector}
         */
        this.mtv = new Vector();

        /**
         * Temporary vector to avoid garbage collector
         * 
         * @type {EmagJS.Core.Math.Vector}
         */
        this.tmpPoint1 = new Vector();
        this.tmpPoint2 = new Vector();

        /**
         * Temporary points used in SAT
         * 
         * @type {array}
         */
        this.tmpPoints = [];

    }


    /**
     * Intrface to check collision between any object
     * 
     * @param {*} A           - Any interactive object
     * @param {*} B           - Any interactive object
     * @param {any} collisionSettings - Extra information to collision check method
     * 
     * @return {*}
     */
    check(A, B, collisionSettings) {

        // clear collision manifold
        this.points.length = 0;
        this.closestPoint = null;
        this.mtv.x = this.mtv.y = 0;
        this.overlap = 0;
        this.normal.x = 0;
        this.normal.y = 0;
        this.tmpPoint1.x = this.tmpPoint1.y = 0
        this.tmpPoint2.x = this.tmpPoint2.y = 0
        this.tmpPoints.length = 0

        let AConstructor = A.extends ? A.extends : A.constructor.name
        let BConstructor = B.extends ? B.extends : B.constructor.name

        // collision between Shapes
        if (AConstructor == 'Shape' && BConstructor == 'Shape')
            return this.SAT(A, B);

        // collision between Sprites
        if (AConstructor == 'Sprite' && BConstructor == 'Sprite')
            return this.spriteToSpriteCollision(A, B)

        // collision between Lines
        if (AConstructor == 'Line' && BConstructor == 'Line')
            return this.lineToLineCollision(A, B, collisionSettings)

        // collision between Line and Shape
        if (AConstructor == 'Line' && BConstructor == 'Shape')
            return this.lineToShapeCollision(A, B)

        // collision between bounding box
        if (AConstructor == 'Object' && BConstructor == 'Object')
            return this.boundingBoxToBoundingBoxCollision(A, B, collisionSettings)

        // collision between Circles
        if (AConstructor == 'Circle' && BConstructor == 'Circle')
            return this.circleToCircleCollision(A, B)

        // collision between Circle and screen boundary
        if (AConstructor == 'Circle' && B == 'screen')
            return this.circleToScreenCollision(A, collisionSettings)

        // collision between Circle and Shape
        if (AConstructor == 'Circle' && BConstructor == 'Shape')
            return this.circleToShapeCollision(A, B)

        // collision between Point and Shape
        if (AConstructor == 'Vector' && BConstructor == 'Shape')
            return this.pointToShapeCollision(A, B)

        // collision between Point and Circle
        if (AConstructor == 'Vector' && BConstructor == 'Circle')
            return this.pointToCircleCollision(A, B)

        // collision between Circle and Line
        if (AConstructor == 'Circle' && BConstructor == 'Line')
            return this.circleToLineCollision(A, B, collisionSettings)

    }

    /**
     * Bounces a representation's body away
     * 
     * @param {EmagJS.Core.Render.Shape | EmagJS.Core.Render.Sprite} A - Shape or Sprite representation with a body object
     * @param {EmagJS.Core.Display.Scene} scene
     * 
     * @return {void}
     */
    static bounceScreen(A, scene = Scene) {

        if (A.constructor.name == 'Shape' || A.constructor.name == 'Sprite') {
            if (A.body) {
                if (A.body.position.x > scene.width) {
                    A.body.position.x = scene.width
                    A.body.velocity.x *= -1
                }
                if (A.body.position.x < 0) {
                    A.body.position.x = 0
                    A.body.velocity.x *= -1
                }
                if (A.body.position.y > scene.height) {
                    A.body.position.y = scene.height
                    A.body.velocity.y *= -1
                }
                if (A.body.position.y < 0) {
                    A.body.position.y = 0
                    A.body.velocity.y *= -1
                }
            }
        }

    }

    /**
     * Calculates distance from object to line
     * info : 
     *         point in object closest to line
     *         point in line closest to object
     *         distance from points
     * 
     * @param {EmagJS.Core.Render.Shape | EmagJS.Core.Render.Circle} object 
     * @param {EmagJS.Core.Render.Line} line 
     * 
     * @return {Object}
     */
    static distanceToLine(object, line) {

        // distance to circle
        if (object.constructor.name == 'Circle') {

            let pointInCircle,
                pointInLine,
                projection

            let linePlane = line.plane
            let lineNormal = line.normal.normalize
            let objectToLineStart = line.start.clone().subtract(object.position)
            let objectToLineEnd = line.end.clone().subtract(object.position)

            // if line is not facing object
            if (linePlane.dot(objectToLineStart) > 0) {
                projection = objectToLineStart.normalize.multiplyScalar(object.radius)
                pointInCircle = object.position.clone().add(projection)
                pointInLine = line.start
            } else {

                // check if line end is right from object center imaginary line (perpendicular to line)
                if (objectToLineEnd.cross(lineNormal).z < 0) {
                    projection = lineNormal.multiplyScalar(object.radius)

                    // if line end is above object, reverse projection
                    if (objectToLineEnd.cross(objectToLineStart).z > 0)
                        projection.reverse

                    pointInCircle = object.position.clone().add(projection)

                    let pointInCircleToLineStart = line.start.clone().add(pointInCircle.clone().subtract(line.start).project(linePlane))
                    pointInLine = pointInCircleToLineStart

                } else {
                    projection = objectToLineEnd.normalize.multiplyScalar(object.radius)
                    pointInLine = line.end
                    pointInCircle = object.position.clone().add(projection)
                }

            }

            return {
                pointInObject: pointInCircle,
                pointInLine: pointInLine,
                distance: pointInLine.clone().subtract(pointInCircle).length,
            }

        } else {

            // test with shape

            let objectPoints = object.getVertices()
            let pointInLine = line.start
            let pointInObject = objectPoints[0]
            let closestDistance = Infinity

            let lineNotFacingObject = false

            // for each object point
            objectPoints.map((point) => {

                // vector from line start to point
                let pointToLine = point.clone().subtract(line.start)
                // projects pointToLine vector on line
                let pointToLineProjection = pointToLine.project(line.plane)
                // the same as vector.length but without square root
                let pointDistanceToLine = Math.abs(pointToLineProjection.subtract(pointToLine).dot(line.normal.normalize))

                // update closest point to line
                if (pointDistanceToLine < closestDistance) {
                    // update closest distance
                    closestDistance = pointDistanceToLine
                    // update point in object nearest to line
                    pointInObject = point
                    // projects vector from line start to point in object in line
                    let pointInObjectProjection = pointInObject.clone().subtract(line.start).project(line.plane)
                    // get point in line
                    pointInLine = line.start.clone().add(pointInObjectProjection)
                    // update flag
                    lineNotFacingObject = pointInObjectProjection.cross(line.normal).z > 0
                }

            })

            // if line is not facing object
            if (lineNotFacingObject) {

                // update point in line to line start
                pointInLine = line.start

                // update point in object to the closest to point to line start
                let closestDistanceToLineStart = Infinity
                objectPoints.map((point) => {
                    let distanceX = point.x - line.start.x
                    let distanceY = point.y - line.start.y
                    let distanceSquared = distanceX * distanceX + distanceY * distanceY
                    if (distanceSquared < closestDistanceToLineStart) {
                        pointInObject = point
                        closestDistanceToLineStart = distanceSquared
                    }
                })

                closestDistance = Math.sqrt(closestDistanceToLineStart)

            } else {

                // TODO - GET POINT IN OBJECT SEGMENT, NOT CLOSEST POINT TO POINT IN LINE

                // vector from line start to point in line
                let pointInLineToLineStart = pointInLine.clone().subtract(line.start).lengthSquared

                // if point in line is outside line segment
                if (pointInLineToLineStart > line.lengthSquared) {

                    // update point in line to line end
                    pointInLine = line.end

                    // update point in object to the closest to point to line end
                    let closestDistanceToLineEnd = Infinity
                    objectPoints.map((point) => {
                        let distanceX = point.x - line.end.x
                        let distanceY = point.y - line.end.y
                        let distanceSquared = distanceX * distanceX + distanceY * distanceY
                        if (distanceSquared < closestDistanceToLineEnd) {
                            pointInObject = point
                            closestDistanceToLineEnd = distanceSquared
                        }
                    })

                    closestDistance = Math.sqrt(closestDistanceToLineEnd)

                }

            }

            return {
                pointInObject: pointInObject,
                pointInLine: pointInLine,
                distance: closestDistance,
            }

        }

    }

    /**
     * Sorts a list of vectors or objects that have a position vector by line axis
     * 
     * @param {EmagJS.Core.Render.Line} line 
     * @param {<EmagJS.Core.Math.Vector | EmagJS.Core.Render.Sprite|Shape|Circle>} objects 
     * 
     * @return {void}
     */
    static lineSorting(line, objects) {

        objects.sort((a, b) => {

            // cache line plane
            let linePlane = line.plane

            // vector A or object A - A.position.subtract(line.start).dot(line.plane)
            let adx, ady
            if (a.position) {
                adx = a.position.x - line.start.x
                ady = a.position.y - line.start.y
            } else {
                adx = a.x - line.start.x
                ady = a.y - line.start.y
            }
            let adot = adx * linePlane.x + ady * linePlane.y

            // vector B or object B - B.position.subtract(line.start).dot(line.plane)
            let bdx, bdy
            if (b.position) {
                bdx = b.position.x - line.start.x
                bdy = b.position.y - line.start.y
            } else {
                bdx = b.x - line.start.x
                bdy = b.y - line.start.y
            }
            let bdot = bdx * linePlane.x + bdy * linePlane.y

            // sort
            return adot - bdot
        })

    }

    /**
     * Slices a list of shapes
     * 
     * @param {EmagJS.Core.Render.Line} line 
     * @param {EmagJS.Core.Render.Shape} shape
     * @param {string} keep - which side to keep : left | right | both | biggest | smaller
     * 
     * @return {object<EmagJS.Core.Render.Shape>} 
     */
    sliceShape(line, listShape, keep = 'both') {

        let collision = new CollisionHandler()

        let newPieces = []

        listShape.map((shape, i) => {

            if (shape.newPiece == undefined) {

                // if line intersect shape
                if (collision.check(line, shape)) {

                    // if there are 2 intersection points
                    if (collision.points.length > 1) {

                        // intersections points
                        let p1 = collision.points[0]
                        let p2 = collision.points[1]

                        // line plane
                        let linePlane = line.plane

                        // points on left side of line
                        let leftPoints = []
                        // left points centroid
                        let leftPointsCentroid = new Vector()
                        // points on right side of line
                        let rightPoints = []
                        // right points centroid
                        let rightPointsCentroid = new Vector()

                        // shape points
                        shape.getVertices().map((point) => {

                            // vector from line start to point
                            let pointToLineStart = point.clone().subtract(line.start)

                            // dot product from line start to point vector with line right normal
                            // < 0 left from line
                            // > 0 right from line
                            let side = pointToLineStart.dot(linePlane.rightNormal)

                            // left point
                            if (side < 0) {
                                // calculate left points centroid
                                leftPointsCentroid.x += point.x
                                leftPointsCentroid.y += point.y
                                // add point to left list
                                leftPoints.push(point)
                            } else { // right points
                                // calculate right points centroid
                                rightPointsCentroid.x += point.x
                                rightPointsCentroid.y += point.y
                                // add point to right list
                                rightPoints.push(point)
                            }

                        })

                        // add intersection points to left centroid calculation
                        leftPointsCentroid.x += p1.x
                        leftPointsCentroid.y += p1.y
                        leftPointsCentroid.x += p2.x
                        leftPointsCentroid.y += p2.y
                        // add intersection points to left points
                        leftPoints.push(p1, p2)
                        // divide by total left points
                        leftPointsCentroid.x /= leftPoints.length
                        leftPointsCentroid.y /= leftPoints.length

                        // add intersection points to right centroid calculation
                        rightPointsCentroid.x += p1.x
                        rightPointsCentroid.y += p1.y
                        rightPointsCentroid.x += p2.x
                        rightPointsCentroid.y += p2.y
                        // add intersection points to right points
                        rightPoints.push(p1, p2)
                        // divide by total right points
                        rightPointsCentroid.x /= rightPoints.length
                        rightPointsCentroid.y /= rightPoints.length

                        // left shape new points
                        let leftShapePoints = []
                        leftPoints.map((point) => {
                            // vector from left point to left centroid
                            let newPoint = point.clone().subtract(leftPointsCentroid)
                            // add new point to left shape points list
                            leftShapePoints.push(newPoint)
                        })

                        // sort left shape points by angle
                        leftShapePoints.sort((a, b) => a.angle - b.angle)

                        // creates new shape object
                        let leftShape = new Shape(new Polygon(leftShapePoints), leftPointsCentroid, 1, 1, shape.fillColor, shape.lineWidth, shape.lineColor)
                        // left shape flags
                        leftShape.newPiece = true
                        leftShape.leftSide = true
                        leftShape.originalShape = shape

                        // right shape new points
                        let rightShapePoints = []
                        rightPoints.map((point) => {
                            // vector from right point to right centroid
                            let newPoint = point.clone().subtract(rightPointsCentroid)
                            // add new point to right shape points list
                            rightShapePoints.push(newPoint)
                        })

                        // sort right shape points by angle
                        rightShapePoints.sort((a, b) => a.angle - b.angle)

                        // creates new shape object
                        let rightShape = new Shape(new Polygon(rightShapePoints), rightPointsCentroid, 1, 1, shape.fillColor, shape.lineWidth, shape.lineColor)
                        // right shape flags
                        rightShape.newPiece = true
                        rightShape.rightSide = true
                        rightShape.originalShape = shape

                        // add left and right shape to new pieces list
                        if (keep == 'both' || keep == 'left')
                            newPieces.push(leftShape)
                        if (keep == 'both' || keep == 'right')
                            newPieces.push(rightShape)
                        if (keep == 'biggest')
                            newPieces.push(leftShape.area > rightShape.area ? leftShape : rightShape)
                        if (keep == 'smaller')
                            newPieces.push(leftShape.area < rightShape.area ? leftShape : rightShape)

                        // flag sliced shape
                        shape.sliced = true
                        shape.newPiece = false

                    }
                }
            }
        })

        return newPieces.length ? newPieces : false

    }

    /**
     * SAT - Separating Axis Theorem
     * 
     * @param {EmagJS.Core.Render.Shape} A 
     * @param {EmagJS.Core.Render.Shape} B
     * 
     * @return {bool}
     */
    SAT(A, B) {

        let isColliding = true;

        let minOverlap = Infinity;
        let axis = null;

        let ANormals = A.getNormals();

        // for each A shape normals
        for (let normal of ANormals) {

            // get shapes projection on normal - min and max point on normal axis
            let aProjection = A.getSupportPoints(normal.x, normal.y);
            let bProjection = B.getSupportPoints(normal.x, normal.y);

            let aMinProjection = aProjection.minProjection;
            let aMaxProjection = aProjection.maxProjection;
            let bMinProjection = bProjection.minProjection;
            let bMaxProjection = bProjection.maxProjection;

            // if there is a gap between projections
            if (bMinProjection > aMaxProjection || bMaxProjection < aMinProjection) {
                isColliding = false;
                continue
            }

            // shapes are colliding. calculates penetration length

            // shape A is before shape B
            if (aMinProjection < bMinProjection) {
                if (aMaxProjection < bMaxProjection) {
                    var overlap = aMaxProjection - bMinProjection;
                } else {
                    let option1 = aMaxProjection - bMinProjection;
                    let option2 = bMaxProjection - aMinProjection;
                    var overlap = option1 < option2 ? option1 : -option2;
                }
            }
            // shape B is before shape A
            else {
                if (aMaxProjection > bMaxProjection) {
                    var overlap = aMinProjection - bMaxProjection;
                } else {
                    let option1 = aMaxProjection - bMinProjection;
                    let option2 = bMaxProjection - aMinProjection;
                    var overlap = option1 < option2 ? option1 : -option2;
                }
            }

            // updates minimum overlap and normal
            if (Math.abs(overlap) < minOverlap) {

                minOverlap = Math.abs(overlap);
                axis = normal;

                // adjusts normal
                if (overlap > 0)
                    axis.reverse;
            }

        }

        if (!isColliding) return false

        let BNormals = B.getNormals();

        // for each A shape normals
        for (let normal of BNormals) {

            // get shapes projection on normal - min and max point on normal axis
            let aProjection = A.getSupportPoints(normal.x, normal.y);
            let bProjection = B.getSupportPoints(normal.x, normal.y);

            var aMinProjection = aProjection.minProjection;
            var aMaxProjection = aProjection.maxProjection;
            var bMinProjection = bProjection.minProjection;
            var bMaxProjection = bProjection.maxProjection;

            // if there is a gap between projections
            if (bMinProjection > aMaxProjection || bMaxProjection < aMinProjection) {
                isColliding = false;
                continue
            }

            // shapes are colliding. calculates penetration length

            // shape A is before shape B
            if (aMinProjection < bMinProjection) {

                if (aMaxProjection < bMaxProjection) {
                    var overlap = aMaxProjection - bMinProjection;
                } else {
                    let option1 = aMaxProjection - bMinProjection;
                    let option2 = bMaxProjection - aMinProjection;
                    var overlap = option1 < option2 ? option1 : -option2;
                }
            }
            // shape B is before shape A
            else {
                if (aMaxProjection > bMaxProjection) {
                    var overlap = aMinProjection - bMaxProjection;
                } else {
                    let option1 = aMaxProjection - bMinProjection;
                    let option2 = bMaxProjection - aMinProjection;
                    var overlap = option1 < option2 ? option1 : -option2;
                }
            }

            // updates minimum overlap and normal
            if (Math.abs(overlap) < minOverlap) {

                minOverlap = Math.abs(overlap);
                axis = normal;

                // adjusts normal
                if (overlap > 0)
                    axis.reverse;
            }

        }

        this.overlap = minOverlap;
        this.normal = axis;
        this.normal.multiplyScalar(minOverlap, this.mtv);

        // get points of collision

        // get all points of A that are opposite to collision normal
        const AVertices = A.getVertices()
        let pointsOppositeToCollisionNormal = []
        for (let point of AVertices) {
            const dx = point.x - A.position.x
            const dy = point.y - A.position.y
            const dot = dx * axis.x + dy * axis.y
            if (dot < 0) {
                pointsOppositeToCollisionNormal.push(point)
            }
        }

        // only consider points that are inside other polygon
        for (let point of pointsOppositeToCollisionNormal) {
            if (B.contains(point, 0.1))
                this.tmpPoints.push(point)
        }

        // if there are more than two points inside other polygon
        // consider all point's centroid
        const nPointsInsideB = this.tmpPoints.length
        if (nPointsInsideB > 1) {
            for (let point of this.tmpPoints) {
                this.tmpPoint1.x += point.x
                this.tmpPoint1.y += point.y
            }
            const inverLength = 1 / nPointsInsideB
            this.tmpPoint1.x *= inverLength
            this.tmpPoint1.y *= inverLength
            this.points.push(this.tmpPoint1)
        } else if (nPointsInsideB === 1) {
            this.tmpPoint1.x = this.tmpPoints[0].x
            this.tmpPoint1.y = this.tmpPoints[0].y
            this.points.push(this.tmpPoint1)
        }

        // get all points of B that are opposite to collision normal
        const BVertices = B.getVertices()
        pointsOppositeToCollisionNormal.length = 0
        for (let point of BVertices) {
            const dx = point.x - B.position.x
            const dy = point.y - B.position.y
            const dot = dx * -axis.x + dy * -axis.y
            if (dot < 0) {
                pointsOppositeToCollisionNormal.push(point)
            }
        }

        this.tmpPoints.length = 0

        // only consider points that are inside other polygon
        for (let point of pointsOppositeToCollisionNormal) {
            if (A.contains(point, 0.1))
                this.tmpPoints.push(point)
        }

        // if there are more than two points inside other polygon
        // consider all point's centroid
        const nPointsInsideA = this.tmpPoints.length
        if (nPointsInsideA > 1) {
            for (let point of this.tmpPoints) {
                this.tmpPoint2.x += point.x
                this.tmpPoint2.y += point.y
            }
            const inverLength = 1 / nPointsInsideA
            this.tmpPoint2.x *= inverLength
            this.tmpPoint2.y *= inverLength
            this.points.push(this.tmpPoint2)
        } else if (nPointsInsideA === 1) {
            this.tmpPoint2.x = this.tmpPoints[0].x
            this.tmpPoint2.y = this.tmpPoints[0].y
            this.points.push(this.tmpPoint2)
        }

        this.pointA = this.tmpPoint1
        this.pointB = this.tmpPoint2

        if (this.pointA.x == this.pointA.y == this.pointA.z == 0) {
            this.pointA = this.pointB
        }
        
        if (this.pointB.x == this.pointB.y == this.pointB.z == 0) {
            this.pointB = this.pointA
        }

        return isColliding

    }

    /**
    * Sprite vs Sprite collision
    * 
    * @param {EmagJS.Core.Render.Sprite} A 
    * @param {EmagJS.Core.Render.Sprite} B 
    * 
    * @return {bool}
    */
    spriteToSpriteCollision(A = Sprite, B = Sprite) {

        let AhalfWidth = A.width * 0.5
        let AhalfHeight = A.height * 0.5

        let BhalfWidth = B.width * 0.5
        let BhalfHeight = B.height * 0.5

        let distanceX = Math.abs(B.position.x - A.position.x)

        if (distanceX > AhalfWidth + BhalfWidth)
            return false

        let distanceY = Math.abs(B.position.y - A.position.y)

        if (distanceY > AhalfHeight + BhalfHeight)
            return false

        let overlapX = (AhalfWidth + BhalfWidth) - distanceX
        let overlapY = (AhalfHeight + BhalfHeight) - distanceY

        if (overlapX < overlapY) {
            if (A.position.x < B.position.x) {
                this.normal.x = -1
            } else {
                this.normal.x = 1
            }
            this.normal.y = 0
            this.overlap = overlapX
        } else {
            if (A.position.y < B.position.y) {
                this.normal.y = -1
            } else {
                this.normal.y = 1
            }
            this.normal.x = 0
            this.overlap = overlapY
        }

        this.mtv.x = this.normal.x * this.overlap
        this.mtv.y = this.normal.y * this.overlap

        return true
    }

    /**
     * Line vs Line collision
     * 
     * @param {EmagJS.Core.Render.Line} A 
     * @param {EmagJS.Core.Render.Line} B 
     * @param {number} offset - 0 even very small angles
     * 
     * @return {bool}
     */
    lineToLineCollision(A = Line, B = Line, offset = .01) {

        let aux = B.start.clone().subtract(A.start);

        let s1 = aux.cross(B.plane).z;
        let s2 = A.plane.cross(B.plane).z;

        let f = s1 / s2;

        if (f > 0 && f <= 1) {

            let collisionPoint = A.start.clone().add(A.plane.clone().multiplyScalar(f));

            let dot = collisionPoint.clone().subtract(B.start).dot(B.plane);

            if (dot >= offset && dot <= B.plane.lengthSquared - offset) {
                this.points[0] = collisionPoint;
                return true;
            }

        }

    }

    /**
     * Line vs shape collision
     * 
     * @param {EmagJS.Core.Render.Line} A 
     * @param {EmagJS.Core.Render.Shape} B
     * 
     * @return {bool}
     */
    lineToShapeCollision(A = Line, B = Shape) {

        let lines = B.getLines();
        let length = lines.length;

        // dot product to know whitch point is closest to line
        let minDistance = Infinity;

        // for each shape's line
        for (let i = 0; i < length; i++) {

            let line = lines[i];

            let aux = line.start.clone().subtract(A.start);

            let s1 = aux.cross(line.plane).z;
            let s2 = A.plane.cross(line.plane).z;

            let f = s1 / s2;

            if (f > 0 && f <= 1) {

                let collisionPoint = A.start.clone().add(A.plane.clone().multiplyScalar(f));

                let dot = collisionPoint.clone().subtract(line.start).dot(line.plane);

                if (dot >= 0 && dot <= line.plane.lengthSquared) {

                    this.points.push(collisionPoint);

                    // get closest point collision
                    let minDistanceDot = collisionPoint.dot(A.plane);
                    if (minDistanceDot < minDistance) {
                        minDistance = minDistanceDot;
                        this.closestPoint = collisionPoint;
                        this.normal = line.normal
                    }

                }

            }

        }

        return this.points.length ? true : false;

    }

    /**
     * Collision between bounding box
     * 
     * @param {object} A 
     * @param {object} B 
     * @param {object} offset 
     * 
     * @return {bool}
     */
    boundingBoxToBoundingBoxCollision(A = Object, B = Object, offset = { x: 0, y: 0 }) {

        if (A.centerX + A.width * 0.5 + offset.x > B.centerX - B.width * 0.5 - offset.x && A.centerX - A.width * 0.5 - offset.x < B.centerX + B.width * 0.5 + offset.x) {
            if (A.centerY + A.height * 0.5 + offset.y > B.centerY - B.height * 0.5 - offset.y && A.centerY - A.height * 0.5 - offset.y < B.centerY + B.height * 0.5 + offset.y) {
                return true
            }
        }

        return false

    }

    /**
     * Collision between circles
     * 
     * @param {EmagJS.Core.Render.Circle} A 
     * @param {EmagJS.Core.Render.Circle} B
     * 
     * @return {bool}
     */
    circleToCircleCollision(A = Circle, B = Circle) {

        let distance = B.position.clone().subtract(A.position)

        let radii = (A.radius + B.radius) * (A.radius + B.radius)

        if (distance.lengthSquared < radii) {

            let normal = distance.clone().normalize
            let overlap = -Math.abs((A.radius + B.radius) - distance.length)
            let mtv = normal.clone().multiplyScalar(overlap)
            let collisionPoint = B.position.clone().add(normal.clone().multiplyScalar(-B.radius))

            this.normal = normal
            this.overlap = overlap
            this.mtv = mtv
            this.points[0] = collisionPoint

            return true
        }

        return false

    }

    /**
     * Collision between circle and line
     * 
     * @param {EmagJS.Core.Render.Circle} A
     * @param {EmagJS.Core.Render.Line} B
     * @param {bool} checkLineEdges
     * 
     * @return {bool}
     */
    circleToLineCollision(A = Circle, B = Line, checkLineEdges = true) {

        let linePlane = B.plane
        let lineNormal = linePlane.normalize.leftNormal

        let circleToLine = A.position.clone().subtract(B.start)
        let projection = circleToLine.dot(linePlane)

        let isLeft = circleToLine.dot(lineNormal) < 0

        let isVoronoiRegion = projection < 0 || projection * projection > B.lengthSquared

        let overlap

        // circle is colliding with line edges
        if (isVoronoiRegion) {

            if (checkLineEdges) {

                let closestPoint

                // circle is near line start point
                if (projection < 0) {
                    closestPoint = B.start
                } else {
                    closestPoint = B.end
                }

                let distanceToCenter = A.position.clone().subtract(closestPoint)

                let isColliding = distanceToCenter.lengthSquared < A.radius * A.radius

                if (isColliding) {
                    this.points[0] = closestPoint
                    this.normal = distanceToCenter.clone().normalize
                    this.overlap = A.radius - distanceToCenter.length
                    this.mtv.x = this.normal.x * this.overlap
                    this.mtv.y = this.normal.y * this.overlap
                }

                return isColliding

            } else {

                return false

            }

        } else {

            overlap = circleToLine.dot(lineNormal)
            overlap = isLeft ? overlap + A.radius : overlap - A.radius

            let isColliding = isLeft && overlap > 0 ? true : !isLeft && overlap < 0 ? true : false

            if (isColliding) {
                this.points[0] = B.start.clone().add(circleToLine.project(linePlane))
                this.overlap = overlap ? -overlap : overlap
                this.normal = lineNormal
                this.mtv.x = this.normal.x * this.overlap
                this.mtv.y = this.normal.y * this.overlap
            }

            return isColliding

        }


    }

    /**
     * Checks if a point intersects a polygon
     * 
     * @param {EmagJS.Core.Math.Vector} A 
     * @param {EmagJS.Core.Render.Shape} B
     * 
     * @return {bool} 
     */
    pointToShapeCollision(A = Vector, B = Shape) {

        let lines = B.getLines()
        let linesLength = lines.length

        let closestLine = lines[0]
        let minDot = Infinity

        // check if point is inside polygon
        for (let i = 0; i < linesLength; i++) {

            let line = lines[i]

            let aux = line.start.clone().subtract(A)
            let dot = aux.dot(line.normal.normalize)

            if (dot < 0)
                return false

            // closest line to point
            if (dot < minDot) {
                minDot = dot
                closestLine = line
            }
        }

        // collision normal
        let normal = closestLine.normal.normalize
        this.normal = normal

        // MTV
        this.overlap = minDot
        this.mtv.x = normal.x * minDot
        this.mtv.y = normal.y * minDot

        // point of collision
        let point = A.clone().add(this.mtv)
        this.points[0] = point

        return true
    }

    /**
     * Checks if a point intersects a Circle
     * 
     * @param {EmagJS.Core.Math.Vector} A 
     * @param {EmagJS.Core.Render.Circle} B
     * 
     * @return {bool} 
     */
    pointToCircleCollision(A = Vector, B = Circle) {

        let dx = B.position.x - A.x
        let dy = B.position.y - A.y

        let distance = dx * dx + dy * dy

        if (distance < B.radius * B.radius) return true

        return false

    }

    /**
     * Checks if a circle collided with a polygon
     * 
     * TODO - improve nearest line check
     * 
     * @param {EmagJS.Core.Render.Circle} A 
     * @param {EmagJS.Core.Render.Shape} B
     * 
     * @return {bool}
     */
    circleToShapeCollision(A = Circle, B = Shape) {

        if (B.contains(A.position)) {

            const pointToShapeCollision = this.pointToShapeCollision(A.position, B)

            if (pointToShapeCollision) {
                this.mtv.x += this.normal.x * A.radius
                this.mtv.y += this.normal.y * A.radius
            }

            return pointToShapeCollision

        } else {

            let lines = B.getLines()
            let maxProjection = -Infinity
            let closestLine = lines[0]

            lines.map((line) => {

                let circleToLineStart = A.position.clone().subtract(line.start)
                let projection = circleToLineStart.dot(line.plane.leftNormal)

                if (projection >= maxProjection) {
                    maxProjection = projection
                    closestLine = line
                }

            })

            return this.circleToLineCollision(A, closestLine)
        }
    }

    /**
     * Bounce circle at screen edge
     * 
     * @param {EmagJS.Core.Render.Circle} A
     * @param {object} offset 
     * 
     * @return {void}
     */
    circleToScreenCollision(A = Circle, offset = { x: 0, y: 0 }) {

        if (A.position.x > (DEVICE_WIDTH - offset.x) - A.radius) {

            if (A.body) {
                A.body.position.x = (DEVICE_WIDTH - offset.x) - A.radius
                A.body.velocity.x *= -1
            }

            A.position.x = (DEVICE_WIDTH - offset.x) - A.radius

        }

        if (A.position.x < A.radius + offset.x) {

            if (A.body) {
                A.body.position.x = A.radius + offset.x
                A.body.velocity.x *= -1
            }

            A.position.x = A.radius + offset.x

        }

        if (A.position.y < A.radius + offset.y) {

            if (A.body) {
                A.body.position.y = A.radius + offset.y
                A.body.velocity.y *= -1
            }

            A.position.y = A.radius + offset.y

        }

        if (A.position.y > (DEVICE_HEIGHT - offset.y) - A.radius) {

            if (A.body) {
                A.body.position.y = (DEVICE_HEIGHT - offset.y) - A.radius
                A.body.velocity.y *= -1
            }

            A.position.y = (DEVICE_HEIGHT - offset.y) - A.radius

        }

    }

}