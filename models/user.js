var db = require('../database')
var mongoose = require('mongoose')
var Habit = require('./habit')
var Week = require('./week')
var Form = require('./form')
var user = db.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  year: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  current_habit: {type: db.Schema.Types.ObjectId, ref: 'Habit'},
  current_week: {type: db.Schema.Types.ObjectId, ref: 'Week'},
  current_form: {type: db.Schema.Types.ObjectId, ref: 'Form'},
  admin: { type: Boolean },
  date: { type: Date, required: true, default: Date.now }
})

module.exports = db.model('User', user)