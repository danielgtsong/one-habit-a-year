var database = require('../database')
var Week = database.model('Week', {
  checks: { type: Array, required: true }, // array of check objects
  currentdate: { type: String, required: true },
  dayofyear: { type: Number, required: true },
  dayofweek: { type: Number, required: true },
  weekofyear: { type: Number, required: true },
  weeksinyear: { type: Number, required: true },
  year: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now }
})
module.exports = Week