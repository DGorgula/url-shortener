const { v4: newId } = require('uuid');

class urlClass {
    constructor(url) {
        this.url = url;
        this.shortRoute = newId().slice(0, 7);
        this.counter = 0;
    }
}

module.exports = { urlClass }