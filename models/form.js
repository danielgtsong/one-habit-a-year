var database = require('../database')
var User = require('./user')
var Week = require('./week')
var Habit = require('./habit')

var Form = database.model('Form', {
  user: { type: User, required: true },
  category: { type: String, required: true },
  habit: { type: String, required: true },
  timesperweek: { type: String, required: true },
  week: { type: Week, required: true },
  date: { type: Date, required: true, default: Date.now }
})
module.exports = Form