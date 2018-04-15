const event = Symbol('realEvent');
const callback = Symbol('callback');
const type = 

export default class VirtualEvent {
    constructor(realEvent, EventType, defaultCallback) {
        this[event] = realEvent;
        this[callback] = defaultCallback;
    }

    prevent() {
        this[callback] = null;
    }

    execute() {
        this[callback](this[event].target.info);
    }

    get type() {
        return this[event].type;
    }

    get target() {
        this[event].target.info;
    }
}