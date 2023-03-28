import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Storage } from "@google-cloud/storage";


import connectDB from "./mongodb/connect.js";
import itemCodeRouter from "./routes/ItemCode.route.js";
import Multer from "multer";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const storage = new Storage({
    keyFilename: "sa-gcp-personal.json",
});
const bucket = storage.bucket("item-setup-1");

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 25 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});
  
/*app.post("/upload", multer.single("file"), (req, res) => {
    console.log(req.file);
    console.log(req.body.fileName);
    res.send({message: "Request received!"})
});*/

app.post("/upload", multer.single("file"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
  
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });
  
      blobStream.on("error", (err) => {
        res.status(500).send({ message: err.message });
      });
  
      blobStream.on("finish", async (data) => {
        // create a url to access file
        const publicURL = 
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        
  
        try {
          await bucket.file(req.file.originalname).makePublic();
        } catch {
          return res.status(500).send({
            message: `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
            url: publicURL,
          });
        }
  
        res.status(200).send({
          message: "Uploaded the file successfully: " + req.file.originalname,
          url: publicURL,
        });
      });
      blobStream.end(req.file.buffer);
    } catch (err) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
          message: "File size cannot be larger than 25MB!",
        });
      }
  
      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });
    }
  });

app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
});

app.use("/api/v1/itemCode", itemCodeRouter);

const startServer = async () => {
    try {
        connectDB("mongodb://127.0.0.1:27017/local?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0");

        app.listen(8090, () =>
            console.log("Server started on port http://localhost:8090"),
        );
    } catch (error) {
        console.log(error);
    }
};

startServer();