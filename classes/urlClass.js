const { v4: newId } = require('uuid');

class urlClass {
    constructor(url) {
        this.originalUrl = url;
        this["shorturl-id"] = newId().slice(0, 7);
        this.redirectCount = 0;
        this.creationDate = this.newSqlDate();
    }

    newSqlDate() {
        const temporaryDate = new Date();
        const ISODate = new Date(temporaryDate.setHours(temporaryDate.getHours() + 2));
        const sqlDate = ISODate.toISOString().slice(0, 19).replace("T", " ");
        return sqlDate;
    }
}

module.exports = { urlClass }