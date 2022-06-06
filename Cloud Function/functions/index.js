const functions = require("firebase-functions");
const formidable = require("formidable-serverless");
const firebase = require("firebase-admin");
//const UUID = require("uuid-v4");

const { Storage } = require("@google-cloud/storage");


firebase.initializeApp(functions.config().firebase);


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


exports.uploadFile = functions.https.onRequest((req, res) => {
  var form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      var file = files.file;
      if (!file) {
        reject(new Error("no file to upload, please choose a file."));
        return;
      }
      var filePath = file.path;
      var fileName = file.name;
      var fileType = fileName.split(".").pop();

      console.log("File path: " + filePath);
      console.log("File name: " + fileName);
      console.log("File type: " + fileType);


      const storage = new Storage()
      filePath.replace('tmp/','');
      filePath.replace('/tmp/','');

      console.log("File path 2: " + filePath);

      var datetime = new Date().toLocaleString();
      datetime = datetime.split("/").join("-");


      var destino = "";
      if(fileType === "jpg" || fileType === "png"){
        destino = 'images/' +  fileName;
      }
      else if(fileType === "mp4"){
        destino = 'videos/' +  fileName;
      }

      const response = await storage.bucket("gs://drone-control-app.appspot.com").upload( filePath, {
        contentType: file.type,
        destination: destino
      });

      const fullMediaLink = response[0].metadata.mediaLink + "";
      const mediaLinkPath = fullMediaLink.substring(
        0,
        fullMediaLink.lastIndexOf("/") + 1
      );
      const downloadUrl =
        mediaLinkPath +
        encodeURIComponent(response[0].name) +
        "?alt=media&token=";

      console.log("downloadUrl", downloadUrl);

      resolve({ fileInfo: response[0].metadata, downloadUrl }); // Whole thing completed successfully.
    });
  })
    .then((response) => {
      res.status(200).json({ response });
      return null;
    })
    .catch((err) => {
      console.error("Error while parsing form: " + err);
      res.status(500).json({ error: err });
    });
});

exports.uploadFileProcessed = functions.https.onRequest((req, res) => {
  var form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      var file = files.file;
      if (!file) {
        reject(new Error("no file to upload, please choose a file."));
        return;
      }
      var filePath = file.path;
      var fileName = file.name;
      var fileType = fileName.split(".").pop();

      console.log("File path: " + filePath);
      console.log("File name: " + fileName);
      console.log("File type: " + fileType);


      const storage = new Storage()
      filePath.replace('tmp/','');
      filePath.replace('/tmp/','');

      console.log("File path 2: " + filePath);

      var datetime = new Date().toLocaleString();
      datetime = datetime.split("/").join("-");


      var destino = "";
      if(fileType === "jpg" || fileType === "png"){
        destino = 'images/' +  fileName;
      }
      else if(fileType === "mp4" || fileType === "avi" ){
        destino = 'videosPersonas/' +  fileName;
      }

      const response = await storage.bucket("gs://drone-control-app.appspot.com").upload( filePath, {
        contentType: file.type,
        destination: destino
      });

      const fullMediaLink = response[0].metadata.mediaLink + "";
      const mediaLinkPath = fullMediaLink.substring(
        0,
        fullMediaLink.lastIndexOf("/") + 1
      );
      const downloadUrl =
        mediaLinkPath +
        encodeURIComponent(response[0].name) +
        "?alt=media&token=";

      console.log("downloadUrl", downloadUrl);

      resolve({ fileInfo: response[0].metadata, downloadUrl }); // Whole thing completed successfully.
    });
  })
    .then((response) => {
      res.status(200).json({ response });
      return null;
    })
    .catch((err) => {
      console.error("Error while parsing form: " + err);
      res.status(500).json({ error: err });
    });
});