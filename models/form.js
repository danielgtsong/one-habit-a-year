var database = require('../database')
var Form = database.model('Form', {
  username: { type: String, required: true },
  category: { type: String, required: true },
  habit: { type: String, required: true },
  timesperweek: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  time: { type: Time, required: true }
})
module.exports = Form