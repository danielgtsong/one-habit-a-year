var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/onehabitayear', function() {
    console.log('the mongoose database is working!')
    // console.log('mongoose.mongo: ', mongoose.mongo);
})
module.exports = mongoose
