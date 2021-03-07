const { response } = require('express');
const fetch = require('node-fetch');
const { urlClass } = require('./urlClass');



// pull API_KEY from .env file
// const API_KEY = process.env.API_KEY;
const API_KEY = '$2b$10$zZDdF7tEnFjVuWTOTyEIhuxHrQKMtNfrGQojBkNT5Hl1PBUn/LQ4K';     // .env in .gitignore so I added here the public key.


const DB = process.env.NODE_ENV === 'test' ? 'https://api.jsonbin.io/v3/b/6044209e683e7e079c468d3b' : 'https://api.jsonbin.io/v3/b/6042537a9342196a6a6e2232';

class DataBase {
    constructor(data) {
        this.data = data;
    }

    getAllData() {
        const options = {
            headers: {
                'X-Master-Key': API_KEY,
            }
        }
        return fetch(DB + '/latest', options)
            .then((response) => {
                return response.json()
                    .then((allData) => {
                        this.data = allData.record;
                        return this.data;
                    }).catch(error => { error => console.log("there was an error in getAllData function. The error was: ", error); })
            }).catch(error => {
                console.log("something went wrong with isThere function", error);
            });
    }



    isThere(shortUrl, redirect) {
        return this.getAllData()
            .then((data) => {
                if (!/(^[A-z0-9]{7}$)/.test(shortUrl)) {
                    throw new Error("Invalid shortened url");
                }
                for (const urlObject of data) {
                    if (shortUrl === urlObject["shorturl-id"]) {
                        if (redirect) {
                            urlObject.redirectCount++;
                            this.data = data;
                            this.updateCounter(this.data).catch(() => {
                                throw new Error("could not update the url object");
                            });
                            return urlObject.originalUrl;
                        }
                        else {
                            return urlObject;
                        }
                    }
                }
                throw new Error("There is no such shortened url");
            }).catch(error => {
                throw new Error(error.message);
            });
    }

    updateCounter(data) {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,
                'X-Bin-Versioning': 'false'
            },
            body: JSON.stringify(data)
        }
        return fetch(DB, options)
            .then(response => {
                return response.json()
                    .then(data => { return data })
                    .catch(updateError => { throw { message: "something went wrong with the counter update:", error: updateError } });
            });
    }

    send(data) {
        const httpRegex = /^(http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,6}?(\/([\w\/_\.]*(\?\S+)?)?)?/;
        if (!httpRegex.test(data.url)) {
            return new Promise((resolve, reject) => { reject(new Error("Invalid url")) });
        }
        // get the last data
        return fetch(data.url).then(() => {
            return this.getAllData()
                .then(allData => {
                    const newUrl = new urlClass(data.url);
                    allData.push(newUrl);
                    const options = {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Master-Key': API_KEY,
                            'X-Bin-Versioning': 'false'
                        },
                        body: JSON.stringify(allData)
                    }
                    return fetch(DB, options)
                        .then(response => {
                            return response.json()
                                .then(data => {
                                    return { originalUrl: newUrl.originalUrl, "shorturl-id": newUrl["shorturl-id"] };
                                })
                                .catch(updateError => {
                                    throw updateError.message
                                });
                        });
                })
                .catch(sendMethodError => {
                    throw new Error(sendMethodError.message);

                });
        })
            .catch((error) => {
                if (error.code === 'ENOTFOUND') {
                    throw new Error("Invalid hostname");
                }
                throw new Error(error.message);
            });
    }
}

module.exports = { DataBase };