var Post = require('../../models/post')
var router = require('express').Router()

router.get('/current_week', function(req,res,next) {
  console.log('router.get(/api/forms/current_week)')
  return "week1"
})

// router.post('/', function(req,res,next) {
//   console.log('router.post(/api/posts)')
//   var post = new Post({
//     username: req.body.username,
//     category: req.body.category,
//     habit: req.body.habit,
//     timesperweek: req.body.timesperweek
//   })
//   post.save(function (err,post) {
//     if (err) { return next(err) }
//     // res.json(201,post)
//     res.status(201).json(post)
//     console.log('Posted: ' + post)
//   })
// })

module.exports = router
