var router = require('express').Router()
var Photo = require('../../models/photo')

var mongoose = require('mongoose')
var db = require('../../database')
// var emb = require("express-mongo-busboy")({mongoose:db});

// ======================================================================

// var fs = require('fs');
// var Grid = require('gridfs-stream');
// Grid.mongo = db.mongo;
// // Grid.mongo = mongoose.mongo;

// var connection = db.connection;
// var gfs = Grid(connection.db);
// var GridFs = require('grid-fs');

// ======================================================================

var _ = require('lodash');
var Grid = require('gridfs-stream');
// Grid.mongo = db.mongo;
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);

router.post('/upload_repository', function(req,res,next) {
    console.log('api/photos/upload_repository');
    // console.log('upload body: ', req.body);
    console.log('upload files: ', req.files);
    var sampleFile = req.files.sampleFile;
    var files = req.files;

    // var part = req.files.file;
    // var writeStream = gfs.createWriteStream({
    //     filename: part.name,
    //     mode: 'w',
    //     content_type: part.mimetype
    // });
    // writeStream.on('close', function() {
    //      return res.status(200).send({
    //         message: 'Success'
    //     });
    // });
    // writeStream.write(part.data);
    // writeStream.end();

    // var sampleFile;
 
    // if (!req.files) {
    //     res.send('No files were uploaded.');
    //     return;
    // }

    var files = req.files;
    res.json({files: files});
})

router.post('/upload', function(req,res,next) {
    console.log('\n ***********************************************************');
    console.log('api/photos/upload');
    // console.log('upload body: ', req.body);
    console.log('upload req.body: ', req.body);
    console.log('upload req.files: ', req.files);

    // var part = req.files.file;
    // var writeStream = gfs.createWriteStream({
    //     filename: part.name,
    //     mode: 'w',
    //     content_type: part.mimetype
    // });
    // writeStream.on('close', function() {
    //      return res.status(200).send({
    //         message: 'Success'
    //     });
    // });
    // writeStream.write(part.data); // the data is base 64 encoded string
    // writeStream.end();

    // var sampleFile;
 
    // if (!req.files) {
    //     res.send('No files were uploaded.');
    //     return;
    // }
 
    // sampleFile = req.files.sampleFile;
    // sampleFile.mv('http://localhost:3000/api/photos/', function(err) {
    //     if (err) {
    //         res.status(500).send(err);
    //     }
    //     else {
    //         res.send('File uploaded!');
    //     }
    // });
})

router.get('/upload/:filename', function(req,res,next){
    console.log('upload get');
    gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {

        if(files.length===0){
            return res.status(400).send({
                message: 'File not found'
            });
        }

        res.writeHead(200, {'Content-Type': files[0].contentType});
        
        var readstream = gfs.createReadStream({
              filename: files[0].filename
        });

        readstream.on('data', function(data) {
            res.write(data);
        });
        
        readstream.on('end', function() {
            res.end();        
        });

        readstream.on('error', function (err) {
          console.log('An error occurred!', err);
          throw err;
        });
    });
})  

// ======================================================================


// route to authenticate a user (POST http://localhost:3000/api/photos)
router.post('/', function(req,res,next) {

  // var img = req.body.img
  // console.log('photos.js img: ', img);
  // var photo = new Photo({
  //   img: img
  // })
  // photo.save(function (err,photo) {
  //   if (err) { return next(err) }
  //   res.json(photo)
  // })

  // var dbFileName = "DemoImage";
  // var imageFile = req.body.img;
  // // GridFS gfsPhoto = new GridFS(db, "photo");
  // var gfsPhoto = gfs.createWriteStream({
  //       filename: dbFileName
  // });
  // var gfsFile = gfsPhoto.createFile(imageFile);
  // gfsFile.setFilename(dbFileName);
  // gfsFile.save();

  // var dbFileName = "DemoImage";
  // var imageFile = req.body.img;
  // var gfsPhoto = new GridFs(db, 'photos');

  // var gfsFile = gfsPhoto.createFile(imageFile);
  // gfsFile.setFilename(dbFileName);
  // gfsFile.save();

   // streaming to gridfs
   // filename to store in mongodb
    var dbFileName = "DemoImage";
    var imageFile = req.body.img;
    // var imageFilePath = 'http://localhost:3000/api/photos';
    // var imageFilePath = 'https://angular-file-upload-cors-srv.appspot.com/upload';
    var imageFilePath = 'mongodb://localhost/onehabitayear';
   	var writestream = gfs.createWriteStream({
       filename: dbFileName
   	});
   	console.log('imageFile: ', imageFile);
   	console.log('imageFilePath: ', imageFilePath);
  	fs.createReadStream(imageFile).pipe(writestream);
   	writestream.on('close', function (file) {
        console.log(file.filename + ' written to the database'); // do something with file
        console.log('image file: ', file);
	});
})

router.post('/storage', function(req,res,next) {
	var img = req.body
	console.log('photos/api/storage req.body: ', req.body);
})

module.exports = router

/*
String dbFileName = "DemoImage";
File imageFile = new File("c:\\DemoImage.png");
GridFS gfsPhoto = new GridFS(db, "photo");

GridFSInputFile gfsFile = gfsPhoto.createFile(imageFile);
gfsFile.setFilename(dbFileName);
gfsFile.save();
*/