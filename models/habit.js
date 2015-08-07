var database = require('../database')
var Habit = database.model('Habit', {
  user: { type: User, required: true, default: null },
  category: { type: String, required: true },
  current_habit: { type: String, required: true },
  timesperweek: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now }
})
module.exports = Habit
