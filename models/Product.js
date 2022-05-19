const mongoose = require('mongoose')

// Product Model
const productSchema = new mongoose.Schema({
    pokemonId: {type: Number, unique: true},
    pokemonName: String,
    productCost: Number,
    quantity: Number,
    ordersInvolved: [{type: mongoose.Schema.Types.ObjectId, ref: "Order"}]
})
module.exports = mongoose.model("Product", productSchema);