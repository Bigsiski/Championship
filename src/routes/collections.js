import {create} from "../crud";
import mongoose from 'mongoose';

const router = require('express').Router();


router.get("/extract", function (req, res, next) {
  console.log('Extracting data...');
  console.log(req.query);
  console.log("length: ");
  console.log(req.query.path.length);

  for (let i = 0; i < req.query.path.length; i++) {

  }
  res.send('respond with a resource');
});


router.get("/metadata", async function (req, res, next) {
  console.log("Getting metadata..");

  const response = [];

  await import("../schemas/" + req.query.table).then((Table) => {
    Table[req.query.table].schema.eachPath(function (path) {
      if (path !== '_id' && path !== '__v')
        response.push(path)
    });
  })
    .catch((err) => {
      res.json(err)
    });

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
  mongoose.connection.db.listCollections().toArray(function (err, names) {
    console.log(names);
    res.json(names);
  });
});

module.exports = router;
