function updateEventsDisplay(data) {
    let timeline = document.querySelector("#timeline-items");
    timeline.innerHTML = ``;
    
    data.forEach((ev) => {
        let singleEvent = document.createElement("DIV");
        singleEvent.id = ev._id;
        singleEvent.classList.add("single-event");

        singleEvent.innerHTML = `
            <div class="event-data">
                    <div class="datetime">
                        <span class="date">${ev.date}</span>
                        <span class="time">${ev.time}</span>
                    </div>
                <div class="text">Event: <span>${ev.text}</span></div>
                <div class="hits">Likes: <span>${ev.hits}</span></div>
            </div>
            <div class="event-controls">
                <button class="like">Like</button>
                <button class="delete">Delete</button>
            </div>`;
        timeline.appendChild(singleEvent);
        initSingleEvent(singleEvent);
    });
}

function reloadEvents() {
    $.ajax({
        url: `/events/readAllEvents`,
        type: `get`,
        success: (resp) => {
            updateEventsDisplay(resp);
        }
    });
}

function initSingleEvent(singleEventElem) {
    let eventID = singleEventElem.id;
    let likeBtn = singleEventElem.querySelector(".like");
    let delBtn = singleEventElem.querySelector(".delete");

    likeBtn.addEventListener("click", () => {
        $.ajax({
            url: `/events/incrementHits/${eventID}`,
            type: `get`,
            success: reloadEvents
        });
    });

    delBtn.addEventListener("click", () => {
        $.ajax({
            url: `/events/deleteEvent/${eventID}`,
            type: `get`,
            success: reloadEvents
        });
    });
}

function setup() {
    document.querySelectorAll(".single-event").forEach((elem) => {
        initSingleEvent(elem);
    });
}

document.addEventListener("DOMContentLoaded", setup);