'use strict';

const utils = require('./utils');
const config = require('./config');

const app = require('express')();
module.exports = app;

const expressMongoDb = require('express-mongo-db');
app.use(expressMongoDb(config.db.url));

app.get('/:number', function (req, res) {
    let uniques = new Set();
    let added  = [];
    let codes = req.db.collection('codes').find();

    let number = Number(req.params.number);

    codes.forEach(function (item) {
        uniques.add(item.value);
    }, function () {
        let size = uniques.size;
        while (uniques.size < size + number) {
            let rand = utils.random();
            if (!uniques.has(rand)) {
                uniques.add(rand);
                added.push({
                    value: rand
                });
            }
        }
        req.db.collection('codes').insertMany(added);
        res.send(added.map(function (item) {
            return item.value;
        }));
    });
});
