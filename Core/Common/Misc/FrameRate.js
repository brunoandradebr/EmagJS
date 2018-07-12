class FrameRate {
    constructor() {

        this.dt = 0
        this.fps = 0
        this.lastTime = window.performance.now()
        this.frameCount = 0

        this.label = new Text('', new Vector(DEVICE_WIDTH - 205, 37))
        this.label.font = 'verdana'
        this.label.size = 12

        window.requestAnimationFrame(this.update.bind(this))

    }

    update() {

        this.dt = window.performance.now() - this.lastTime

        this.frameCount++

        if (window.performance.now() > this.lastTime + 150) {

            this.fps = this.frameCount * 1000 / this.dt

            this.label.text = (this.fps | 0) + ''

            this.frameCount = 0
            this.lastTime = window.performance.now()
        }

        window.requestAnimationFrame(this.update.bind(this))
    }

    draw(graphics) {
        this.label.draw(graphics)
    }

}