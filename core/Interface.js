const Event = require('./Event');

class Interface extends Event.Emitter {

    constructor (painter) {
        super();
    }
}

module.exports = Interface;
