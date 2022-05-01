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

// Translate word representation of a number to actual number
function translate(oldstring) {
    let newstring = POKEGENERATIONS.get(oldstring);
    if (newstring == undefined) {
        return oldstring;
    } else {
        return newstring;
    }
    
}

function clearSearchResults() {
    let child = pokeContainer.lastElementChild;
    while (child) {
        pokeContainer.removeChild(child);
        child = pokeContainer.lastElementChild;
    }
}

function search(searchingBy, searchingWhat) {
    clearSearchResults();

    searchingBy = searchingBy.toLowerCase();

    let pokemonPromise;
    if (searchingBy == "pokemon") {
        pokemonPromise = getPokemon("pokemon", reformat(searchingWhat));
        pokemonPromise.then((thisPokemon) => {
            if (thisPokemon == null) {
                console.log("No results found!");
            } else {
                createPokemonImage(thisPokemon);
            }
        });
    } else {
        pokemonPromise = getPokemon(searchingBy, translate(reformat(searchingWhat)));
        pokemonPromise.then((pokeGroup) => {
            if (searchingBy == "generation") {
                pokeGroup.pokemon_species.forEach((pok) => {
                    console.log("pokesector " + pok.name);
                    search("pokemon", pok.name);
                })
            } else {
                pokeGroup.pokemon.forEach((pok) => {
                    search("pokemon", pok.pokemon.name);
                });
            }
        });
    }
}

let historyTab = document.getElementById("history");
let hID = 1;
function addToHistory(searchCategory, searchValue) {
    let historyElem = document.createElement("DIV");
    historyElem.classList.add("pokeHistory");
    historyElem.setAttribute("ID", `history${hID}`);

    historyElem.innerHTML = `<div class="hTitle">${hID}</div>
                             <div class="hCateg">${searchCategory}</div>
                             <div class="hVal">${searchValue}</div>`;
    historyTab.appendChild(historyElem);
    hID++;
}

function ready() {
    // dropdown menu setup
    for (i = 1; i <= 4; i++) {
        setupDropItem(i);
    }
    console.log("Dropdown menu initialized...")

    // search button click 
    document.querySelector("#searchPokemon").addEventListener("mousedown", () => {
        search(searchBy.innerHTML, searchQuery.value);
        addToHistory(searchBy.innerHTML, searchQuery.value);
    })
    console.log("Search button initialized...")


    console.log("Initialization completed!");
}

document.addEventListener("DOMContentLoaded", (e) => {
    console.log(`${e.type}! Running scripts...`);
    ready();
})