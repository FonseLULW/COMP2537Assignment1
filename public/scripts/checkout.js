const orderId = document.querySelector("#orderID").innerHTML.trim();

function updateCartDisplay(data) {
    let cart = document.querySelector("#shopcart")
    cart.innerHTML = ``
    
    // data.forEach((ev) => {
    //     let singleEvent = document.createElement("DIV")
    //     singleEvent.id = ev._id
    //     singleEvent.classList.add("single-event")

    //     singleEvent.innerHTML = `
    //         <div class="event-data">
    //                 <div class="datetime">
    //                     <span class="date">${ev.date}</span>
    //                     <span class="time">${ev.time}</span>
    //                 </div>
    //             <div class="text">Event: <span>${ev.text}</span></div>
    //             <div class="hits">Likes: <span>${ev.hits}</span></div>
    //         </div>
    //         <div class="event-controls">
    //             <button class="like">Like</button>
    //             <button class="delete">Delete</button>
    //         </div>`
    //     timeline.appendChild(singleEvent)
    //     initSingleEvent(singleEvent)
    // })
}

function reloadCart() {
    $.ajax({
        url: `/events/readAllEvents`,
        type: `get`,
        success: (resp) => {
            updateCartDisplay(resp)
        }
    })
}

function deleteAllItems() {

}

function deleteItem(row) {
    console.log(row)
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
        method: "PUT",
        data: {
            _orderId: orderId,
            _productId: row.id,
            incrementVal: incrementQuantity,
            productCost: incrementCost,
            success: reloadCart
        }
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