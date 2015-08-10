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
  current_habit: {type: db.Schema.Types.ObjectId, ref: 'Habit'}
}, { strict: false })
user.methods.setCurrentHabit = function (habit) {
  // var greeting = this.name ? "Meow name is " + this.name : "I don't have a name";
  // console.log(greeting);
  this.current_habit = habit
  console.log('user.js current_habit is ' + this.current_habit)
}
user.virtual('setHabit').set(function (habit) {
  // var split = name.split(' ');
  // this.name.first = split[0];
  // this.name.last = split[1];
  this.current_habit = habit
  console.log('user.js current_habit is ' + this.current_habit)
})
user.set('toObject', { getters: true });
module.exports = db.model('User', user)


// User's enter name, email, password, phone number, GLDI class, city, state, country, photo.