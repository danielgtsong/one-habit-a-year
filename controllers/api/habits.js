var Habit = require('../../models/habit')
var router = require('express').Router()

router.get('/', function(req,res,next) {
  console.log('router.get(/api/habits)')
  Habit.find()
  .sort('-date')
  .exec(function(err,habits) {
    if(err) { return next(err) }
    res.json(habits)
  })
})

// The system will start with four categories of habits: Physical, Spiritual, Intellectual or other.

router.post('/', function(req,res,next) {
  console.log('router.post(/api/habits)')
  var habit = new Habit({
    user: req.body.user,
    category: req.body.category,
    description: req.body.description,
    timesperweek: req.body.timesperweek
  })
  habit.save(function (err,habit) {
    if (err) { return next(err) }
    res.status(201).json(habit)
    console.log('New Habit: ' + habit)
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
