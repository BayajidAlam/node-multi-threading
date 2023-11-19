const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const port = process.env.PORT || 5000;

app.get("/non-blocking", (req, res) => {
  res.status(200).send("This is non-blocking");
});

app.get("/blocking", (req, res) => {
  const worker = new Worker("./worker.js");

  // get the data 
  worker.on("message", (data) => {
    res.status(200).send(`Result is: ${data}`);
  });

  // get the error
  worker.on("error", (err) => {
    res.status(200).send(`An error occured: ${err}`);
  });
});

app.listen(port, () => {
  console.log(`Application is listening on port ${port}`);
});
