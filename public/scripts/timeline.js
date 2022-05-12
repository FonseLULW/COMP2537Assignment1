const timelineLink = `http://localhost:8000`

function reloadPage() {
    
}

function initSingleEvent(singleEventElem) {
    let eventID = singleEventElem.id
    let likeBtn = singleEventElem.querySelector(".like")
    let delBtn = singleEventElem.querySelector(".delete")

    likeBtn.addEventListener("click", () => {
        $.ajax({
            url: `${timelineLink}/events/incrementHits/${eventID}`,
            type: `get`,
            success: reloadPage
        })
    })

    delBtn.addEventListener("click", () => {
        $.ajax({
            url: `${timelineLink}/events/deleteEvent/${eventID}`,
            type: `get`,
            success: reloadPage
        })
    })
}

function setup() {
    document.querySelectorAll(".single-event").forEach((elem) => {
        initSingleEvent(elem)
    })
}

document.addEventListener("DOMContentLoaded", setup)