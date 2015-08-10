var Week = require('../../models/week')
var router = require('express').Router()

var GregorianCalendar = require('gregorian-calendar')
var date = new GregorianCalendar(require('gregorian-calendar/lib/locale/en-us'))
date.setTime(+new Date())

router.get('/current_week', function(req,res,next) {
  console.log('router.get(/api/forms/current_week)')

  // console.log('forms.js - currentdate: ', date.getMonth()+'/'+date.getDayOfMonth()+'/'+date.getYear());
  // console.log('forms.js - dayofyear: ', date.getDayOfYear() )
  // console.log('forms.js - dayofweek: ' + date.getDayOfWeek() );
  // console.log('forms.js - weekofyear: ' + date.getWeekOfYear() );
  // console.log('forms.js - weeksinyear: ' + date.getWeeksInWeekYear() )

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
  return week
})

// router.post('/', function(req,res,next) {
//   console.log('router.post(/api/posts)')
//   var post = new Post({
//     username: req.body.username,
//     category: req.body.category,
//     habit: req.body.habit,
//     timesperweek: req.body.timesperweek
//   })
//   post.save(function (err,post) {
//     if (err) { return next(err) }
//     // res.json(201,post)
//     res.status(201).json(post)
//     console.log('Posted: ' + post)
//   })
// })

module.exports = router
