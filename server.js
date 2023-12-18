const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json)
app.use(cors())

const uri = 
    "mongodb+srv://admin:nV6GBeMkI9tunnbW@full-stack-webdev.biknsqq.mongodb.net/?retryWrites=true&w=majority";

const PORT = 4000;

// async function since we don't know how
// long itll take to connect to mongo
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}

connect();

app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

// start up backend (runs on port 5000)
// client runs on port 3000 by default
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
