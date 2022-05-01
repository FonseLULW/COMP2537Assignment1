let searchBy = document.querySelector("#searchbyCurrent");
let searchQuery = document.querySelector("#query");

function changeSearchBy(newSearchBy) {
    searchBy.innerHTML = newSearchBy;
}

function setupDropItem(item) {
    let elem = document.querySelector("#drop" + item);
    elem.addEventListener("mousedown", () => {
        changeSearchBy(elem.innerHTML);
    })
}

// Reformat query to proper PokeAPI format
function reformat(oldstring) {
    let newstring = oldstring;
    return newstring.trim().toLowerCase().replace(/ /g, "-");
}

function translate(oldstring) {
    let newstring = POKEGENERATIONS.get(oldstring);
    if (newstring == undefined) {
        return oldstring;
    } else {
        return newstring;
    }
    
}

function search() {
    switch(searchBy.innerHTML.toLowerCase()) {
        case "type":
            break;
        case "ability":
            break;
        case "generation":
            console.log(translate(reformat(searchQuery.value)));
            break;
        default:
            console.log(reformat(searchQuery.value));
            // getPokemonByName();
    }
}

function ready() {
    console.log("Translation services available...")

    // dropdown menu setup
    for (i = 1; i <= 4; i++) {
        setupDropItem(i);
    }
    console.log("Dropdown menu complete...")

    // search button click 
    document.querySelector("#searchPokemon").addEventListener("mousedown", () => {
        search();
    })


    console.log("Initialization completed!");
}

document.addEventListener("DOMContentLoaded", (e) => {
    console.log(`${e.type}! Running scripts...`);
    ready();
})