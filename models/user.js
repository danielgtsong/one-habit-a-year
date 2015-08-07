var db = require('../database')
var mongoose = require('mongoose')
var Habit = require('./habit')
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
  current_habit: {type: mongoose.Schema.Types.ObjectId, ref: 'Habit', default: null}
})
module.exports = db.model('User', user)


// User's enter name, email, password, phone number, GLDI class, city, state, country, photo.