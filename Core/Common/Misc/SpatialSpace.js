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
    constructor(rows = 18, columns = 18, width = DEVICE_WIDTH, height = DEVICE_HEIGHT) {

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
         * Dynamic 2d grid
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
         * Temporary array to be used to get all objects colliding
         * 
         * @type {array}
         */
        this.tmpCollisionAreas = []

        /**
         * Temporary array to be used to get grid areas
         * 
         * @type {array}
         */
        this.tmpGetAreaArray = []

        /**
         * Temporary object to be used to hold object bounding box
         * 
         * @type {object}
         */
        this.tmpObjectStructure = {}

        /**
         * Temporary object to be used to filter repeated objects
         * 
         * @type {object}
         */
        this.tmpNearestObjects = {}

        /**
         * Flag indicating to create debug block tiles
         * 
         * @type {bool}
         */
        this.debug = false

        /**
         * Debug only
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
     * @param {array<EmagJS.Core.Render.Sprite | EmagJS.Core.Render.Shape>} objects - Array with any interactive object that has a position vector
     * 
     * @return {array} 
     */
    addObjects(objects) {

        // clear all before add objects
        this.clearAreas()

        // for each object
        objects.map((object, i) => {

            // id to filter repeated object inside the same area
            object.spatialID = i

            this.addObjectToGrid(object)

        })

        // after added objects to areas, check if there are possible collisions
        //this.collisionAreas = this.getCollisionAreas()

    }

    /**
     * Adds object to grid 
     * 
     * @param {EmagJS.Core.Render.Sprite | EmagJS.Core.Render.Shape} object
     * 
     * @return {void}
     */
    addObjectToGrid(object) {

        let objectStructure

        if (object.constructor.name == 'Shape') {
            objectStructure = object.getBoundingBox()
        } else if (object.constructor.name == 'Circle') {
            objectStructure = this.tmpObjectStructure
            objectStructure.width = object.radius
            objectStructure.height = object.radius
            objectStructure.centerX = object.position.x
            objectStructure.centerY = object.position.y
        } else {
            objectStructure = this.tmpObjectStructure
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
                this.areas[centerIndexX][centerIndexY][object.spatialID] = object
            }
        }

        // add object based on it's upper left position
        let upperLeftIndexX = (objectUpperLeftX * this.iBlockWidth) | 0
        let upperLeftIndexY = (objectUpperLeftY * this.iBlockHeight) | 0

        if (this.areas[upperLeftIndexY]) {
            if (this.areas[upperLeftIndexX]) {
                this.areas[upperLeftIndexX][upperLeftIndexY][object.spatialID] = object
            }
        }

        // add object based on it's upper right position
        let upperRightIndexX = (objectUpperRightX * this.iBlockWidth) | 0
        let upperRightIndexY = (objectUpperRightY * this.iBlockHeight) | 0

        if (this.areas[upperRightIndexY]) {
            if (this.areas[upperRightIndexX]) {
                this.areas[upperRightIndexX][upperRightIndexY][object.spatialID] = object
            }
        }

        // add object based on it's bottom left position
        let bottomLeftIndexX = (objectBottomLeftX * this.iBlockWidth) | 0
        let bottomLeftIndexY = (objectBottomLeftY * this.iBlockHeight) | 0

        if (this.areas[bottomLeftIndexY]) {
            if (this.areas[bottomLeftIndexX]) {
                this.areas[bottomLeftIndexX][bottomLeftIndexY][object.spatialID] = object
            }
        }

        // add object based on it's bottom right position
        let bottomRightIndexX = (objectBottomRightX * this.iBlockWidth) | 0
        let bottomRightIndexY = (objectBottomRightY * this.iBlockHeight) | 0

        if (this.areas[bottomRightIndexY]) {
            if (this.areas[bottomRightIndexX]) {
                this.areas[bottomRightIndexX][bottomRightIndexY][object.spatialID] = object
            }
        }
    }

    /**
     * Removes object from grid
     * 
     * @param {EmagJS.Core.Render.Sprite | EmagJS.Core.Render.Shape} object
     * 
     * @return {void}
     */
    removeObjectFromGrid(object) {

        let mainArea = this.getArea(object.position.x, object.position.y)
        let topArea = this.getArea(object.position.x, object.position.y - this.blockHeight)
        let bottomArea = this.getArea(object.position.x, object.position.y + this.blockHeight)
        let rightArea = this.getArea(object.position.x + this.blockWidth, object.position.y)
        let topRightArea = this.getArea(object.position.x + this.blockWidth, object.position.y - this.blockHeight)
        let bottomRightArea = this.getArea(object.position.x + this.blockWidth, object.position.y + this.blockHeight)
        let leftArea = this.getArea(object.position.x - this.blockWidth, object.position.y)
        let topLeftArea = this.getArea(object.position.x - this.blockWidth, object.position.y - this.blockHeight)
        let bottomLeftArea = this.getArea(object.position.x - this.blockWidth, object.position.y + this.blockHeight)

        mainArea[object.spatialID] = null
        topArea[object.spatialID] = null
        bottomArea[object.spatialID] = null
        rightArea[object.spatialID] = null
        topRightArea[object.spatialID] = null
        bottomRightArea[object.spatialID] = null
        leftArea[object.spatialID] = null
        topLeftArea[object.spatialID] = null
        bottomLeftArea[object.spatialID] = null

    }

    /**
     * Updates object grid index
     * 
     * @param {EmagJS.Core.Render.Sprite | EmagJS.Core.Render.Shape} object
     * 
     * @return {void} 
     */
    updateObject(object) {
        this.removeObjectFromGrid(object)
        this.addObjectToGrid(object)
    }

    /**
     * Get area based on x and y position with neighbor depth
     * 
     * @param {integer} x 
     * @param {integer} y
     * @param {integer} depth 
     * 
     * @return {array}
     */
    getArea(x, y, depth = 0) {

        let xIndex = x * this.iBlockWidth | 0
        let yIndex = y * this.iBlockHeight | 0

        // reset temporary array with grid areas
        this.tmpGetAreaArray.length = 0

        // TODO -- depth only working with 0 or 1, greater than 1 can't get diagonals

        // get main area
        if (this.areas[xIndex] && this.areas[xIndex][yIndex]) {
            this.areas[xIndex][yIndex].map((object) => this.tmpGetAreaArray.push(object))
        }

        // if depth, consider neighbor areas
        for (let i = 1; i <= depth; i++) {

            //top area
            if (this.areas[xIndex] && this.areas[xIndex][yIndex - i]) {
                this.areas[xIndex][yIndex - i].map((object) => this.tmpGetAreaArray.push(object))
            }

            //top left area
            if (this.areas[xIndex - i] && this.areas[xIndex - i][yIndex - i]) {
                this.areas[xIndex - i][yIndex - i].map((object) => this.tmpGetAreaArray.push(object))
            }

            //top right area
            if (this.areas[xIndex + i] && this.areas[xIndex + i][yIndex - i]) {
                this.areas[xIndex + i][yIndex - i].map((object) => this.tmpGetAreaArray.push(object))
            }

            //left area
            if (this.areas[xIndex - i] && this.areas[xIndex - i][yIndex]) {
                this.areas[xIndex - i][yIndex].map((object) => this.tmpGetAreaArray.push(object))
            }

            //right area
            if (this.areas[xIndex + i] && this.areas[xIndex + i][yIndex]) {
                this.areas[xIndex + i][yIndex].map((object) => this.tmpGetAreaArray.push(object))
            }

            //bottom area
            if (this.areas[xIndex] && this.areas[xIndex][yIndex + i]) {
                this.areas[xIndex][yIndex + i].map((object) => this.tmpGetAreaArray.push(object))
            }

            //bottom left area
            if (this.areas[xIndex - i] && this.areas[xIndex - i][yIndex + i]) {
                this.areas[xIndex - i][yIndex + i].map((object) => this.tmpGetAreaArray.push(object))
            }

            //bottom right area
            if (this.areas[xIndex + i] && this.areas[xIndex + i][yIndex + i]) {
                this.areas[xIndex + i][yIndex + i].map((object) => this.tmpGetAreaArray.push(object))
            }

        }

        // return grid areas
        return this.tmpGetAreaArray

    }

    /**
     * Get all areas that collisions may be happening - areas that have more than one object
     * 
     * @return {array}
     */
    getCollisionAreas() {

        this.tmpCollisionAreas.length = 0

        for (let x = 0; x < this.areas.length; x++) {
            for (let y = 0; y < this.areas.length; y++) {

                let area = this.areas[x][y]

                let areaObjects = []

                let objects = Object.values(area)

                if (objects.length > 1) {
                    objects.map((areaObject) => {
                        if (areaObject)
                            areaObjects.push(areaObject)
                    })
                }

                if (areaObjects.length > 1) {
                    this.tmpCollisionAreas.push(areaObjects)
                    if (this.debug)
                        this.collidingDebugAreas.push({ x: x, y: y })
                }

            }
        }

        // return all areas that possible collisions will happen
        return this.collisionAreas = this.tmpCollisionAreas

    }

    /**
     * Gets all objects inside an grid based on x and y position
     * 
     * @param {number} x 
     * @param {number} y 
     * 
     * @return {array}
     */
    getObjectsAt(x, y) {

        let area = this.getArea(x, y)

        let arrID = []

        area.map((object) => {
            if (!arrID[object.spatialID]) {
                arrID[object.spatialID] = object
            }
        })

        return arrID

    }

    /**
     * Gets all objects near passed object from spatial space grids
     * 
     * @param {EmagJS.Core.Render.Sprite | EmagJS.Core.Render.Shape} object
     * 
     * @return {array} 
     */
    getObjectsNear(object) {

        // clear old near objects
        for (let i in this.tmpNearestObjects) {
            delete this.tmpNearestObjects[i]
        }

        let mainArea = this.getArea(object.position.x, object.position.y)
        let topArea = this.getArea(object.position.x, object.position.y - this.blockHeight)
        let bottomArea = this.getArea(object.position.x, object.position.y + this.blockHeight)
        let rightArea = this.getArea(object.position.x + this.blockWidth, object.position.y)
        let topRightArea = this.getArea(object.position.x + this.blockWidth, object.position.y - this.blockHeight)
        let bottomRightArea = this.getArea(object.position.x + this.blockWidth, object.position.y + this.blockHeight)
        let leftArea = this.getArea(object.position.x - this.blockWidth, object.position.y)
        let topLeftArea = this.getArea(object.position.x - this.blockWidth, object.position.y - this.blockHeight)
        let bottomLeftArea = this.getArea(object.position.x - this.blockWidth, object.position.y + this.blockHeight)

        let areas = [...mainArea, ...leftArea, ...topLeftArea, ...bottomLeftArea, ...rightArea, ...topRightArea, ...bottomRightArea, ...topArea, ...bottomArea]

        areas.map((areaObject) => {
            if (areaObject) {
                if (areaObject.spatialID != object.spatialID) {

                    this.tmpNearestObjects[areaObject.spatialID] = areaObject

                    // debug only - debug area sprite to highlight
                    if (this.debug) {
                        this.collidingDebugAreas.push({ x: object.position.x * this.iBlockWidth | 0, y: object.position.y * this.iBlockHeight | 0 })
                        this.collidingDebugAreas.push({ x: ((object.position.x + this.blockWidth) * this.iBlockWidth) | 0, y: object.position.y * this.iBlockHeight | 0 })
                        this.collidingDebugAreas.push({ x: ((object.position.x - this.blockWidth) * this.iBlockWidth) | 0, y: object.position.y * this.iBlockHeight | 0 })
                        this.collidingDebugAreas.push({ x: object.position.x * this.iBlockWidth | 0, y: ((object.position.y + this.blockHeight) * this.iBlockHeight) | 0 })
                        this.collidingDebugAreas.push({ x: object.position.x * this.iBlockWidth | 0, y: ((object.position.y - this.blockHeight) * this.iBlockHeight) | 0 })
                        this.collidingDebugAreas.push({ x: ((object.position.x - this.blockWidth) * this.iBlockWidth) | 0, y: ((object.position.y - this.blockHeight) * this.iBlockHeight) | 0 })
                        this.collidingDebugAreas.push({ x: ((object.position.x + this.blockWidth) * this.iBlockWidth) | 0, y: ((object.position.y - this.blockHeight) * this.iBlockHeight) | 0 })
                        this.collidingDebugAreas.push({ x: ((object.position.x - this.blockWidth) * this.iBlockWidth) | 0, y: ((object.position.y + this.blockHeight) * this.iBlockHeight) | 0 })
                        this.collidingDebugAreas.push({ x: ((object.position.x + this.blockWidth) * this.iBlockWidth) | 0, y: ((object.position.y + this.blockHeight) * this.iBlockHeight) | 0 })
                    }

                }
            }
        })

        return Object.values(this.tmpNearestObjects)

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
    draw(graphics) {

        if (this.debug) {

            // create blocks only once
            if (!this.debugBlocks.initialized) {

                this.debugBlocks.initialized = true

                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.columns; j++) {
                        let block = new Sprite(new Vector(((j * this.blockWidth) + ((this.blockWidth * 0.5))) | 0, ((i * this.blockHeight) + ((this.blockHeight * 0.5)) | 0)), this.blockWidth, this.blockHeight, 'transparent', 1, 'royalblue')
                        this.debugBlocks.push(block)
                    }
                }

            } else {

                // reset initial block line color
                this.debugBlocks.map((debugBlock) => {
                    debugBlock.lineColor = 'rgba(0,255,155,0.7)'
                })

                // highlight colliding areas
                this.collidingDebugAreas.map((collidingDebugBlock) => {
                    let area = this.getDebugBlock(collidingDebugBlock.x, collidingDebugBlock.y)
                    if (area)
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

}