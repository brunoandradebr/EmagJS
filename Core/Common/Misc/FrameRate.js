/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Frame rate meter
 */
class FrameRate {

    constructor() {

        /**
         * flag to update or not
         */
        this.active = true

        /**
         * delta time
         */
        this.dt = 0

        /**
         * frames per second to be displayed
         */
        this.fps = 0

        /**
         * last time
         */
        this.lastTime = window.performance.now()

        /**
         * frames count
         */
        this.frameCount = 0

        /**
         * background box
         */
        this.background = new Sprite(new Vector(DEVICE_WIDTH - 22, 20), 44, 40, 'rgba(0,0,0,0.6)', 0)

        /**
         * label to display fps
         */
        this.label = new Text()
        this.label.font = 'verdana'
        this.label.size = 13
        this.label.color = 'white'
        this.label.position.x = this.background.position.x - this.background.width * 0.5 + 5
        this.label.position.y = this.label.size

        /**
         * object pool to allocate sprites to render fps bars
         */
        this.barPool = new ObjectPool(() => new Sprite(), (bar) => {
            bar.anchor.y = 1
            bar.position.x = this.background.position.x + this.background.width * 0.5
            bar.position.y = this.background.height
            bar.width = 1
            bar.height = this.fps - this.background.height > 0 ? this.fps - this.background.height : this.background.height - (this.background.height - this.fps)
            bar.height = bar.height > this.background.height * 0.5 ? this.background.height * 0.5 : bar.height
            bar.lineWidth = 0
            let barColor = this.fps > 30 ? this.fps + 120 : -this.fps
            bar.fillColor = 'hsl(' + barColor + ', 100%, 50%)'
            return bar
        })

        /**
         * container with all bars
         */
        this.bars = []

        /**
         * start fps meter loop
         */
        window.requestAnimationFrame(this.update.bind(this))

        // when resize screen, update positions
        window.addEventListener('resize', (e) => {

            setTimeout(() => {

                this.background.position.x = DEVICE_WIDTH - this.background.width * 0.5
                this.background.position.y = this.background.height * 0.5
                this.label.position.x = this.background.position.x - this.background.width * 0.5 + 5
                this.label.position.y = this.label.size

                this.bars.map((bar) => {
                    bar.position.x = this.background.position.x + this.background.width * 0.5
                })

            }, 80);

        })

    }

    /**
     * Activate frame rate update and draw
     * 
     * @return {void}
     */
    on() {
        this.active = true
        this.lastTime = window.performance.now()
        this.dt = 0
        this.frameCount = 0
        window.requestAnimationFrame(this.update.bind(this))
    }

    /**
     * Deactivate frame rate update and draw
     * 
     * @return {void}
     */
    off() {
        this.active = false
    }

    /**
     * Toggle frame rate update and draw
     * 
     * @return {void}
     */
    toggle() {
        this.active ? this.off() : this.on()
    }

    /**
     * Update - calculates fps
     * 
     * @return {void}
     */
    update() {

        if (!this.active) return false

        // delta since last frame
        this.dt = window.performance.now() - this.lastTime

        // increment frames
        this.frameCount++

        // creates a bar in a small interval
        if (this.bars.length <= this.background.width) {
            if (window.performance.now() > this.lastTime + 10) {
                this.bars.push(this.barPool.create())
            }
        }

        // move bars
        this.bars.map((bar, i) => {

            bar.position.x -= 1

            // if bar has reached left background edge
            if (bar.position.x <= (this.background.position.x - this.background.width * 0.5)) {
                this.barPool.destroy(bar)
                this.bars.splice(i, 1)
            }

        })

        // updates fps
        if (window.performance.now() > this.lastTime + 150) {

            this.fps = this.frameCount * 1000 / this.dt

            // updates fps label text
            this.label.text = this.fps.toFixed(1)

            // clear frame count
            this.frameCount = 0

            // update last time to now
            this.lastTime = window.performance.now()
        }

        // request a new update
        window.requestAnimationFrame(this.update.bind(this))

    }

    /**
     * Draw fps meter on a canvas draw context
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void}
     */
    draw(graphics) {

        if (!this.active) return false

        this.background.draw(graphics)

        this.bars.map((bar, i) => {
            bar.draw(graphics)
        })

        this.label.draw(graphics)

    }

}