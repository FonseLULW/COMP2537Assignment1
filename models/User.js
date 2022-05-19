const mongoose = require('mongoose')

// User Model
const userSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    username: {type: String, unique: true},
    password: String
})

module.exports = mongoose.model("User", userSchema)