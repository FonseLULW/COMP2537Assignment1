const mongoose = require('mongoose')

// User Model
const userSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    username: {type: String, unique: true},
    password: String,
    admin: {type: Boolean, default: false}
})

module.exports = mongoose.model("User", userSchema);