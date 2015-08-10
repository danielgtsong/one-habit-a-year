var express = require('express')
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

app.use(require('./controllers/static')) // equivalent to: app.use('/', require('./controllers/static'))

app.use('/api/posts', require('./controllers/api/posts')) // contains endpoints get,post(/api/posts)

app.use('/api/sessions', require('./controllers/api/sessions'))
// app.use(require('./controllers/api/sessions'))
app.use('/api/users', require('./controllers/api/users'))
// app.use(require('./controllers/api/users'))

app.use(require('./auth'))

app.use('/api/admin', require('./controllers/api/admin')) // contains endpoints get,post(/api/posts)

app.use('/api/teams', require('./controllers/api/teams'))
app.use('/api/forms', require('./controllers/api/forms'))
app.use('/api/habits', require('./controllers/api/habits'))

// == modulearized to controllers/static.js ==
// app.get('/', function(req, res) {
//  // res.sendfile('layouts/posts.html')
//  res.sendFile(path.join(__dirname, 'layouts', 'posts.html'));
// })
// =================================================

// == modularized out to controllers/api/posts.js ==
// app.get('/api/posts', function(req, res) {
//  Post.find(function(err, posts) {
  //  if (err) { return next(err) }
   // res.json(posts)
 // }
//})

//app.post('/api/posts', function(req,res) {
//  var post = new Post({
//    username: req.body.username,
//    body: req.body.body
//  })
//  post.save(function (err, post) {
//    if (err) { return next(err) }
////    res.json(201, post)
//    var status = 201
//    res.status(status).json(post)
//  })
//})
// =================================================

app.listen(3000, function() {
  console.log('Server listening on 3000')
})
