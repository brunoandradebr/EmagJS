/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Package Platformer
 * 
 * Helper class to create platform genre entity
 */
class Entity extends Sprite {

    /**
     * 
     * @param {EmagJS.Core.Math.Vector} position 
     * @param {number} width 
     * @param {number} height 
     * @param {string} fillColor 
     * @param {number} lineWidth 
     */
    constructor(position = new Vector(100, 100), width = 32, height = 32, fillColor = 'transparent', lineWidth = 2) {
        super(position, width, height, fillColor, lineWidth)

        // collision masks
        this.collisionMask = []
        // foot mask
        this.collisionMask['foot'] = new Circle(this.position.clone(), 10, 'transparent', 1, 'red')
        this.collisionMask['foot'].offsetX = 0
        this.collisionMask['foot'].offsetY = 0
        // head mask
        this.collisionMask['head'] = new Shape(new Square, this.position.clone(), 10, 5, 'transparent', 1, 'blue')
        this.collisionMask['head'].offsetX = 0
        this.collisionMask['head'].offsetY = 0
        // body mask
        this.collisionMask['body'] = new Shape(new Square, this.position.clone(), 5, 20, 'transparent', 1, 'cyan')
        this.collisionMask['body'].offsetX = 0
        this.collisionMask['body'].offsetY = 0
        // raycast
        this.collisionMask['ray'] = new Line(this.position.clone(), new Vector)
        this.collisionMask['ray'].offsetX = 0
        this.collisionMask['ray'].offsetY = 2
        this.collisionMask['ray'].lineColor = 'black'
        this.collisionMask['ray'].lineWidth = 1

        // physic body
        this.body = new Body(this)
        this.body.gravity = new Vector(0, .2)
        this.body.friction = new Vector(.68, 1)

        // mechanics properties
        this.direction = new Vector(1, 0)
        this.body.accSpeed = new Vector(.3, 0)
        this.body.maxSpeed = new Vector(1.2, 4)
        this.body.jump = new Vector(0, -1)
        this.body.jumpTime = 0
        this.body.maxJump = 5.5

        // flags
        this.onGround = false

        // possibles states
        this.states = {
            STAND: true,
            WALK: true,
            JUMP: true,
            FALL: true
        }

        // FSM
        this.state = 'STAND'

    }

    /**
     * get state
     */
    get state() {
        return this._state
    }

    /**
     * set state - checks if state been set is active then update state property
     */
    set state(state) {
        if (this.states[state]) {
            this._state = state
        }
    }

    /**
     * Stand state
     * 
     * @return {void}
     */
    standState() {
        // implement on sub class
    }

    /**
     * Walk state
     * 
     * @return {void}
     */
    walkState() {
        // implement on sub class
    }

    /**
     * Change representation direction to left
     * 
     * @return {void}
     */
    turnLeft() {
        this.matrix.identity()
        this.matrix.scale(-1, 1)
        this.direction.x = -1
    }

    /**
     * Change representation direction to right
     * 
     * @return {void}
     */
    turnRight() {
        this.matrix.identity()
        this.matrix.scale(1, 1)
        this.direction.x = 1
    }

    /**
     * Walking left
     * 
     * @return {void}
     */
    walkLeft() {
        // implement on sub class
    }

    /**
     * Walking right
     * 
     * @return {void}
     */
    walkRight() {
        // implement on sub class
    }

    /**
     * Jump state
     * 
     * @return {void}
     */
    jumpState() {
        // implement on sub class
    }

    /**
     * When leaving platform
     * 
     * @return {void}
     */
    leavePlatform() {
        // implement on sub class
    }

    /**
     * Fall state
     * 
     * @return {void}
     */
    fallState() {
        // implement on sub class
    }

    /**
     * When landing platform
     * 
     * @return {void}
     */
    landPlatform() {
        // implement on sub class
    }

    /**
     * Handles input
     * 
     * @return {void}
     */
    inputHandler() {
        // implement on sub class
    }

