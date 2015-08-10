var router = require('express').Router()
var bcrypt = require('bcrypt')
var jwt = require('jwt-simple')
var User = require('../../models/user')
var config = require('../../config')

router.get('/', function(req,res,next) {
  if (!req.headers['x-auth']) {
    return res.sendStatus(401)
  }
  var auth = jwt.decode(req.headers['x-auth'], config.secret)
  User.findOne({username: auth.username}, function(err, user) {
    if (err) { return next(err) }
    res.json(user)
  })
})

router.post('/', function(req,res,next) {
  var user = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone, year: req.body.year,
    city: req.body.city, state: req.body.state, 
    country: req.body.country
  })
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) { return next(err)}
    user.password = hash
    user.save(function (err) {
      if (err) { return next(err) }
      res.sendStatus(201)
    })
  })
})

router.post('/sethabit', function(req,res,next) {
  var user = req.body.user
  var current_habit = req.body.current_habit
  // console.log('\nuser: ' + JSON.stringify(user))
  // console.log('\ncurrent habit: ' + JSON.stringify(current_habit))
  // User.update(
  //   { _id: user._id },
  //   { $set: { current_habit: current_habit } }
  // )
  User.findOne({ _id: user._id }, function(err, found_user) {
    if (err) { return next(err)}
    // console.log('\nfound_user: ' + found_user);
    found_user.current_habit = current_habit;
    // console.log('\nfound_user.current_habit: ' + found_user.current_habit);
    found_user.save(function (err) {
      if (err) { return next(err) }
      res.sendStatus(201)
    })
    // console.log('\nafter saving, found_user: ' + found_user);
  });
  // console.log('\nusers.js habit is set')
})

module.exports = router
