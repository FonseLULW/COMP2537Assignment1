const mongoose = require('mongoose')

// Order Model
const orderSchema = new mongoose.Schema({
    orderedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    products: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
    shippingCost: Number,
    productsCost: Number,
    taxCost: Number,
    totalCost: Number,
    estimatedArrivalDate: Date, 
    shippedFrom: String,
    orderStatus: String // could be unconfirmed, delivering, complete, cancelled
})
module.exports = mongoose.model("Order", orderSchema);