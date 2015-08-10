var database = require('../database')
var User = require('./user')
var Week = require('./week')
var Habit = require('./habit')

var Form = database.model('Form', {
  user: {type: database.Schema.Types.ObjectId, ref: 'User'},
  category: { type: String, required: true },
  habit: {type: database.Schema.Types.ObjectId, ref: 'Habit'},
  timesperweek: { type: String, required: true },
  week: {type: database.Schema.Types.ObjectId, ref: 'Week'},
  date: { type: Date, required: true, default: Date.now }
})
module.exports = Form