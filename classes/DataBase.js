const fetch = require('node-fetch');
const { urlClass } = require('./urlClass');



// transfer to .env file
const API_KEY = '$2b$10$zZDdF7tEnFjVuWTOTyEIhuxHrQKMtNfrGQojBkNT5Hl1PBUn/LQ4K';
const DB = 'https://api.jsonbin.io/v3/b/6042537a9342196a6a6e2232';

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
                        console.log(this.data);
                        return this.data;
                    }).catch(error => { error => console.log("there was an error in getAllData function. The error was: ", error); })
            }).catch(error => {
                console.log("something went wrong with isThere function", error);
            });
    }



    isThere(shortUrl, redirect) {
        return this.getAllData()
            .then((data) => {
                console.log(data);
                for (const urlObject of data) {
                    if (shortUrl === urlObject.shortRoute) {
                        if (redirect) {
                            urlObject.redirectCount++;
                            this.data = data;
                            this.updateCounter(this.data).catch(() => {
                                console.log("could not update the url object");
                            });
                            return urlObject.url;
                        }
                        else {
                            return urlObject;
                        }
                    }
                }
                return new Error(["There is no such shortUrl", data.urls, shortUrl]);
            }).catch(error => { console.log("error in isThere method, the error was: ", error); });
        // const options = {
        //     headers: {
        //         'X-Master-Key': API_KEY,
        //     }
        // }
        // return fetch(DB + '/latest', options)
        //     .then(response => response.json()
        //         .then(data => {
        //             if (shortUrl in data.urls) {
        //                 const url = data.urls.shortUrl;
        //                 return shortUrl.record;
        //             }

        // return false;
        // }))
        // .catch(error => {
        //     console.log("something went wrong with isThere function", error);
        // });
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
        console.log("in the counter, the data is: ", this.data);
        return fetch(DB, options)
            .then(response => {
                return response.json()
                    .then(data => { return data })
                    .catch(updateError => { throw { message: "something went wrong with the counter update:", error: updateError } });
            });
    }

    send(data) {

        // get the last data
        return this.getAllData()
            .then(allData => {
                // console.log(urlClass);
                const newUrl = new urlClass(data.url);
                // console.log(newUrl);
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
                                console.log("counter updated");
                                return { originalUrl: newUrl.originalUrl, "shorturl-id": newUrl["shorturl-id"] };
                            })
                            .catch(updateError => { throw { message: "something went wrong with the update:", error: updateError } })
                    });
            })
            .catch(sendMethodError => {
                console.log({ message: "something went wrong with the send method:", error: sendMethodError });

            });
    }
}

module.exports = { DataBase };