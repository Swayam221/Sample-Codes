// Make a get route to stream videos from
app.get("/video", function (req, res) {
    mongodb.MongoClient.connect(url, function (error, client) {
      if (error) {
        res.status(500).json(error);
        return;
      }
  
      // Check for range headers to find our start time
      const range = req.headers.range;
      if (!range) {
        res.status(400).send("Requires Range header");
      }
  
      const db = client.db('videos');
      // GridFS Collection
      db.collection('fs.files').findOne({}, (err, video) => {
        if (!video) {
          res.status(404).send("No video uploaded!");
          return;
        }
  
        // Create response headers
        const videoSize = video.length;
        const start = Number(range.replace(/\D/g, ""));
        const end = videoSize - 1;
  
        const contentLength = end - start + 1;
        const headers = {
          "Content-Range": `bytes ${start}-${end}/${videoSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
        };
  
        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);
  
        // Get the bucket and download stream from GridFS
        const bucket = new mongodb.GridFSBucket(db);
        const downloadStream = bucket.openDownloadStreamByName('talawa', {
          start
        });
  
        // Finally pipe video to response
        downloadStream.pipe(res);
      });
    });
  });
