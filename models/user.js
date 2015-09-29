var db = require('../database')
var mongoose = require('mongoose')
var Habit = require('./habit')
var Week = require('./week')
var Form = require('./form')

var user = db.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  year: { type: String },
  city: { type: String  },
  state: { type: String },
  country: { type: String },
  photo: { data: Buffer, contentType: String },
  admin: { type: Boolean },
  current_habit: {type: db.Schema.Types.ObjectId, ref: 'Habit'},
  current_week: {type: db.Schema.Types.ObjectId, ref: 'Week'},
  current_form: {type: db.Schema.Types.ObjectId, ref: 'Form'},
  date: { type: Date, required: true, default: Date.now }
})

module.exports = db.model('User', user)