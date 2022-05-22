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
        $inc: {"products.$.quantity": 1, productsCost: req.body.productCost},
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
            console.log("COSTS: ", resp)
            let total = resp.productsCost + (resp.productsCost * resp.taxCost)
            console.log("TOTAL: ", total)
            Order.findByIdAndUpdate(req.body._orderId, {totalCost: total}, (err, resp) => {
                if (err) {
                    res.send(err)
                } else {
                    console.log("UPDATED")
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
        } else {
            req.currentOrder = resp
            next()
        }
    })
}

const getProductsFromCurrentOrder = (req, res, next) => {
    let productsInvolved = req.currentOrder.products.map(prod => prod.id)
    console.log("PRODS INVOLVED: ", productsInvolved)
    Product.find({_id: {$in: productsInvolved}}, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            console.log("PRODUCTS: ", resp)
            req.products = req.currentOrder.products.map((prod, i) => {
                return {
                    name: resp[i].pokemonName,
                    id: resp[i].pokemonId,
                    cost: resp[i].productCost,
                    quantity: prod.quantity
                }
            })
            console.log("MODIFIED: ", req.products)
            next()
        }
    })
}

module.exports = { getProductsFromCurrentOrder, getCurrentOrder, createProductIfNotExists, createOrderIfNotExists, incrementQuantityInOrderIfExists, pushToOrder, updateOrderCost }