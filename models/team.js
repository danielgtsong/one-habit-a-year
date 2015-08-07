var db = require('../database')
var team = db.Schema({
  team_name: { type: String, required: true },
  year: { type: String, required: true },
  members: { type: Array, required: true },
  group_number: { type: String, required: true },
  category: { type: String, required: true }
})
module.exports = db.model('Team', team)