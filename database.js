var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/onehabitayear', function() {
    console.log('the mongoose database is working!')
})
module.exports = mongoose
