function changeSearchBy(newSearchBy) {
    document.querySelector("#searchbyCurrent").innerHTML = newSearchBy;
}

function setupDropItem(item) {
    let elem = document.querySelector("#drop" + item);
    console.log(elem.innerHTML);
    elem.addEventListener("mousedown", () => {
        console.log("e");
        console.log(elem.innerHTML);
        changeSearchBy(elem.innerHTML);
    })
}

function ready() {
    for (i = 1; i <= 4; i++) {
        setupDropItem(i);
    }
}

document.addEventListener("DOMContentLoaded", (e) => {
    console.log(`${e.type}! Running scripts...`);
    ready();
})