const User = require('../models/User')
const Event = require('../models/Event')
const Product = require('../models/Product')
const Order = require('../models/Order')

const createProductIfNotExists = (req, res, next) => {
    const { pokemonId, pokemonName, productCost } = req.body
    Product.findOne({ pokemonId: pokemonId }, (err, found) => {
        console.log(found)
        if (err) {
            res.send(err)
        } else if (found) {
            console.log("PROD FOUND")
            req.body._productId = found._id
            next()
        } else {
            Product.create({
                pokemonId: Number(pokemonId),
                pokemonName: pokemonName,
                productCost: Number(productCost)
            }, (err, resp) => {
                if (err) {
                    res.send(err)
                } else {
                    req.body._productId = resp._id
                    console.log("PROD CREATED")
                    next()
                }
            })
        }
    })  
}

const createOrderIfNotExists = (req, res, next) => {
    Order.findOne({orderedBy: req.session.uid, orderStatus: "unconfirmed"}, (err, found) => {
        if (err) {
            res.send(err)
        } else if (found) {
            req.body._orderId = found._id
            console.log("ORDER EXISTS")
            next()
        } else {
            Order.create({
                orderedBy: req.session.uid,
            }, (err, resp) => {
                if (err) {
                    res.send(err)
                } else {
                    req.body._orderId = resp._id
                    console.log("ORDER CREATED")
                    next()
                }
            })
        }
    })
}

const incrementQuantityInOrderIfExists = (req, res, next) => {
    Order.findOneAndUpdate({
        orderedBy: req.session.uid,
        "products.id": req.body._productId
    }, {
        $inc: {"products.$.quantity": req.body.incrementVal, productsCost: req.body.productCost},
    }, (err, resp) => {
        console.log("INC: ", resp)
        if (err) {
            res.send(err)
        } else if (resp) {
            req.body.skipPush = true
        }
        next()
    })
}

const pushToOrder = (req, res, next) => {
    if (req.body.skipPush) {
        next()
    } else {
        Order.findByIdAndUpdate(req.body._orderId, {
            $inc: {productsCost: req.body.productCost},
            $addToSet: {products: {id: req.body._productId}
        }
        }, (err, resp) => {
            console.log("PUSHED: ", resp)
            next()
        })
    }
}

const updateOrderCost = (req, res, next) => {
    Order.findById(req.body._orderId, "taxCost productsCost", (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            let total = resp.productsCost + (resp.productsCost * resp.taxCost)
            Order.findByIdAndUpdate(req.body._orderId, {totalCost: total}, (err, resp) => {
                if (err) {
                    console.log(err.message)
                    res.send(err)
                } else {
                    console.log("RESP ROC: ", resp)
                    next()
                }
            })
        }
    })
}

const getCurrentOrder = (req, res, next) => {
    Order.findOne({orderedBy: req.session.uid, orderStatus: "unconfirmed"}, (err, resp) => {
        if (err) {
            res.send(err)
        } else if (resp) {
            req.currentOrder = resp
            console.log(resp.totalCost)
            next()
        } else {
            res.render("checkout", {
                noActiveOrders: true 
            })
        }
    })
}

const getProductsFromCurrentOrder = (req, res, next) => {
    let productsInvolved = req.currentOrder.products.map(prod => prod.id)
    Product.find({_id: {$in: productsInvolved}}, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            let sortedResp = resp.sort((a, b) => {
                return a._id.toString().localeCompare(b._id.toString())
            })
            console.log("SORTED RES: ", sortedResp)
            
            let sortedReq = req.currentOrder.products.sort((a, b) => {
                return a.id.toString().localeCompare(b.id.toString())
            })
            console.log("REQ SORTED: ", sortedReq)

            req.products = sortedReq.map((prod, i) => {
                console.log("Product " + i + ": ", prod)
                return {
                    _id: sortedResp[i]._id,
                    name: sortedResp[i].pokemonName,
                    id: sortedResp[i].pokemonId,
                    cost: sortedResp[i].productCost,
                    quantity: prod.quantity
                }
            })
            next()
        }
    })
}

const removeProductFromOrder = (req, res, next) => {
    const {_orderId, _productId, productCostSubtotal} = req.body
    Order.findByIdAndUpdate(_orderId, {
        $pull: {products: {id: _productId}},
        $inc: {productsCost: productCostSubtotal}
    }, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            next()
        }
    })
}

const deleteAllProductsFromOrder = (req, res, next) => {
    const {_orderId} = req.params
    Order.findByIdAndUpdate(_orderId, {
        $set: {products: [], productsCost: 0, totalCost: 0}
    }, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            next()
        }
    })
}

module.exports = { deleteAllProductsFromOrder, removeProductFromOrder, getProductsFromCurrentOrder, getCurrentOrder, createProductIfNotExists, createOrderIfNotExists, incrementQuantityInOrderIfExists, pushToOrder, updateOrderCost }