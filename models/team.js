var db = require('../database')
var team = db.Schema({
  year: { type: String, required: true },
  users: { type: Array, required: true },
  group_number: { type: String, required: true },
  category: { type: String, required: true }
})
module.exports = db.model('Team', team)