    /**
     * Checks collision and resolves between entity and platform
     * 
     * @param {EmagJS.Core.Collision.collisionHandler} collisionHandler 
     * @param {array<EmagJS.Platformer.Platform>} platforms 
     * 
     * @return {void}
     */
    checkPlatformCollision(collisionHandler, platforms) {

        // update collision masks
        this.collisionMask['body'].position.update(this.body.position.x + this.collisionMask['body'].offsetX, this.body.position.y + this.collisionMask['body'].offsetY)
        this.collisionMask['head'].position.update(this.body.position.x + this.collisionMask['head'].offsetX, this.body.position.y + this.collisionMask['head'].offsetY - this.collisionMask['body'].height * 0.5 - this.collisionMask['head'].height * 0.5)
        this.collisionMask['foot'].position.update(this.body.position.x + this.collisionMask['foot'].offsetX, this.body.position.y + this.collisionMask['foot'].offsetY)
        this.collisionMask['ray'].start.update(this.body.position.x + this.collisionMask['ray'].offsetX, this.body.position.y + this.collisionMask['ray'].offsetY)
        this.collisionMask['ray'].end.update(this.body.position.x + this.collisionMask['ray'].offsetX, this.body.position.y + this.collisionMask['ray'].offsetY + 15)

        // only one platform to test collision with
        let currentPlatform

        // colliding with wall flag 
        let collidingWithWall = false

        // get platform to check collision with
        platforms.map((platform) => {

            // colliding with walls
            if (platform.angle == 90 || platform.angle == -90) {
                // check if body (shape) is colliding with platform (shape)
                if (collisionHandler.check(this.collisionMask['body'], platform)) {
                    // just resolve position
                    this.body.position.x += collisionHandler.mtv.x
                    // update colliding with wall flag
                    collidingWithWall = true
                }
            }

            // colliding with roof platform
            else if (!platform.across) {
                // if jumping
                if (this.state == 'JUMP') {
                    // check if head (shape) is colliding with platform (shape)
                    if (collisionHandler.check(this.collisionMask['head'], platform)) {
                        // zero y velocity
                        this.body.velocity.y = 0
                        // resolve position
                        this.body.position.y += collisionHandler.mtv.y
                    }
                }
            }

            // colliding with floor/slope platform
            else {
                // if ray intersects with platform, save it to further collision check
                if (collisionHandler.check(this.collisionMask['ray'], platform)) {
                    currentPlatform = platform
                }
            }

        })

        // entity onGround flag
        this.onGround = false

        // if there is any platform to check collision
        if (currentPlatform) {

            // check if foot (circle) collides with platform (shape)
            if (collisionHandler.check(this.collisionMask['foot'], currentPlatform)) {

                // only collides if falling
                if (this.body.velocity.y > 0) {

                    // remove y velocity
                    this.body.velocity.y = 0
                    // circle mask radius
                    let maskRadius = this.collisionMask['foot'].radius
                    // x difference from start platform
                    let xDiff = this.body.position.x - currentPlatform.position.x
                    // correct height based on platform slope
                    let y = xDiff * currentPlatform.slope
                    // correct position
                    this.body.position.y = (currentPlatform.position.y - y) - maskRadius - currentPlatform.height * 0.5

                    // if not jumping, apply vertical force based on x velocity
                    // to snap to slope
                    if (this.state != 'JUMP')
                        this.body.acceleration.y += Math.abs(this.body.velocity.x) + .9

                    // sticky platform
                    if (currentPlatform.sticky) {

                        // if entity not sticked to platform yet (only at first platform contact)
                        if (!this.stickedToPlatform) {

                            this.stickedToPlatform = true

                            // get distance from collision point to platform start point
                            //                                        O    <- entity
                            // -> distance from collision point ======x--- 
                            let collisionDistanceFromPlatformStart = collisionHandler.points[0].x - currentPlatform.position.x
                            // get factor to know the point in platform to stick entity (0 to 1)
                            // 0 - left most
                            // 1 - right most
                            this.stickyPointFactor = collisionDistanceFromPlatformStart / currentPlatform.width

                        }

                        // if standing and not colliding with wall, fix entity to platform
                        if (this.state == 'STAND' && !collidingWithWall) {
                            // adjusts entity x position based on sticky factor, works with slope
                            this.body.position.x = currentPlatform.position.x + (currentPlatform.width * this.stickyPointFactor)
                        } else {
                            // if moving
                            this.stickedToPlatform = false
                        }
                    }

                    // entity on ground flag
                    this.onGround = true

                }
            }
        }

        // update body mask based on body position
        this.collisionMask['body'].position.update(this.body.position.x + this.collisionMask['body'].offsetX, this.body.position.y + this.collisionMask['body'].offsetY)
        // update head mask based on body position
        this.collisionMask['head'].position.update(this.body.position.x + this.collisionMask['head'].offsetX, this.body.position.y + this.collisionMask['head'].offsetY - this.collisionMask['body'].height * 0.5 - this.collisionMask['head'].height * 0.5)
        // update foot mask based on body position
        this.collisionMask['foot'].position.update(this.body.position.x + this.collisionMask['foot'].offsetX, this.body.position.y + this.collisionMask['foot'].offsetY)

        // update ray
        this.collisionMask['ray'].start.update(this.body.position.x + this.collisionMask['ray'].offsetX, this.body.position.y + this.collisionMask['ray'].offsetY)
        this.collisionMask['ray'].end.update(this.body.position.x + this.collisionMask['ray'].offsetX, this.body.position.y + this.collisionMask['ray'].offsetY + 15)

        // update representation position based on foot mask
        this.position.x = this.collisionMask['foot'].position.x
        this.position.y = this.collisionMask['foot'].position.y - 5

        // round sprite coordinates
        this.position.x = this.position.x | 0
        this.position.y = this.position.y | 0

    }

