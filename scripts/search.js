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
    searchingWhat = reformat(searchingWhat);
    if (searchingWhat == null || searchingWhat == "") {
        alert("Search bar must not be empty!");
        return;
    }

    let pokemonPromise;
    if (searchingBy == "pokemons") {
        pokemonPromise = getPokemon("pokemon", searchingWhat);
        pokemonPromise.then((thisPokemon) => {
            if (thisPokemon == null) {
                console.log("No results found!");
                return;
            } else {
                createPokemonImage(thisPokemon);
            }
        });
    } else if (searchingBy == "pokemon") {
        search("pokemons", searchingWhat);
    } else {
        pokemonPromise = getPokemon(searchingBy, translate(searchingWhat));
        pokemonPromise.then((pokeGroup) => {
            if (pokeGroup == null) {
                return;
            }

            if (searchingBy == "generation") {
                pokeGroup.pokemon_species.forEach((pok) => {
                    search("pokemons", pok.name);
                })
            } else {
                pokeGroup.pokemon.forEach((pok) => {
                    search("pokemons", pok.pokemon.name);
                });
            }
        });
    }
}

let historyTab = document.getElementById("history");
let hID = 1;
function addToHistory(searchCategory, searchValue) {
    if (searchValue == null || searchValue == "") {
        return;
    }

    let historyElem = document.createElement("DIV");
    historyElem.classList.add("pokeHistory");
    historyElem.setAttribute("ID", `history${hID}`);

    historyElem.innerHTML = `<div class="hTitle">${hID}</div>
                             <div class="hCateg">${searchCategory}</div>
                             <div class="hVal">${searchValue}</div>`;

    historyElem.addEventListener("mousedown", () => {
        search(searchCategory, searchValue);
    });

    let removeElem = document.createElement("BUTTON");
    removeElem.classList.add("hDel");

    historyElem.appendChild(removeElem);
    removeElem.addEventListener("mousedown", () => {
        historyTab.removeChild(historyElem)
    })

    historyTab.appendChild(historyElem);
    hID++;
}

function clearHistory() {
    let child = historyTab.lastElementChild;
    while (child && child.getAttribute("id") != "clear") {
        historyTab.removeChild(child);
        child = historyTab.lastElementChild;
    }
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

    document.querySelector("#clear").addEventListener("mousedown", () => {
        clearHistory();
    })


    console.log("Initialization completed!");
}

document.addEventListener("DOMContentLoaded", (e) => {
    console.log(`${e.type}! Running scripts...`);
    ready();
})