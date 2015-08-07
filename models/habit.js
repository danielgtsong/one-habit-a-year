var User = require('./user')
var mongoose = require('mongoose')
var database = require('../database')
var Habit = database.model('Habit', {
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
  category: { type: String, required: true },
  description: { type: String, required: true },
  timesperweek: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now }
})
module.exports = Habit
