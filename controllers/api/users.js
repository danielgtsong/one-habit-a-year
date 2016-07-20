var router = require('express').Router()
var bcrypt = require('bcrypt')
var jwt = require('jwt-simple')
var jwt_persist = require('jsonwebtoken'); // used to create, sign and verify tokens
var User = require('../../models/user')
var config = require('../../config')
var fs = require('fs');

router.post('/', function(req,res,next) {
  var user = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone, 
    year: req.body.year,
    city: req.body.city, 
    state: req.body.state, 
    country: req.body.country
  })
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) { return next(err)}
    user.password = hash
    user.save(function (err) {
      if (err) { return next(err) }
      res.status(201).json(user);
    })
  })
})

router.post('/profile_photo', function(req,res,next) {
  var user = req.body.user
  var photo = req.body.profile_photo
  User.findOne({ _id: user._id }, function(err, found_user) {
    if (err) { return next(err)}
    found_user.profile_photo = photo;
    found_user.save(function (err) {
      if (err) { return next(err) }
      res.sendStatus(201)
    })
  });
})

router.post('/setweek', function(req,res,next) {
  var user = req.body.user
  var current_week = req.body.current_week
  User.findOne({ _id: user._id }, function(err, found_user) {
    if (err) { return next(err)}
    found_user.current_week = current_week;
    found_user.save(function (err) {
      if (err) { return next(err) }
      res.json(current_week)
    })
  });
})

router.post('/setform', function(req,res,next) {
  var user = req.body.user
  var current_form = req.body.current_form
  // console.log('/setform, user', user)
  // console.log('/setform, current_form' current_form)
  User.findOne({ _id: user._id }, function(err, found_user) {
    if (err) { return next(err)}
    found_user.current_form = current_form;
    found_user.save(function (err) {
      if (err) { return next(err) }
      res.sendStatus(201)
    })
  });
})

router.post('/sethabit', function(req,res,next) {
  var user = req.body.user
  var current_habit = req.body.current_habit
  User.findOne({ _id: user._id }, function(err, found_user) {
    if (err) { return next(err)}
    found_user.current_habit = current_habit;
    found_user.save(function (err) {
      if (err) { return next(err) }
      res.sendStatus(201)
    })
  });
})

router.get('/', function(req,res,next) {
  if (!req.headers['x-auth']) {
    console.log('Users, GET, ERROR')
    return res.sendStatus(401)
  }
  var auth = jwt.decode(req.headers['x-auth'], config.secret)
  User.findOne({username: auth.username}, function(err, user) {
    if (err) { return next(err) }
    res.json(user)
  })
})

module.exports = router
