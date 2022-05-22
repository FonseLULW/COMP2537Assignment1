const mongoose = require('mongoose')

// Product Model
const productSchema = new mongoose.Schema({
    pokemonId: {type: Number, unique: true},
    pokemonName: String,
    productCost: Number
})
module.exports = mongoose.model("Product", productSchema);