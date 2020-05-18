import {create, findParentKeys, extractData, updateData, deleteData} from "../crud";
import * as fs from 'fs';

const Promise = require('promise');
const router = require('express').Router();

router.get("/metadata", async function (req, res, next) {
    let response = [];
    await import("../schemas/" + req.query.table).then(async (Table) => {
        const collection = Table[req.query.table];
        collection.schema.eachPath((path) => {
            //Вимикаю поля які не треба заповнювати користувачу.
            if (path !== '_id' && path !== '__v' && !path.includes('Parent') && path !== 'teams' && path !== 'players') {
                response.push(path);
            }
        });
        if (req.query.requireParents && collection.schema.paths.hasOwnProperty('Parents')) {
            let keysList = await Promise.all(collection.schema.tree.Parents.map(async (Parent) => {
                return await findParentKeys(Parent.ParentName.default)
            }));
            response = response.concat(keysList);
        }
    }).catch((err) => {
        res.json("Error " + err)
    });
    res.status(200).json(response);
});

router.get("/extract", async function (req, res, next) {
    const response = await extractData(
        req.query.table, req.query.field, req.query.value, req.query.projection, req.query.sort
    );
    res.status(200).send(response);
});

router.post("/", async function (req, res, next) {
    const response = await create(req.query.table, req.body);
    res.status(200).send(response)
});

router.put("/", async function (req, res, next) {
    const response = await updateData(req.query.table, req.query.field, req.body.newData);
    res.status(200).send(response);
});

router.delete("/", async function (req, res, next) {
    const response = await deleteData(req.query.table, req.query.field, req.query.value);
    res.status(200).send(response);
});

router.get("/", function (req, res, next) {
    const list = [];
    fs.readdirSync('./src/schemas').forEach(async (filename, index) => {
        filename = filename.replace(/\.[^.]+$/, '');
        console.log(filename);
        list[index] = filename;
    });
    res.json(list);
});

module.exports = router;
