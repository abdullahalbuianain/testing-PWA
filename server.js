const express = require("express");
const cors = require("cors");
//const morgan = require("morgan");
const path = require("path");

let app = express(); 
//app.use(cors());
app.use(cors());


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
 
//const app = express();

// const { MongoClient } = require("mongodb");
// const uri = "mongodb+srv://abdulla:4BPhMR-h892H.qv@coursework-2.krtiwxc.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   if (err) {
//     console.log("Error connecting to MongoDB: ", err);
//     process.exit(1);
//   }
//   console.log("Successfully connected to MongoDB");
//   client.close();
// });


app.use(function(req, res, next) {
    console.log("Incoming request:" + req.url);
    next();
});

app.use(function(req, res, next) {
    req.collection = db.collection("lessons");
    next();
});

app.param("/", function(req, res, next, collectionName) {
    res.collection = db.collection(collectionName);
    return next();
});


app.get("/", function(req, res, next) {
    res.send("Select a collection, e.g., /collections/lessons");
});

app.get("/collections/lessons", function(req, res, next) {
    req.collection.find({}).toArray(function(err, results) {
        if (err) {
            return next(err);
        }
        res.send(results);
    });
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(function(req, res, next) {
    res.status(404).send("File not found!");
});

app.post("/orders", function(req, res, next) {
    req.collection = db.collection("orders");
    req.collection.insertOne(req.body, function(err, results) {
        if (err) {
            return next(err);
        }
        res.send(results.ops[0]);
    });
});


app.use(function(req, res, next) {
    res.status(404).send("Resource not found!");
});

app.listen(2500, function() {
    console.log("App started on port 2500");
});