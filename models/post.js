var database = require('../database')
var Post = database.model('Post', {
  username: { type: String, required: true },
  category: { type: String, required: true },
  habit: { type: String, required: true },
  timesperweek: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now }
})
module.exports = Post
