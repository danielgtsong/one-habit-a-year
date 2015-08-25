var database = require('../database')
var Report = database.model('Report', {
  team_name: { type: String, required: true }, 
  user_names: { type: Array, required: true }, // array of names
  photos: { type: Array, required: true }, // array of photos
  habit_completion: { type: Array, required: true },
  weekly_goals: { type: Array, required: true },
  success_rates: { type: Array, required: true },
  team_success_rate: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now }
})
module.exports = Report

// •	Team name
// •	User names
// •	User photo
// •	completion of each habit for each user on each day
// •	each individual's weekly goal
// •	each individual's success rate
// •	team success rate