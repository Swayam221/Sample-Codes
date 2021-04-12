const express = require("express");
const app = express();
const fs = require("fs");
const mongodb = require('mongodb');
const url = 'mongodb://localhost:27017';
app.get("/", function (req, res) {
  res.send(“videos”);
});
app.post('/video', function (req, res) {
  mongodb.MongoClient.connect(url, function (error, client) {
    if (error) {
      res.json(error);
      return;
    }
    // connect to the videos database
    const db = client.db('videos');
    // Create GridFS bucket to upload a large file
    const bucket = new mongodb.GridFSBucket(db);
    // create upload stream using GridFS bucket
    const videoUploadStream = bucket.openUploadStream('talawa');
 
    // You can put your file instead of talawa.mp4
    const videoReadStream = fs.createReadStream('./talawa.mp4');
    // Finally Upload!
    videoReadStream.pipe(videoUploadStream);
    // All done!
    res.status(200).send("Done...");
  });
});
app.listen(8000, function () {
  console.log("Listening on port 8000!");
});
