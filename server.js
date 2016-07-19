var express = require('express')
var app = express()
var fileUpload = require('express-fileupload');
app.use(fileUpload()); // default options

var database = require('./database')
var connection = database.connection;

connection.once('open', function () {
    console.log('open connection');
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
