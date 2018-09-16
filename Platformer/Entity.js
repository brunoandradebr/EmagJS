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
        this.collisionMask['foot'] = new Shape(new Square, this.position.clone(), 10, 10, 'transparent', 2)

        // physic body
        this.body = new Body(this.collisionMask['foot'])
        this.body.gravity = new Vector(0, .4)
        this.body.friction = new Vector(0, 1)

        // mechanics properties
        this.direction = new Vector(1, 0)
        this.body.speed = new Vector(2, 0)
        this.body.jump = new Vector(0, -1)
        this.body.jumpTime = 0
        this.body.maxJump = 5.5

        // flags
        this.onGround = false

        // FSM
        this.state = 'STAND'

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
     * Roll state
     * 
     * @return {void}
     */
    rollState() {
        // implement on sub class
    }

    /**
     * Attack state
     * 
     * @return {void}
     */
    attackState() {
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

        // check collisions with platforms
        for (let i = 0; i < platforms.length; i++) {

            let platform = platforms[i]

            // first checks if colliding with mask polygon and platform
            if (collisionHandler.check(this.collisionMask['foot'], platform)) {

                // only if is falling
                if (this.body.velocity.y > 0)
                    this.onGround = true

                // if platform is a wall
                if (platform.angle == 90) {
                    this.body.velocity.add(collisionHandler.mtv)
                    this.body.position.add(collisionHandler.mtv)
                    this.onGround = false
                    continue
                }

            }

            // now check collision with platform bounding box if entity is on ground
            // checking with floor that can be a slope
            if (collisionHandler.check(this.collisionMask['foot'].getBoundingBox(), platform.boundingBox) && this.onGround) {

                // if colliding with a floor, send it to the last position
                // in platforms array - correct collision order
                if (platform.angle == 0) {
                    platforms.splice(i, 1)
                    platforms.push(platform)
                }

                // calculate distance on x axis (x2 - x1)
                let distance = this.body.position.x - platform.position.x

                // if jumping do not collide
                if (this.body.velocity.y < 0) continue

                // avoid jitter on slope edge
                if (platform.angle < 0) {
                    if (distance < 3) {
                        continue
                    }
                }

                // calculate y position
                let y = (distance * platform.tangent + platform.offset)
                // correct y position
                this.body.position.y = platform.position.y - this.collisionMask['foot'].height * 0.5 - y

                // remove velocity
                this.body.velocity.y = 0

            }

        }

        // update foot mask based on body position
        this.collisionMask['foot'].position.update(this.body.position)

        // update representation position based on foot mask
        this.position.x = this.collisionMask['foot'].position.x
        this.position.y = this.collisionMask['foot'].position.y - ((this.height * 0.5 - this.collisionMask['foot'].height) + 1)

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
        this.body.velocity.multiply(this.body.friction)

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

                // enter roll state
                if (this.input.doublePressed('LEFT') || this.input.doublePressed('RIGHT'))
                    this.state = 'ROLL'

                // enter jump state
                if (this.input.pressed('SPACE', 'B', 'CROSS')) {
                    this.state = 'JUMP'
                    this.leavePlatform()
                }

                // enter fall state
                if (this.body.velocity.y > 1 && !this.onGround) {
                    this.state = 'FALL'
                }

                // enter attack state
                if (this.input.pressed('X', 'A', 'SQUARE') && this.equiped) {
                    this.state = 'ATTACK'
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
                if (this.input.pressed('SPACE', 'B', 'CROSS')) {
                    this.state = 'JUMP'
                    this.leavePlatform()
                }

                // enter fall state
                if (this.body.velocity.y > 1 && !this.onGround) {
                    this.state = 'FALL'
                }

                // enter attack state
                if (this.input.pressed('X', 'A', 'SQUARE') && this.equiped) {
                    this.state = 'ATTACK'
                }

                break
            // walk state


            // jump state
            case 'JUMP':

                this.jumpState()

                // holding jump button
                if (this.input.holding('SPACE', 'B', 'CROSS')) {

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

                // enter attack state
                if (this.input.pressed('X', 'A', 'SQUARE') && this.equiped) {
                    this.state = 'ATTACK'
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

                // enter attack state
                if (this.input.pressed('X', 'A', 'SQUARE') && this.equiped) {
                    this.state = 'ATTACK'
                }

                break
            // fall state


            // roll state
            case 'ROLL':

                // roll behavior
                this.rollState()

                // only turn at roll begin
                if (this.currentFrame < 3) {
                    if (this.input.holding('LEFT')) {
                        this.turnLeft()
                    }
                    if (this.input.holding('RIGHT')) {
                        this.turnRight()
                    }
                }

                // stop rolling
                if (this.currentAnimation.lastFrame) {
                    if (this.input.holding('LEFT') || this.input.holding('RIGHT')) {
                        this.state = 'WALK'
                    } else {
                        this.state = 'STAND'
                    }
                }

                break
            // roll state

            // attack state
            case 'ATTACK':

                this.attackState()

                // finished attack animation
                if (this.currentAnimation.lastFrame) {

                    // if on ground
                    if (this.onGround) {
                        // if holding left or right
                        if (this.input.holding('LEFT') || this.input.holding('RIGHT')) {
                            // enter walk state
                            this.state = 'WALK'
                        } else {
                            // enter stand state
                            this.state = 'STAND'
                        }

                    } else { // on air
                        // attack on the air, enter fall state
                        this.state = 'FALL'
                    }

                    // finished attacking, reset jump time
                    this.body.jumpTime = 0

                }

                // landing after attack has started
                if (this.body.jumpTime > 0 && this.onGround) {
                    this.body.jumpTime = 0
                    this.landPlatform()
                }

                // change direction in the air
                if (!this.onGround) {
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
                }

                break
            // attack state

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