require("dotenv").config();

const express = require("express");

const cors = require("cors");


const connectToDb = require("./config/db");


const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

connectToDb();

app.get("/", (req, res) => {
  res.send("App is Working Great...");
});



module.exports = app;
