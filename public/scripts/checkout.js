const orderId = document.querySelector("#orderID").innerHTML.trim();

function updateCartDisplay(data) {
    let cart = document.querySelector("#shopcart")
    cart.innerHTML = ``
    let newHtml = ``
    console.log(data.totalCost)

    if (data.noActiveOrders || data.cartSize <= 0) {
        newHtml += `<h2 id="none">Shopping Cart is empty!</h2>`
    } else {
        newHtml += `<h2>You have <b>
                        ${data.cartSize}
                    </b> different pokemon in your shopping cart!</h2>

                <div id="orderID" style="display: none">
                    ${data.orderId}
                </div>

                <table id="products">
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Pokemon</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>`

        data.products.forEach(item => {
            newHtml += `<tr class="single-product" id="${item._id}">
                <td class="deleteItem">
                    <span class="material-symbols-outlined">
                        delete
                    </span>
                </td>
                <td class="prod-pokeId">
                    #${item.id}
                </td>
                <td class="prod-name">
                    ${item.name[0].toUpperCase() + item.name.substring(1)}
                </td>
                <td class="prod-singlecost">
                    ${(item.cost).toLocaleString('en-GB', { style: 'currency', currency: 'CAD' })}
                </td>
                <td class="prod-quantity">
                    <button class="quantity-control minus">-</button>
                    <span class="quantity">
                        ${item.quantity} 
                    </span>
                    <button class="quantity-control add">+</button>
                </td>
                <td class="prod-singlecostsubtotal">
                    ${(item.cost * item.quantity).toLocaleString('en-GB', {
                style: 'currency',
                currency: 'CAD'
            })}
                </td>
            </tr>`
        })

        newHtml += `<tr class="bottomline">
                                <td class="label" colspan="5">Subtotal Cost</td>
                                <td>
                                    ${data.productsCost.toLocaleString('en-GB', { style: 'currency', currency: 'CAD' })}
                                </td>
                            </tr>
                            <tr class="bottomline">
                                <td class="label" colspan="5">
                                    ${data.taxCost * 100}% Sales Tax
                                </td>
                                <td>
                                    ${(data.taxCost * data.productsCost).toLocaleString('en-GB', {
            style: 'currency',
            currency: 'CAD'
        })}
                                </td>
                            </tr>
                            <tr class="bottomline finaltally">
                                <td class="label" colspan="5">Total</td>
                                <td>
                                    ${data.totalCost.toLocaleString('en-GB', { style: 'currency', currency: 'CAD' })}
                                </td>
                            </tr>
                </table>
                <div id="submit-controls">
                    <button class="submit">Checkout</button>
                    <button class="deleteAllItems">Empty Cart</button>
                </div>`
    }
    cart.innerHTML = newHtml
    setup()
}

function reloadCart() {
    $.ajax({
        url: `/checkout/getOrder`,
        type: `get`,
        success: (resp) => {
            console.log("/GETORDER SUCCESS", resp)
            updateCartDisplay(resp)
        }
    })
}

function deleteAllItems() {

}

function deleteItem(row) {
    console.log(row)
    let productSubtotal = -Number(row.querySelector(".prod-singlecostsubtotal").innerHTML.trim().replace(/[^0-9.-]+/g, ""))

    $.ajax({
        url: "/checkout/deleteItem",
        method: "POST",
        data: {
            _orderId: orderId,
            _productId: row.id,
            productCostSubtotal: productSubtotal,
        },
    }).done(() => {
        console.log("UIASOJMDIJSANKSA")
        reloadCart()
    })
}

function incrementQuantity(row, decrement) {
    console.log("CLICKED!")
    if (decrement && Number(row.querySelector(".quantity").innerHTML.trim()) <= 1) {
        return
    }

    let incrementQuantity = 1
    let incrementCost = Number(row.querySelector(".prod-singlecost").innerHTML.trim().replace(/[^0-9.-]+/g, ""))

    if (decrement) {
        incrementQuantity *= -1
        incrementCost *= -1
    }

    console.log(row, incrementQuantity, incrementCost, row.id, orderId)

    $.ajax({
        url: "/checkout/incrementQuantity",
        method: "POST",
        data: {
            _orderId: orderId,
            _productId: row.id,
            incrementVal: incrementQuantity,
            productCost: incrementCost,
        }
    }).done(() => {
        reloadCart()
    })
}

function checkout() {

}

function setup() {
    document.querySelectorAll(".single-product").forEach(prod => {
        prod.querySelector(".deleteItem").addEventListener("click", () => deleteItem(prod))
        prod.querySelector(".add").addEventListener("click", () => incrementQuantity(prod))
        prod.querySelector(".minus").addEventListener("click", () => incrementQuantity(prod, true))
    })
}

document.addEventListener("DOMContentLoaded", setup)