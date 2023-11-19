const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const port = process.env.PORT || 5000;
const THREAD_COUNT = 8;

// create worker and send thread count as workerData
function createWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker-optimized.js", {
      workerData: {
        thread_count: THREAD_COUNT,
      },
    });

    // get the data
    worker.on("message", (data) => {
      resolve(data);
    });

    // get the error
    worker.on("error", (err) => {
      reject(err);
    });
  });
}

app.get("/non-blocking", (req, res) => {
  res.status(200).send("This is non-blocking");
});

app.get("/blocking", async (req, res) => {
  const workerPromises = [];
  //call the worker multiply by thread count and sum up the results
  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker());
  }

  const threadResult = await Promise.all(workerPromises);
  const total =
    threadResult[0] + threadResult[1] + threadResult[2] + threadResult[3];

  res.status(200).send(`Result is: ${total}`);
});

app.listen(port, () => {
  console.log(`Application is listening on port ${port}`);
});
