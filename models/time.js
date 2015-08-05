var database = require('../database')
var Time = database.model('Time', {
  day: { type: String, required: true },
  week: { type: String, required: true },
  year: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now }
})
module.exports = Time