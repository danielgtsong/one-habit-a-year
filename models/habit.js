var User = require('./user')
var mongoose = require('mongoose')
var database = require('../database')
var Habit = database.model('Habit', {
  user: {type: database.Schema.Types.ObjectId, ref: 'User'},
  category: { type: String, required: true },
  description: { type: String, required: true },
  timesperweek: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now }
})
module.exports = Habit
