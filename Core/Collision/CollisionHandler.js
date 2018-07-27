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

    }


    /**
     * Intrface to check collision between any object
     * 
     * @param {*} A           - Any interactive object
     * @param {*} B           - Any interactive object
     * @param {object} offset - An object with offset information { x: 0, y: 0 }
     * 
     * @return {*}
     */
    check(A, B, offset) {

        // clear collision manifold
        this.points.length = 0;
        this.closestPoint = null;
        this.mtv.x = this.mtv.y = 0;
        this.overlap = 0;
        this.normal.x = 0;
        this.normal.y = 0;

        // collision between Shapes
        if (A.constructor.name == 'Shape' && B.constructor.name == 'Shape')
            return this.SAT(A, B);

        // collision between Sprites
        if (A.constructor.name == 'Sprite' && B.constructor.name == 'Sprite')
            return this.spriteToSpriteCollision(A, B)

        // collision between Lines
        if (A.constructor.name == 'Line' && B.constructor.name == 'Line')
            return this.lineToLineCollision(A, B)

        // collision between Line and Shape
        if (A.constructor.name == 'Line' && B.constructor.name == 'Shape')
            return this.lineToShapeCollision(A, B)

        // collision between bounding box
        if (A.constructor.name == 'Object' && B.constructor.name == 'Object')
            return this.boundingBoxToBoundingBoxCollision(A, B, offset)

        // collision between Circles
        if (A.constructor.name == 'Circle' && B.constructor.name == 'Circle')
            return this.circleToCircleCollision(A, B)

        // collision between Circle and screen boundary
        if (A.constructor.name == 'Circle' && B == 'screen')
            return this.circleToScreenCollision(A)

        // collision between Circle and Shape
        if (A.constructor.name == 'Circle' && B.constructor.name == 'Shape')
            return this.circleToShapeCollision(A, B)

        // collision between Point and Shape
        if (A.constructor.name == 'Vector' && B.constructor.name == 'Shape')
            return this.pointToShapeCollision(A, B)

        // collision between Circle and Line
        if (A.constructor.name == 'Circle' && B.constructor.name == 'Line')
            return this.circleToLineCollision(A, B)

    }

    /**
     * Bounces a representation's body away
     * 
     * @param {Shape | Sprite} A - Shape or Sprite representation with a body object
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
        ANormals.forEach((normal) => {

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

        });

        let BNormals = B.getNormals();

        // for each A shape normals
        BNormals.forEach((normal) => {

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

        });

        this.overlap = minOverlap;
        this.normal = axis;
        this.normal.multiplyScalar(minOverlap, this.mtv);

        // contact point -- TODO - better func -- SAT normal is different from collision point normal
        // let BPointsInsideA = [];
        // B.points.forEach((point) => {
        //     if (A.contains(point))
        //         BPointsInsideA.push(point);
        // })
        // let APointsInsideB = [];
        // A.points.forEach((point) => {
        //     if (B.contains(point))
        //         APointsInsideB.push(point);
        // })

        // let points = [...BPointsInsideA, ...APointsInsideB]

        // let minProjection = Infinity;
        // points.forEach((point) => {

        //     let dot = point.dot(this.normal);

        //     if (dot < minProjection) {
        //         minProjection = dot;
        //         this.points[0] = point;
        //     }

        // })

        return isColliding;

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
     * 
     * @return {bool}
     */
    lineToLineCollision(A = Line, B = Line) {

        let aux = B.start.clone().subtract(A.start);

        let s1 = aux.cross(B.plane);
        let s2 = A.plane.cross(B.plane);

        let f = s1 / s2;

        if (f > 0 && f <= 1) {

            let collisionPoint = A.start.clone().add(A.plane.clone().multiplyScalar(f));

            let dot = collisionPoint.clone().subtract(B.start).dot(B.plane);

            if (dot >= 0 && dot <= B.plane.lengthSquared) {
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

            let s1 = aux.cross(line.plane);
            let s2 = A.plane.cross(line.plane);

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
     * 
     * @return {bool}
     */
    circleToLineCollision(A = Circle, B = Line) {

        let linePlane = B.plane
        let lineNormal = linePlane.normalize.leftNormal

        let circleToLine = A.position.clone().subtract(B.start)
        let projection = circleToLine.dot(linePlane)

        let isLeft = circleToLine.dot(lineNormal) < 0

        let isVoronoiRegion = projection < 0 || projection * projection > B.lengthSquared

        let overlap

        // circle is colliding with line edges
        if (isVoronoiRegion) {

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
        this.mtv = normal.multiplyScalar(minDot)

        // point of collision
        let point = A.clone().add(this.mtv)
        this.points[0] = point

        return true
    }

    circleToShapeCollision(A = Circle, B = Shape) {

    }

    /**
     * Bounce circle at screen edge
     * 
     * @param {EmagJS.Core.Render.Circle} A
     * 
     * @return {void}
     */
    circleToScreenCollision(A = Circle) {

        if (A.position.x > DEVICE_WIDTH - A.radius) {
            A.body.position.x = DEVICE_WIDTH - A.radius
            A.body.velocity.x *= -1
        }
        if (A.position.x < A.radius) {
            A.body.position.x = A.radius
            A.body.velocity.x *= -1
        }
        if (A.position.y < A.radius) {
            A.body.position.y = A.radius
            A.body.velocity.y *= -1
        }
        if (A.position.y > DEVICE_HEIGHT - A.radius) {
            A.body.position.y = DEVICE_HEIGHT - A.radius
            A.body.velocity.y *= -1
        }

    }

}