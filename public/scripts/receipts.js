function fixTime(timestampElement) {
    let timestamp = new Date(timestampElement.innerHTML.trim()).getTime();
    let offset = new Date().getTimezoneOffset();
    let newTimestamp = new Date(timestamp - offset * 60 * 1000).toLocaleString("en-GB", { dateStyle: "medium" , timeStyle: "short" , });
    console.log(offset, newTimestamp);

    timestampElement.innerHTML = "";
    timestampElement.innerHTML = newTimestamp;
}

function setup() {
    document.querySelectorAll(".o-timestamp").forEach(timestampElem => {
        fixTime(timestampElem);
    });

    const unconfirmeds = document.querySelector(".unconfirmed");
    
    if (unconfirmeds) {
        unconfirmeds.addEventListener("click", () => {
            window.location.href = "/checkout";
        });
    }
    
}

document.addEventListener("DOMContentLoaded", setup);