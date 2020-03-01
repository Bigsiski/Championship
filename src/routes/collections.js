import {create, findParentKeys, extractData, updateData, deleteData} from "../crud";
import * as fs from 'fs';

const Promise = require('promise');
const router = require('express').Router();


//Це не дуже хороший код.
router.get("/metadata", async function (req, res, next) {
  console.log("Getting metadata..");
  let response = [];

  await import("../schemas/" + req.query.table).then(async (Table) => {

    const collection = Table[req.query.table];

    collection.schema.eachPath((path) => {
      //руками виключаю поля які не треба заповнювати користувачу.
      if (path !== '_id' && path !== '__v' && !path.includes('Parent') && path !== 'teams' && path !== 'players') {
        console.log(path);
        response.push(path);
      }
    });
    // console.log(req.query.requireParents);
    if (req.query.requireParents && collection.schema.paths.hasOwnProperty('Parents')) {
      let keysList = await Promise.all(collection.schema.tree.Parents.map(async (Parent) => {
        return await findParentKeys(Parent.ParentName.default)
      }));
      response = response.concat(keysList);
    }
  }).catch((err) => {
    res.json("Error " + err)
  });
  res.json(response);
});


router.post("/", async function (req, res, next) {
  console.log("Posting new data...");
  console.log(req.query.table);
  const response = await create(req.query.table, req.body);
  res.status(200).send(response)
});

router.get("/extract", async function (req, res, next) {
  console.log("extracting...");
  console.log(req.query);
  const response = await extractData(req.query.table, req.query.field, req.query.value, req.query.projection, req.query.sort);
  res.send(response);
});

router.put("/", async function (req, res, next) {
  console.log("updating...");
  console.log(req.query);
  const response = await updateData(req.query.table, req.query.field, req.body.newData);
  res.send(response);
});

router.delete("/", async function (req, res, next) {
  console.log("deleting...");
  console.log(req.query);
  const response = await deleteData(req.query.table, req.query.field, req.query.value);
  res.send(response);
});

router.get("/", function (req, res, next) {
  console.log("Getting tables names..");
  const list = [];
  fs.readdirSync('./src/schemas').forEach(async (filename, index) => {
    filename = filename.replace(/\.[^.]+$/, '');
    console.log(filename);
    list[index] = filename;
  });
  res.json(list);
  /* mongoose.connection.db.listCollections().toArray(function (err, names) {
     console.log(names);
     res.json(names);
   }); Бо можуть бути не створені*/
});

module.exports = router;
