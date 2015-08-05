var db = require('../database')
var user = db.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  year: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true }
})
module.exports = db.model('User', user)


// User's enter name, email, password, phone number, GLDI class, city, state, country, photo.