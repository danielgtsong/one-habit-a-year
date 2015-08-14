var bcrypt = require('bcrypt')
var jwt = require('jwt-simple')
var User = require('../../models/user')
var config = require('../../config')

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

router.post('/user_habits', function(req,res,next) {
  console.log('router.get(/api/habits/user_habits)')
  var user = req.body.user
  Habit.find({ user: user._id })
  .sort('-date')
  .exec(function(err,habits) {
    if(err) { return next(err) }
    res.json(habits)
  })
})

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

// ******************************************************

router.post('/findOne', function(req,res,next) {
  var habit_id = req.body._id;
  Habit.findOne({_id: habit_id}, function(err, habit) {
    if (err) { return next(err) }
    res.json(habit)
    // return habit
  })
})

// ******************************************************

module.exports = router
