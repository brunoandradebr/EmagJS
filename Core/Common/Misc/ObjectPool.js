class ObjectPool {

    constructor(initializer = () => { }, reseter = () => { }) {

        this.initializer = initializer
        this.reseter = reseter

        this.busy = [initializer()]
        this.free = [0]

    }

    createObject() {

        if (!this.free.length) {

            let oldLength = this.busy.length

            this.busy.length = this.busy.length + 4

            for (let i = oldLength; i < this.busy.length; i++) {
                this.busy[i] = this.initializer()
                this.free.push(i)
            }
        }

        let index = this.free.pop()
        let object = this.busy[index]
        object = this._resetObject(object)
        object.index = index

        return object

    }

    _resetObject(object) {
        return this.reseter(object)
    }

    destroyObject(object) {
        this.free.push(object.index)
    }

}