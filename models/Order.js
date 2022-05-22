const mongoose = require('mongoose')

// Order Model
const orderSchema = new mongoose.Schema({
    orderedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    products: [
        {
            id: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
            quantity: {type: Number, default: 1}
        }
    ],
    productsCost: {type: Number, default: 0},
    taxCost: {type: Number, default: 0.05},
    totalCost: {type: Number, default: 0},
    orderStatus: {type: String, default: "unconfirmed"} // could be unconfirmed, delivering, complete, cancelled
})
module.exports = mongoose.model("Order", orderSchema);