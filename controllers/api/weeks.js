var Week = require('../../models/week')
var router = require('express').Router()

router.post('/update', function(req,res,next) {
  console.log('router.post(/api/weeks/update)')
  var week = req.body.week
  Week.findOne({ _id: week._id }, function(err, found_week) {
    if (err) { return next(err)}
    found_week.checks = week.checks;
    found_week.save(function (err) {
      if (err) { return next(err) }
      res.json(found_week)
    })
  });
})

router.post('/', function(req,res,next) {
  console.log('router.post(/api/weeks) req_body: ', req.body.current_week)
  var current_week = req.body.current_week;
  var week = new Week({
    checks: current_week.checks, // array of check objects
    currentdate: current_week.currentdate,
    dayofyear: current_week.dayofyear,
    dayofweek: current_week.dayofweek,
    weekofyear: current_week.weekofyear,
    weeksinyear: current_week.weeksinyear,
    year: current_week.year
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