    /**
     * Entity update
     * 
     * Must be implemented on it's sub class
     * 
     * @param {number} dt 
     */
    update(dt) {

        // input
        this.inputHandler()

        // update body
        this.body.update(dt)

        // apply gravity
        this.body.applyForce(this.body.gravity)

        // apply friction
        if (!this.input.holding('LEFT') && !this.input.holding('RIGHT'))
            this.body.velocity.multiply(this.body.friction)

        // limit x velocity
        if (this.body.velocity.x > this.body.maxSpeed.x) this.body.velocity.x = this.body.maxSpeed.x
        if (this.body.velocity.x < -this.body.maxSpeed.x) this.body.velocity.x = -this.body.maxSpeed.x

        // limit y velocity
        if (this.body.velocity.y > this.body.maxSpeed.y)
            this.body.velocity.y = this.body.maxSpeed.y

        // state handler
        switch (this.state) {

            // stand state
            case 'STAND':

                this.standState()

                // turn left behavior
                if (this.input.holding('LEFT'))
                    this.turnLeft()

                // turn right behavior
                if (this.input.holding('RIGHT'))
                    this.turnRight()

                // enter walk state
                if (this.input.holding('LEFT') || this.input.holding('RIGHT')) {
                    this.state = 'WALK'
                }

                // enter jump state
                if (this.input.pressed('Z', 'B', 'CROSS')) {
                    this.state = 'JUMP'
                    this.leavePlatform()
                }

                // enter fall state
                if (this.body.velocity.y > 1 && !this.onGround) {
                    this.state = 'FALL'
                }

                break
            // stand state


            // walk state
            case 'WALK':

                this.walkState()

                // enter stand state
                if (!this.input.holding('LEFT') && !this.input.holding('RIGHT')) {
                    this.state = 'STAND'
                }

                // move left behavior
                if (this.input.holding('LEFT')) {
                    this.turnLeft()
                    this.walkLeft()
                }

                // move right behavior
                if (this.input.holding('RIGHT')) {
                    this.turnRight()
                    this.walkRight()
                }

                // enter jump state
                if (this.input.pressed('Z', 'B', 'CROSS')) {
                    this.state = 'JUMP'
                    this.leavePlatform()
                }

                // enter fall state
                if (this.body.velocity.y > 1 && !this.onGround) {
                    this.state = 'FALL'
                }

                break
            // walk state


            // jump state
            case 'JUMP':

                this.jumpState()

                // holding jump button
                if (this.input.holding('Z', 'B', 'CROSS')) {

                    // increase jump time
                    this.body.jumpTime += 1 * dt

                    // while not reach max jump
                    if (this.body.jumpTime < this.body.maxJump) {
                        this.body.velocity.y = this.body.jump.y * this.body.jumpTime
                    }

                } else {
                    // stop holding jump button

                    this.body.jumpTime = this.body.maxJump

                    // slow down y velocity
                    if (this.body.velocity.y < 0) {
                        this.body.velocity.y *= .90
                    }

                }

                // move left behavior
                if (this.input.holding('LEFT')) {
                    this.turnLeft()
                    this.walkLeft()
                }

                // move right behavior
                if (this.input.holding('RIGHT')) {
                    this.turnRight()
                    this.walkRight()
                }

                // enter fall state
                if (this.body.velocity.y >= 0) {
                    this.state = 'FALL'
                }

                break
            // jump state


            // fall state
            case 'FALL':

                this.fallState()

                // landed
                if (this.onGround) {

                    // enter walk or stand state
                    if (this.input.holding('LEFT') || this.input.holding('RIGHT')) {
                        this.state = 'WALK'
                    } else {
                        this.state = 'STAND'
                    }

                    this.landPlatform()

                    this.body.jumpTime = 0

                }

                // move left behavior
                if (this.input.holding('LEFT')) {
                    this.turnLeft()
                    this.walkLeft()
                }

                // move right behavior
                if (this.input.holding('RIGHT')) {
                    this.turnRight()
                    this.walkRight()
                }

                break
            // fall state

        } // FSM

        // falling, not grounded
        if (this.onGround && this.body.velocity.y > 0)
            this.onGround = false

        // leaving ground
        if (this.body.velocity.y < 0)
            this.onGround = false

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        super.draw(graphics)

        // this.collisionMask['ray'].draw(graphics)
        // this.collisionMask['head'].draw(graphics)
        // this.collisionMask['body'].draw(graphics)
        // this.collisionMask['foot'].draw(graphics)

    }

}