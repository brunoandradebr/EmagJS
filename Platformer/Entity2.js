/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Package Platformer
 * 
 * Helper class to create platform genre entity
 */
class Entity2 extends Sprite {

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
        // body mask
        this.collisionMask['body'] = new Shape(new Square, this.position.clone(), 5, 20, 'transparent', 1, 'cyan')
        // raycast
        this.collisionMask['ray'] = new Line(this.position.clone(), new Vector)
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
        this.collisionMask['foot'].position.update(this.body.position.x, this.body.position.y)
        this.collisionMask['body'].position.update(this.body.position.x, this.body.position.y)
        this.collisionMask['ray'].start.update(this.body.position.x, this.body.position.y + 2)
        this.collisionMask['ray'].end.update(this.body.position.x, this.body.position.y + 15)

        let currentPlatform

        this.collidingWithWall = false

        // get platform to check collision
        platforms.map((platform) => {

            platform.lineColor = 'black'

            if (platform.angle == 90 || platform.angle == -90) {
                if (collisionHandler.check(this.collisionMask['body'], platform)) {
                    this.body.position.x += collisionHandler.mtv.x
                    this.collidingWithWall = true
                }
            } else {
                if (collisionHandler.check(this.collisionMask['ray'], platform)) {
                    currentPlatform = platform
                }
            }


        })

        this.onGround = false

        // check collision
        if (currentPlatform) {

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

                    // if not jumping, apply vertical force baased on x velocity
                    // to snap to slope
                    if (this.state != 'JUMP')
                        this.body.acceleration.y += Math.abs(this.body.velocity.x) + .9

                    // fixable platform
                    if (currentPlatform.fixable) {

                        // if not fixed to platform yet
                        if (!this.fixedToPlatform) {

                            this.fixedToPlatform = true

                            // get distance from collision point to platform start point
                            let collisionPointToPlatformStart = collisionHandler.points[0].x - currentPlatform.position.x
                            // get point to fix entity
                            this.fixPointFactor = collisionPointToPlatformStart / currentPlatform.width

                        }

                        // if standing and not colliding with wall, fix entity to platform
                        if (this.state == 'STAND' && !this.collidingWithWall) {
                            this.body.position.x = currentPlatform.position.x + (currentPlatform.width * this.fixPointFactor)
                        } else {
                            this.fixedToPlatform = false
                        }

                    }

                    this.onGround = true

                }
            }
        }

        // update foot mask based on body position
        this.collisionMask['foot'].position.update(this.body.position.x, this.body.position.y)
        this.collisionMask['body'].position.update(this.body.position.x, this.body.position.y)

        // update ray
        this.collisionMask['ray'].start.update(this.body.position.x, this.body.position.y + 2)
        this.collisionMask['ray'].end.update(this.body.position.x, this.body.position.y + 15)

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

        // falling, not grounded -- 0.3 - some slopes causes an low y velocity
        // this number is ok for most cases - if gravity changes, this number must change
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

    }

}