var router = require('express').Router()
var bcrypt = require('bcrypt')
var jwt = require('jwt-simple')
var User = require('../models/user')
var config = require('../config')

router.get('/', function(req,res,next) {
  console.log('router.get(/admin)')
  User.find()
  .sort('-date')
  .exec(function(err,users) {
    if(err) { return next(err) }
    res.json(users)
  })
})

 // users.js
// router.get('/', function(req,res,next) {
//   if (!req.headers['x-auth']) {
//     return res.sendStatus(401)
//   }
//   var auth = jwt.decode(req.headers['x-auth'], config.secret)
//   User.findOne({username: auth.username}, function(err, user) {
//     if (err) { return next(err) }
//     res.json(user)
//   })
// })

module.exports = router
