var express = require('express')
var app = express()

// var bodyParser = require('body-parser')
// app.use(bodyParser.json())
// var busboyBodyParser = require('busboy-body-parser')
// app.use(busboyBodyParser())

// var bb = require('express-busboy');
// bb.extend(app, {
//     upload: true,
//     path: 'http://localhost:3000/api/photos/upload'
// });

var fileUpload = require('express-fileupload');
app.use(fileUpload()); // default options

var database = require('./database')
var connection = database.connection;

// var fs = require('fs');
// var Grid = require('gridfs-stream');
// Grid.mongo = database.mongo;

// var busboy = require('connect-busboy');

// // default options, immediately start reading from the request stream and parsing 
// app.use(busboy({ immediate: true }));

// app.use(function(req, res) {
//   req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
//     // ... 
//   });
//   req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
//     // ... 
//   });
//   // etc ... 
//   req.pipe(req.busboy);
// });

connection.once('open', function () {
    console.log('open connection');
    // console.log('database.mongo: ', database.mongo);
    
    // console.log('database: ', database);
    // console.log('connection: ', connection);
    // console.log('connection.db: ', connection.db);
    // var gfs = Grid(connection.db);
 
    // streaming to gridfs
    // filename to store in mongodb
    // var writestream = gfs.createWriteStream({
    //     filename: 'mongo_file.txt'
    // });
    // fs.createReadStream('./extra/commands.txt').pipe(writestream);
 
    // writestream.on('close', function (file) {
    //     // do something with `file`
    //     console.log(file.filename + ' Written To DB');
    //     console.log(file);
    // });

    //write content to file system
	// var fs_write_stream = fs.createWriteStream('write.txt');
	 
	// //read from mongodb
	// var readstream = gfs.createReadStream({
	//      filename: 'mongo_file.txt'
	// });
	// readstream.pipe(fs_write_stream);
	// fs_write_stream.on('close', function () {
	//      console.log('file has been written fully!');
	// });
});

//======================================================================

app.use(require('./controllers/static')) 
app.use('/api/habits', require('./controllers/api/habits'))
app.use('/api/sessions', require('./controllers/api/sessions'))
app.use('/api/users', require('./controllers/api/users'))
app.use(require('./auth'))
app.use('/api/admin', require('./controllers/api/admin')) 
app.use('/api/teams', require('./controllers/api/teams'))
app.use('/api/forms', require('./controllers/api/forms'))
app.use('/api/habits', require('./controllers/api/habits'))
app.use('/api/weeks', require('./controllers/api/weeks'))
app.use('/api/reports', require('./controllers/api/reports'))
app.use('/api/photos', require('./controllers/api/photos'))

var port = process.env.PORT || 3000; // used to create, sign and verify tokens
app.listen(port, function() {
  console.log('Server listening on 3000')
})
