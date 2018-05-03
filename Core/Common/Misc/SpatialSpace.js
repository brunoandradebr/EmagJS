/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Spatial Space
 */
class SpatialSpace {

    /**
     * 
     * @param {integer} rows   - Number of rows
     * @param {integer} columns - Number of columns
     * @param {number}  width   - Max width of the spatial area 
     * @param {number}  height  - Max height of the spatial area
     */
    constructor(rows = 3, columns = 2, width = DEVICE_WIDTH, height = DEVICE_HEIGHT) {

        /**
         * @type {integer}
         */
        this.rows = rows || 3

        /**
         * @type {integer}
         */
        this.columns = columns || 2

        /**
         * @type {number}
         */
        this.width = width || 1

        /**
         * @type {number}
         */
        this.height = height || 1

        /**
         * @type {number}
         */
        this.blockWidth = this.width / columns

        /**
         * @type {number}
         */
        this.blockHeight = this.height / rows

        /**
         * Block inverse width
         * 
         * @type {number}
         */
        this.iBlockWidth = 1 / this.blockWidth

        /**
         * Block inverse height
         * 
         * @type {number}
         */
        this.iBlockHeight = 1 / this.blockHeight

        /**
         * dynamic 2d grid
         * 
         * @type {array}
         */
        this.areas = new Array(this.rows)

        // initialize 2D array
        for (let i = 0; i < this.rows; i++) {
            this.areas[i] = new Array(this.columns)
        }

        // initializes areas with empty values
        this.createEmptyAreas()

        /**
         * Areas that objects are colliding
         * 
         * @type {array}
         */
        this.collisionAreas = []

        /**
         * debug only
         * 
         * @type {array}
         */
        this.debugBlocks = []

    }

    /**
     * Creates empty areas
     * 
     * @return {void}
     */
    createEmptyAreas() {

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.areas[i][j] = []
            }
        }

    }

    /**
     * Clear areas
     * 
     * @return {void}
     */
    clearAreas() {

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.areas[i][j].length = 0
            }
        }

    }

    /**
     * Add a new object to an area based on it's position
     * 
     * @param {*} objects - Any interactive object that has a position vector
     * 
     * @return {void} 
     */
    addObjects(objects) {

        // clear all before add objects
        this.clearAreas()

        // for each object
        objects.map((object) => {

            // finds it's position index in 2D array
            let x = (object.position.x * this.iBlockWidth) | 0
            let y = (object.position.y * this.iBlockHeight) | 0

            // add object
            if (this.areas[y]) {
                if (this.areas[x]) {
                    this.areas[x][y].push(object)
                }
            }

        })

        // after added objects to areas, check if there are possible collisions
        this.collisionAreas = this.getCollisionAreas()

    }

    /**
     * Get area based on x and y position
     * 
     * @param {integer} x 
     * @param {integer} y
     * 
     * @return {array}
     */
    getArea(x, y) {
        return this.areas[x * this.iBlockWidth | 0, y * this.iBlockHeight | 0][x * this.iBlockWidth | 0]
    }

    /**
     * Get all areas that collisions may be happening - areas that have more than one object
     * 
     * @return {array}
     */
    getCollisionAreas() {

        let collisionAreas = []

        for (let x = 0; x < this.areas.length; x++) {
            for (let y = 0; y < this.areas.length; y++) {

                let mainArea = this.areas[x][y]

                if (mainArea.length > 1) {
                    collisionAreas.push(mainArea)
                }
            }
        }

        return collisionAreas

    }

    /**
     * Returns debug block based on x and y position
     * 
     * @param {number} x 
     * @param {number} y
     * 
     * @return {EmagJS.Core.Render.Sprite} 
     */
    getDebugBlock(x, y) {

        let xIndex = mouse.x * this.iBlockWidth | 0
        let yIndex = mouse.y * this.iBlockHeight | 0

        let blockIndex = xIndex + (yIndex * this.rows)

        return this.debugBlocks[blockIndex]

    }

    /**
     * Draw area blocks to debug
     * 
     * @param {CanvasRenderingContext2D} graphics
     * 
     * @return {void} 
     */
    debug(graphics) {

        // create blocks only once
        if (!this.debugBlocks.initialized) {

            this.debugBlocks.initialized = true

            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    let block = new Sprite(new Vector(((j * this.blockWidth) + ((this.blockWidth * 0.5))) | 0, ((i * this.blockHeight) + ((this.blockHeight * 0.5)) | 0)), this.blockWidth, this.blockHeight, 'rgba(0,120,255,0.02)', 1, 'rgba(0,120,255,0.2)')
                    this.debugBlocks.push(block)
                }
            }

        } else {

            // draw all area blocks
            this.debugBlocks.map((debugBlock) => {
                debugBlock.draw(graphics)
            })

        }
    }

}