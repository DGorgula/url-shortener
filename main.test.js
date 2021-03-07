const request = require('supertest');
const app = require('./app.js');
const assert = require('assert');

// app.get("/:shortUrl"
// - response as supposed to be
// id not valid
// id not found
// 
describe("get routes respond and throw properly", () => {

    test("response redirects", (done) => {
        request(app)
            .get('/29aef54')
            .expect(303)
            .then((response) => {
                assert.strictEqual(response.header.location, 'https://www.fairphone.com/en/');
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    test("id not found", (done) => {
        request(app)
            .get('/c47ccd6')
            .expect(200)
            .then((response) => {
                assert.strictEqual(response.text, "Couldn't get url from specified shortened url: There is no such shortened url");
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    test("Invalid id", (done) => {
        request(app)
            .get('/c47@c5')
            .expect(200)
            .then((response) => {
                assert.strictEqual(response.text, "Couldn't get url from specified shortened url: Invalid shortened url");
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    test("shows shortened link statistics", (done) => {
        request(app)
            .get('/api/statistic/29aef54-id')
            .expect(200)
            .then((response) => {
                const content = JSON.parse(response.text);
                console.log(response);
                console.log(content);
                assert("creationDate" in content);
                assert.strictEqual(content.creationDate, "2021-03-06 17:08:16");
                assert("originalUrl" in content);
                assert.strictEqual(content.originalUrl, "https://www.fairphone.com/en/");
                assert("shorturl-id" in content);
                assert.strictEqual(content["shorturl-id"], "29aef54");
                assert("redirectCount" in content);
                assert(/^([\d]+)$/.test(content.redirectCount));
                done();
            })
            .catch(error => {
                done(error);
            });
    });
});

describe("post route respond and throw properly", () => {
    test("responds JSON successfuly", (done) => {
        request(app)
            .post('/api/shorturl/new')
            .send({ "url": "https://www.npmjs.com/package/supertest" })
            .type('form')
            .expect(200)
            .then((response) => {
                assert.strictEqual(response.body.originalUrl, "https://www.npmjs.com/package/supertest");
                assert(/(^[A-z0-9]{7}$)/.test(response.body["shorturl-id"]));
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    test("Invalid hostname", (done) => {
        request(app)
            .post('/api/shorturl/new')
            .send({ "url": "https://modsdfhgsdhferncss.com" })
            .type('form')
            .expect(200)
            .then((response) => {
                assert.strictEqual(response.text, "Invalid hostname");
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    test("Invalid url", (done) => {
        request(app)
            .post('/api/shorturl/new')
            .send({ "url": "http//www.google.com" })
            .type('form')
            .expect(200)
            .then((response) => {
                assert.strictEqual(response.text, "Invalid url");
                done();
            })
            .catch(error => {
                done(error);
            });
    });
});