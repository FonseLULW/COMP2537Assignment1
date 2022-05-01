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

function search() {
    createPokemonImage(23);
}

function ready() {
    for (i = 1; i <= 4; i++) {
        setupDropItem(i);
    }

    document.querySelector("#searchPokemon").addEventListener("mousedown", () => {
        search();
    })
}

document.addEventListener("DOMContentLoaded", (e) => {
    console.log(`${e.type}! Running scripts...`);
    ready();
})