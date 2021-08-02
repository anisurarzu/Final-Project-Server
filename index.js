const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rbclp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("doctors"));
app.use(fileUpload());

const port = 5000;

app.get("/", (req, res) => {
  res.send("hello from db it's working working");
});
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const questionCollection = client
    .db("scholarsPortal")
    .collection("questionbank");
  const answerCollection = client.db("scholarsPortal").collection("answer");

  // send question to the scholar
  app.post("/addQuestion", (req, res) => {
    const question = req.body;
    questionCollection.insertOne(question).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //get question for scholar

  app.get("/allQuestion", (req, res) => {
    questionCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //send answer for user

  app.post("/sendAnswer", (req, res) => {
    const answer = req.body;
    answerCollection.insertOne(answer).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //get answer for user

  app.get("/sendAnswer", (req, res) => {
    answerCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //delete question from scholar panel

  app.delete("/delete/:id", (res, req) => {
    console.log(req.params);
    questionCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((err, result) => {
        console.log(result);
      });
  });
});

app.listen(process.env.PORT || port);
