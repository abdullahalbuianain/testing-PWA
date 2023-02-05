const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
//const morgan = require("morgan");
const path = require("path");

let app = express(); 
app.use(cors());
app.use(bodyParser.json());


let propertiesReader = require("properties-reader");
let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = propertiesReader(propertiesPath);

let dbPprefix = properties.get("db.prefix");
let dbUsername = encodeURIComponent(properties.get("db.user"));
let dbPwd = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");

const uri = dbPprefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;

let db;
const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true,
useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db(dbName).collection("lessons");
  db = client.db(dbName);

  // perform actions on the collection object
  //client.close();

});

app.set('json spaces', 3)

// const {MangoClient, ServerApiVersion, ObjectId } = require("mangodb");
// const client = new MangoClient(uri, { serverApi: ServerApiVersion.v1});
// let db = client.db(dbName);
 
app.use(express.json());

app.use(function(req, res, next) {
    console.log("Incoming request:" + req.url);
    next();
});


app.param("collectionName", function(req, res, next, collectionName) {
    req.collection = db.collection(collectionName);
    return next();
  });
  
  app.get("/collections/:collectionName", function(req, res, next) {
    req.collection.find({},{sort: [["id", 1]]}).toArray(function(err, results) {
      if (err) {
        return next(err);
      }
      res.send(results);
    });
  });
  

app.get("/", function(req, res, next) {
    res.send("Select a collection, e.g., /collections/lessons");
});

app.get("/collections/:collectionName", function(req, res, next) {
    req.collection.find({},{sort: [["id", 1]]}).toArray(function(err, results) {
        if (err) {
            return next(err);
        }
        res.status(200)
        res.send(results);
    });
});


app.post("/collections/:collectionName", function(req, res, next) {
    req.collection = db.collection("orders");
    req.collection.insertOne(req.body, function(err, results) {
      if (err) {
        return next(err);
      }
      res.send(results);
      });
    });
  
  


//returns lesson images, or an error message if the image file does not exist
app.use("/images", (req, res, next) => {
    if (!req.url.endsWith('.jpg')) {
      return res.status(400).send({ error: 'Only .jpg files are allowed' });
    }
    return express.static(path.join(__dirname, "assets"))(req, res, next);
  });
  
  
  


app.use(function(req, res, next) {
    res.status(404).send("Resource not found!");
});


app.listen(2500, function() {
    console.log("App started on port 2500");
});