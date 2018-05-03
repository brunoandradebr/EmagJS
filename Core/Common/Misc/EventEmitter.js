/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Custom event emmiter
 */
class EventEmitter {

    constructor() {

        /**
         * All events container
         * 
         * @type {object}
         */
        this.events = {}

    }

    /**
     * Registers a callback to an event
     * 
     * @param {string}   event 
     * @param {function} callback 
     * 
     * @return {void}
     */
    addEventListener(event, callback) {

        let handlers = this.events[event] || []

        handlers.push({
            callback: callback
        })

        this.events[event] = handlers

    }

    /**
     * Executes all callbacks of an event
     * 
     * @param {string}       event
     * @param {HTMLDOMEvent} originalEvent
     * 
     * @return {void}
     */
    dispatchEvent(event, originalEvent) {

        // if event has callback registered
        if (this.events[event]) {

            // executes all callbacks registered
            this.events[event].map((callback) => {

                let eventObject = {
                    target: this,
                    event: event,
                    originalEvent: originalEvent,
                }

                callback.callback(eventObject)

            })

        }

    }

}