/**
 * Created by amit on 4/13/14.
 */

import events from 'events';

class EventUtil {
    constructor() {
        this.eventEmitter = new events.EventEmitter();
    }
    getEventEmitter() {
        return this.eventEmitter;
    }
}


// Singleton
let instance = new EventUtil();
export default instance;
