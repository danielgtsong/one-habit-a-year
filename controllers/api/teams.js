var router = require('express').Router()
var bcrypt = require('bcrypt')
var jwt = require('jwt-simple')
var Team = require('../../models/team')
var config = require('../../config')
var errorHelper = require('mongoose-error-helper').errorHelper

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

router.post('/', function(req,res,next) {
  // console.log('[teams.js] router.post("/api/teams")');
  // console.log('[teams.js] req: ' + JSON.stringify(req.body));
  var team = new Team({
    team_name: req.body.team_name,
    year: req.body.year,
    members: req.body.members,
    group_number: req.body.group_number,
    category: req.body.category
  })
  team.save(function (err) {
    if (err) { return next(err) }
    // if (err) { return errorHelper(err, next) }
    console.log('[teams.js] team saved');
    res.sendStatus(201)
  })
})

module.exports = router
