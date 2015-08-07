var router = require('express').Router()
var bcrypt = require('bcrypt')
var jwt = require('jwt-simple')
var User = require('../../models/user')
var Team = require('../../models/team')
var config = require('../../config')

router.get('/', function(req,res,next) {
  console.log('router.get(/admin)')
  User.find()
  .sort('-date')
  .exec(function(err,users) {
    if(err) { return next(err) }
    res.json(users)
  })
})

router.get('/teams', function(req,res,next) {
  console.log('router.get(/admin/teams)')
  Team.find()
  .sort('-date')
  .exec(function(err,teams) {
    if(err) { return next(err) }
    res.json(teams)
  })
})



module.exports = router
