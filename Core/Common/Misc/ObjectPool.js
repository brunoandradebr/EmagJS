/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */

/**
 * Object pool pattern
 */
class ObjectPool {


    /**
     * 
     * @param {function} initializer
     * @param {function} reseter
     */
    constructor(initializer = () => { }, reseter = () => { }) {

        /**
         * Method that describes what to be created
         * 
         * @type {function}
         */
        this.initializer = initializer

        /**
         * Method that reset created object
         * 
         * @type {function}
         */
        this.reseter = reseter

        /**
         * Container that holds pooled objects
         * 
         * @type {array}
         */
        this.inUse = [initializer()]

        /**
         * Array that holds object's index that are free to be used
         * 
         * @type {array}
         */
        this.free = [0]

    }

    /**
     * Allocate or get a pooled object
     * 
     * @return {void}
     */
    create() {

        // all pooled objects are been used
        if (!this.free.length) {

            // cache current inUse array length
            let oldLength = this.inUse.length

            // update inUse length
            this.inUse.length = this.inUse.length + 2

            // allocate new objects to be used
            for (let i = oldLength; i < this.inUse.length; i++) {
                this.inUse[i] = this.initializer()
                this.free.push(i)
            }
        }

        // get a free object from pool
        let index = this.free.pop()
        let object = this.inUse[index]
        // reset object state
        object = this._resetObject(object)
        object.index = index

        return object

    }

    /**
     * Destroy
     * 
     * Send object's index to free array
     * 
     * @param {object} object 
     * 
     * @return {void}
     */
    destroy(object) {
        this.free.push(object.index)
    }

    /**
     * private _resetObject
     * 
     * @param {object} object
     * 
     * @return {object} 
     */
    _resetObject(object) {
        return this.reseter(object)
    }

}