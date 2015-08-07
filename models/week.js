var database = require('../database')
var Week = database.model('Week', {
  checks: { type: Array, required: true }, // array of check objects
  week: { type: Array, required: true }, // array of strings
  current_day: { type: String, required: true, default: Date.getDay() }, // 0 - 6
  year: { type: String, required: true, default: Date.getFullYear() },
  date: { type: Date, required: true, default: Date.now }
})
module.exports = Week