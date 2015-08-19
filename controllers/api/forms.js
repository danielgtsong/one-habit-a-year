var Week = require('../../models/week')
var Form = require('../../models/form')
var router = require('express').Router()

var GregorianCalendar = require('gregorian-calendar')
var date = new GregorianCalendar(require('gregorian-calendar/lib/locale/en-us'))
date.setTime(+new Date())

router.post('/findOne', function(req,res,next) {
  console.log('router.post(/api/forms/findOne)')
  var form_id = req.body.form_id
  Form.findOne({ _id: form_id }, function(err, form) {
    if (err) { return next(err)}
    res.json(form)
  });
})

router.get('/current_week', function(req,res,next) {
  console.log('router.get(/api/forms/current_week)')

  var week = new Week({
  	checks: [
  		{ day: 'sunday', complete: false },
  		{ day: 'monday', complete: false },
  		{ day: 'tuesday', complete: false },
  		{ day: 'wednesday', complete: false },
  		{ day: 'thursday', complete: false },
  		{ day: 'friday', complete: false },
  		{ day: 'saturday', complete: false }
  	],
  	currentdate: date.getMonth()+'/'+date.getDayOfMonth()+'/'+date.getYear(),
  	dayofyear: date.getDayOfYear(),
  	dayofweek: date.getDayOfWeek(),
  	weekofyear: date.getWeekOfYear(),
  	weeksinyear: date.getWeeksInWeekYear(),
  	year: date.getYear()
  })
  // console.log('forms.js - week: ', week)
  res.json(week)
})

router.post('/', function(req,res,next) {
  console.log('router.post(/api/forms)')
  
  var current_week_of_user = req.body.week
  console.log('router.post(/api/forms) current_week_of_user: ', current_week_of_user)
  var form = new Form({
    user: req.body.user,
    category: req.body.category,
    habit: req.body.habit,
    timesperweek: req.body.timesperweek,
    week: current_week_of_user
  })
  form.save(function (err,form) {
    if (err) { return next(err) }
    var response = {
      form: form,
      current_week_of_user: current_week_of_user
    }
    res.json(response)
    console.log('New Form: ' + form)
  })
})

module.exports = router
