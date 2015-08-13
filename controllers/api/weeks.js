var Week = require('../../models/week')
var router = require('express').Router()

// router.get('/', function(req,res,next) {
//   console.log('router.get(/api/weeks)')
//   Week.find()
//   .sort('-date')
//   .exec(function(err,weeks) {
//     if(err) { return next(err) }
//     res.json(weeks)
//   })
// })

router.post('/', function(req,res,next) {
  console.log('router.post(/api/weeks)', req.body)
  var week = new Week({
    checks: req.body.checks, // array of check objects
    currentdate: req.body.currentdate,
    dayofyear: req.body.dayofyear,
    dayofweek: req.body.dayofweek,
    weekofyear: req.body.weekofyear,
    weeksinyear: req.body.weeksinyear,
    year: req.body.year
  })
  week.save(function (err,week) {
    if (err) { return next(err) }
    res.status(201).json(week)
    console.log('New Week: ' + week)
  })
})

router.post('/findOne', function(req,res,next) {
  // console.log('router.get(/api/weeks/findOne)')
  var week_id = req.body.week_id
  Week.findOne({ _id: week_id }, function(err, week) {
    if (err) { return next(err)}
    res.json(week)
  });
})

module.exports = router