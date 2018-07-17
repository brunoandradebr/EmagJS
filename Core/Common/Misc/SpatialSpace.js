/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Spatial Space
 */
class SpatialSpace {

    /**
     * 
     * @param {integer} rows    - Number of rows
     * @param {integer} columns - Number of columns
     * @param {number}  width   - Max width of the spatial area 
     * @param {number}  height  - Max height of the spatial area
     */
    constructor(rows = 3, columns = 2, width = DEVICE_WIDTH, height = DEVICE_HEIGHT) {

        /**
         * @type {integer}
         */
        this.rows = rows

        /**
         * @type {integer}
         */
        this.columns = columns

        /**
         * @type {number}
         */
        this.width = width

        /**
         * @type {number}
         */
        this.height = height

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
         * @type {array<integer>}
         */
        this.debugBlocks = []

        /**
         * Keep track of colliding debug blocks
         * 
         * @type {array<object>}
         */
        this.collidingDebugAreas = []

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
     * Add a new object to an area based on it's bounding box points and it's center
     * 
     *    *-----*
     *    |  *  |
     *    *-----*
     * 
     * @param {array<*>} objects - Array with any interactive object that has a position vector
     * 
     * @return {void} 
     */
    addObjects(objects, boundingBox = false) {

        // clear all before add objects
        this.clearAreas()

        // for each object
        objects.map((object, i) => {

            // id to filter repeated object inside the same area
            object.spatialID = i

            let objectStructure

            if (boundingBox) {
                objectStructure = object.getBoundingBox()
            } else {
                objectStructure = {}
                objectStructure.width = object.width
                objectStructure.height = object.height
                objectStructure.centerX = object.position.x
                objectStructure.centerY = object.position.y
            }

            // half width and height
            let objectHalfWidth = objectStructure.width * 0.5
            let objectHalfHeight = objectStructure.height * 0.5
            // center
            let objectCenterX = objectStructure.centerX
            let objectCenterY = objectStructure.centerY
            // upper left
            let objectUpperLeftX = objectCenterX - objectHalfWidth
            let objectUpperLeftY = objectCenterY - objectHalfHeight
            // upper right
            let objectUpperRightX = objectCenterX + objectHalfWidth
            let objectUpperRightY = objectCenterY - objectHalfHeight
            // bottom left
            let objectBottomLeftX = objectCenterX - objectHalfWidth
            let objectBottomLeftY = objectCenterY + objectHalfHeight
            // bottom right
            let objectBottomRightX = objectCenterX + objectHalfWidth
            let objectBottomRightY = objectCenterY + objectHalfHeight

            // add object based on it's center position
            let centerIndexX = (objectCenterX * this.iBlockWidth) | 0
            let centerIndexY = (objectCenterY * this.iBlockHeight) | 0

            if (this.areas[centerIndexY]) {
                if (this.areas[centerIndexX]) {
                    this.areas[centerIndexX][centerIndexY].push(object)
                }
            }

            // add object based on it's upper left position
            let upperLeftIndexX = (objectUpperLeftX * this.iBlockWidth) | 0
            let upperLeftIndexY = (objectUpperLeftY * this.iBlockHeight) | 0

            if (this.areas[upperLeftIndexY]) {
                if (this.areas[upperLeftIndexX]) {
                    this.areas[upperLeftIndexX][upperLeftIndexY].push(object)
                }
            }

            // add object based on it's upper right position
            let upperRightIndexX = (objectUpperRightX * this.iBlockWidth) | 0
            let upperRightIndexY = (objectUpperRightY * this.iBlockHeight) | 0

            if (this.areas[upperRightIndexY]) {
                if (this.areas[upperRightIndexX]) {
                    this.areas[upperRightIndexX][upperRightIndexY].push(object)
                }
            }

            // add object based on it's bottom left position
            let bottomLeftIndexX = (objectBottomLeftX * this.iBlockWidth) | 0
            let bottomLeftIndexY = (objectBottomLeftY * this.iBlockHeight) | 0

            if (this.areas[bottomLeftIndexY]) {
                if (this.areas[bottomLeftIndexX]) {
                    this.areas[bottomLeftIndexX][bottomLeftIndexY].push(object)
                }
            }

            // add object based on it's bottom right position
            let bottomRightIndexX = (objectBottomRightX * this.iBlockWidth) | 0
            let bottomRightIndexY = (objectBottomRightY * this.iBlockHeight) | 0

            if (this.areas[bottomRightIndexY]) {
                if (this.areas[bottomRightIndexX]) {
                    this.areas[bottomRightIndexX][bottomRightIndexY].push(object)
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

                let area = this.areas[x][y]

                // array to keep not repeated objects
                let filteredObjects = [area[0]]

                // filter repeated objects inside area
                area.map((object) => {
                    if (filteredObjects[filteredObjects.length - 1].spatialID != object.spatialID) {
                        filteredObjects.push(object)
                    }
                })

                // if two or more objects inside area, push area to possible colliding area
                if (filteredObjects.length > 1) {

                    collisionAreas.push(filteredObjects)

                    // debug only - debug area sprite to highlight
                    this.collidingDebugAreas.push({ x: x, y: y })
                }
            }
        }

        // return all areas that possible collisions will happen
        return collisionAreas

    }

    /**
     * get total collision pair checks
     * 
     * @return {interger}
     */
    get totalCollision() {

        let total = 0

        this.collisionAreas.map((area) => {

            for (let i = 0; i < area.length; i++) {
                for (let j = i + 1; j < area.length; j++) {
                    total++
                }
            }

        })

        return total
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

        let xIndex = x
        let yIndex = y

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

            // reset initial block line color
            this.debugBlocks.map((debugBlock) => {
                debugBlock.lineColor = 'rgba(0,120,255,0.2)'
            })

            // highlight colliding areas
            this.collidingDebugAreas.map((collidingDebugBlock) => {
                let area = this.getDebugBlock(collidingDebugBlock.x, collidingDebugBlock.y)
                area.lineColor = 'red'
            })

            // draw all area blocks
            this.debugBlocks.map((debugBlock) => {
                debugBlock.draw(graphics)
            })

            // clear colliding areas
            this.collidingDebugAreas.length = 0

        }
    }

}