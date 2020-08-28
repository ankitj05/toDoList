const mongoose = require('mongoose')

const User = mongoose.Schema({
    firstName: String,
    lastName: String,
    emailId: String,
    password: String
},
    { timeStamps: true })


module.exports = mongoose.model('User', User);

