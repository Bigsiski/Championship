import {create, findParentKeys} from "../crud";
import * as fs from 'fs';

var async = require("async");
const router = require('express').Router();

router.get("/extract", function (req, res, next) {
  for (let i = 0; i < req.query.path.length; i++) {
  }
  res.send('respond with a resource');
});

//Це не дуже хороший код.
router.get("/metadata", async function (req, res, next) {
  console.log("Getting metadata..");
  const response = [];

  await import("../schemas/" + req.query.table).then(async (Table) => {
    //Робимо обхід, оскільки eachPath не може бути async
    const collection = Table[req.query.table];
    const parent = collection.schema.path('Parent.ParentName');
    
    if (collection.schema.paths.hasOwnProperty('Parent.ParentName')) {
      let keysList = await findParentKeys(collection);
      response.push([{[parent.defaultValue]: keysList}]);
    }

    return collection;
  }).then((collection) => {
    collection.schema.eachPath((path) => {
      if (path !== '_id' && path !== '__v' && !path.includes('Parent')) {
        console.log(path);
        response.push(path);
      }
    });
  })
    .catch((err) => {
      res.json("Error " + err)
    });


  console.log("response")
  console.log(response)
  res.json(response);
});


router.post("/", async function (req, res, next) {
  console.log("Posting new data...");
  console.log(req.query.table);
  await create(req.query.table, req.body);
  res.status(200).send("everything is okay...")
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
