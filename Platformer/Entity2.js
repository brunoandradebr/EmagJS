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

        // sprite sheet
        this.image = new SpriteSheet(assets.images.hero, 32, 32)
        // animations
        this.addAnimation('stand', [0, 1, 2, 3, 4, 5], Infinity)
        this.addAnimation('jump', [17])
        this.addAnimation('fall', [18, 19, 20, 21, 22, 21, 20, 19], 1, 24)
        this.addAnimation('walk', [34, 35, 36, 37, 38, 39, 40, 41], Infinity)
        this.addAnimation('roll', [136, 137, 138, 139, 140, 141, 142, 143, 144], 1, 18)
        this.addAnimation('damage', [153, 154, 155, 156, 157, 158], 1)
        // direction vector
        this.direction = new Vector(-1, 0)
        // physics
        this.body = new Body(this)
        this.body.jumpingGravity = new Vector(0, .1)
        this.body.fallingGravity = new Vector(0, .2)
        this.body.friction = new Vector(.76, 1)
        this.body.speedX = 1
        this.body.rollSpeed = 2
        this.body.maxSpeedX = .58
        this.body.jump = 4
        // mechanics variables
        this.canJump = true
        this.jumpCount = 0
        this.maxJumpCount = 1
        // flags
        this.jumping = true
        this.rolling = false
        // collision masks
        this.collisionMasks = []
        this.collisionMasks['body'] = new Shape(new Square, new Vector, 10, 25, 'transparent', 1, 'purple')
        this.collisionMasks['foot'] = new Circle(new Vector, 5, 'transparent', 1, 'red')
        this.collisionMasks['footRay'] = new Line(this.collisionMasks['foot'].position, new Vector)
        this.collisionMasks['head'] = new Circle(new Vector, 5, 'transparent', 1, 'blue')
        this.collisionMasks['headRay'] = new Line(this.collisionMasks['head'].position, new Vector)
        // timers
        this.rollTimer = new Timer(600)

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
     * @return {void}
     */
    checkPlatformCollision() {

        // update collision masks before collision tests
        this.collisionMasks['foot'].position.update(this.body.position.x, this.body.position.y + this.height * 0.5 - this.collisionMasks['foot'].radius)
        this.collisionMasks['footRay'].end.update(this.collisionMasks['foot'].position.x, this.collisionMasks['foot'].position.y + 11)
        this.collisionMasks['head'].position.update(this.body.position.x, this.body.position.y - this.collisionMasks['head'].radius)
        this.collisionMasks['headRay'].end.update(this.collisionMasks['head'].position.x, this.collisionMasks['head'].position.y - 11)
        this.collisionMasks['body'].position.update(this.collisionMasks['foot'].position.x, this.collisionMasks['foot'].position.y - this.collisionMasks['body'].height * 0.5 + this.collisionMasks['foot'].radius)

        // current platform
        this.currentPlatform = null

        // get current platform to test with
        this.platforms.map((platform) => {

            // collision with wall
            if (platform.angle == 90 || platform.angle == -90) {

                if (this.collisionHandler.check(this.collisionMasks['body'], platform)) {

                    this.body.velocity.add(this.collisionHandler.mtv)
                    this.body.position.add(this.collisionHandler.mtv)

                    if (this.collisionHandler.normal.y == -1) {

                        // if jumping near platform, avoid stick and keep going up
                        if (!this.input.holding('LEFT') && !this.input.holding('RIGHT'))
                            this.body.velocity.y = 0

                        if (this.body.velocity.y == 0) {
                            this.onGround = true
                            this.jumping = false
                            this.canJump = true
                        }

                    }

                }

            } else {

                if (this.collisionHandler.check(this.collisionMasks['footRay'], platform)) {
                    this.currentPlatform = platform
                } else {
                    if (platform.angle == 180) {
                        if (this.collisionHandler.check(this.collisionMasks['body'], platform)) {
                            if (this.collisionHandler.normal.y == 1) {
                                if (this.body.velocity.y < 0) {
                                    this.body.velocity.add(this.collisionHandler.mtv)
                                    this.body.position.add(this.collisionHandler.mtv)
                                }
                            }
                        }
                    }
                }

                if (this.collisionHandler.check(this.collisionMasks['headRay'], platform)) {
                    this.currentPlatform = platform
                }

            }

        })

        // TODO - HEAD COLLISION WITH FLOOR (180 DEGREE), FALLING, HEAD TOUCH PLATFORM

        this.onGround = false

        // check platform with foot circle
        if (this.currentPlatform) {

            // if colliding
            if (this.collisionHandler.check(this.collisionMasks['foot'], this.currentPlatform)) {

                if (this.body.velocity.y > 0) {
                    this.body.velocity.y = Math.abs(this.body.velocity.x)
                    this.body.position.y = (this.currentPlatform.position.y - this.height * 0.5) + ((this.currentPlatform.position.x - this.body.position.x) * this.currentPlatform.slope)

                    this.jumping = false
                    this.canJump = true
                    this.onGround = true
                    this.jumpCount = 0
                }

            } else if (this.collisionHandler.check(this.collisionMasks['head'], this.currentPlatform)) {
                if (this.body.velocity.y < 0) {
                    if (this.currentPlatform.angle != 180 && this.currentPlatform.angle != 0) {
                        this.body.velocity.y = 0
                        this.body.position.y = (this.currentPlatform.position.y + this.height * 0.5 - this.collisionMasks['head'].radius) - ((this.body.position.x - this.currentPlatform.position.x) * this.currentPlatform.slope)
                    }
                }
            }

        }

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

        // update hero physic body
        this.body.update(dt)

        // apply gravity
        if (this.body.velocity.y > 0) {
            this.body.applyForce(this.body.fallingGravity)
        } else {
            this.body.applyForce(this.body.jumpingGravity)
        }

        // limit x velocity
        if (this.body.velocity.x > this.body.maxSpeedX) this.body.velocity.x = this.body.maxSpeedX
        if (this.body.velocity.x < -this.body.maxSpeedX) this.body.velocity.x = -this.body.maxSpeedX

        switch (this.state) {

            case 'STAND':

                this.setAnimation('stand')

                // apply friction
                if (!this.input.holding('LEFT') && !this.input.holding('RIGHT'))
                    this.body.velocity.multiply(this.body.friction)

                if (this.input.pressed('LEFT')) {
                    this.state = 'WALK'
                    this.turnLeft()
                    this.body.applyForce(-this.body.speedX, 0)
                }

                if (this.input.pressed('X', 'A', 'CROSS')) {
                    this.state = 'WALK'
                    this.turnLeft()
                    this.body.applyForce(-this.body.speedX, 0)
                }

                if (this.input.pressed('RIGHT')) {
                    this.state = 'WALK'
                    this.turnRight()
                    this.body.applyForce(this.body.speedX, 0)
                }

                if (this.input.holding('LEFT')) {
                }

                if (this.input.holding('RIGHT')) {
                }

                break

            case 'WALK':

                this.setAnimation('walk')

                if (!this.input.holding('LEFT') && !this.input.holding('RIGHT')) {
                    this.state = 'STAND'
                }

                break

        }

        // walk left
        // if (this.input.holding('LEFT') && !this.rolling) {
        //     this.direction.x = -1
        //     this.matrix.identity()
        //     this.matrix.scale(-1, 1)
        //     this.body.applyForce(-this.body.speedX, 0)
        // }

        // // walk right
        // if (this.input.holding('RIGHT') && !this.rolling) {
        //     this.direction.x = 1
        //     this.matrix.identity()
        //     this.matrix.scale(1, 1)
        //     this.body.applyForce(this.body.speedX, 0)
        // }

        // // roll
        // this.rollTimer.start
        // if (this.onGround && this.input.doublePressed('LEFT') && !this.rolling) {
        //     this.rolling = true
        //     this.rollTimer.reset
        // }
        // if (this.onGround && this.input.doublePressed('RIGHT') && !this.rolling) {
        //     this.rolling = true
        //     this.rollTimer.reset
        // }
        // if (this.rolling) {
        //     if (this.rollTimer.count < 1) {
        //         this.body.applyForce(this.direction.x * this.body.speedX * this.body.rollSpeed, 0)
        //     } else {
        //         this.rolling = false
        //     }
        // }

        // collision check here...
        this.checkPlatformCollision(this.collisionHandler, this.platforms)

        // jump
        // if (this.input.pressed('SPACE') && this.canJump && !this.rolling) {

        //     this.body.velocity.y = 0
        //     this.body.applyForce(0, -this.body.jump)

        //     this.jumping = true
        //     this.jumpCount++

        // }

        // if (this.jumpCount >= this.maxJumpCount) {
        //     this.canJump = false
        // }

        // // leaving platform (falling)
        // if (!this.currentPlatform && this.body.velocity.y > 0.3) {

        //     this.jumping = true

        //     if (this.jumpCount == 0)
        //         this.canJump = false
        // }

        // if (this.jumping) {
        //     if (!this.input.holding('SPACE')) {
        //         if (this.body.velocity.y < 0) {
        //             this.body.velocity.y += .2
        //         }
        //     }
        // }

        // if (this.rolling) {
        //     this.setAnimation('roll')
        // } else {
        //     if (this.onGround) {
        //         if (this.input.holding('LEFT') || this.input.holding('RIGHT')) {
        //             this.setAnimation('walk')
        //         } else {
        //             this.setAnimation('stand')
        //         }
        //     } else {
        //         if (this.body.velocity.y > 0) {
        //             this.setAnimation('fall')
        //         } else if (this.body.velocity.y == 0) {
        //             this.setAnimation('stand')
        //         } else {
        //             this.setAnimation('jump')
        //         }
        //     }
        // }

        // update collision mask after collision tests
        this.collisionMasks['foot'].position.update(this.body.position.x, this.body.position.y + this.height * 0.5 - this.collisionMasks['foot'].radius)
        this.collisionMasks['footRay'].end.update(this.collisionMasks['foot'].position.x, this.collisionMasks['foot'].position.y + 11)
        this.collisionMasks['head'].position.update(this.body.position.x, this.body.position.y - this.collisionMasks['head'].radius)
        this.collisionMasks['headRay'].end.update(this.collisionMasks['head'].position.x, this.collisionMasks['head'].position.y - 11)
        this.collisionMasks['body'].position.update(this.collisionMasks['foot'].position.x, this.collisionMasks['foot'].position.y - this.collisionMasks['body'].height * 0.5 + this.collisionMasks['foot'].radius)

        // update hero sprite representation by it's physic body position
        this.position.update(this.body.position)

        // avoid pixel distortion
        this.position.x = this.position.x | 0
        this.position.y = this.position.y | 0

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