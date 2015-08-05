var db = require('../database')
var admin = db.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }
})
module.exports = db.model('Admin', admin)
