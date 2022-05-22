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
        } else if (resp) {
            req.currentOrder = resp
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

            req.products = req.currentOrder.products.sort((a, b) => {
                return a.id.toString() - b.id.toString()
            }).map((prod, i) => {
                console.log("Product " + i + ": ", prod)
                return {
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

module.exports = { getProductsFromCurrentOrder, getCurrentOrder, createProductIfNotExists, createOrderIfNotExists, incrementQuantityInOrderIfExists, pushToOrder, updateOrderCost }