var db = require('../database')
var mongoose = require('mongoose')

var photo = db.Schema({
  img: { data: Buffer, contentType: String },
  date: { type: Date, required: true, default: Date.now }
})

module.exports = db.model('Photo', photo)