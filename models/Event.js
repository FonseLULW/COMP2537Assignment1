const mongoose = require('mongoose')

// Event Model
const eventSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String,
    doneBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    date: String
})
module.exports = mongoose.model("Event", eventSchema);