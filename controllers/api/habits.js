var Post = require('../../models/post')
var router = require('express').Router()

// router.get('/api/posts', function(req,res,next) {
router.get('/', function(req,res,next) {
  console.log('router.get(/api/posts)')
  Post.find()
  .sort('-date')
  .exec(function(err,posts) {
    if(err) { return next(err) }
    res.json(posts)
  })
})

// The system will start with four categories of habits: Physical, Spiritual, Intellectual or other.

// router.post('/api/posts', function(req,res,next) {
router.post('/', function(req,res,next) {
  console.log('router.post(/api/posts)')
  var post = new Post({
    username: req.body.username,
    category: req.body.category,
    habit: req.body.habit,
    timesperweek: req.body.timesperweek
  })
  post.save(function (err,post) {
    if (err) { return next(err) }
    // res.json(201,post)
    res.status(201).json(post)
    console.log('Posted: ' + post)
  })
})

// router.post('/', function(req,res,next) {
//   var post = new Post({body: req.body.body})
//   post.username = req.auth.username
//   post.save(function (err, post) {
//     if (err) { return next(err) }
//     res.json(201, post)
//   })
// })

module.exports = router
