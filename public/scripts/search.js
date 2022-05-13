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
    historyElem.classList.add("pokeHCell");
    historyElem.setAttribute("ID", `history${hID}`);

    let historyData = document.createElement("DIV");
    historyData.classList.add("pokeHistory");
    historyData.innerHTML = `<div class="hTitle">${hID}</div>
                             <div class="hCateg">${searchCategory}</div>
                             <div class="hVal">${searchValue}</div>`;
    historyData.addEventListener("click", () => {
        fireRestoreSearchEvent(searchCategory, searchValue, new Date()).then(() => {
            search(searchCategory, searchValue);
        })
    });

    historyElem.appendChild(historyData);

    // historyElem.innerHTML = `<div class="hTitle">${hID}</div>
    //                          <div class="hCateg">${searchCategory}</div>
    //                          <div class="hVal">${searchValue}</div>`;

    let removeElem = document.createElement("BUTTON");
    removeElem.classList.add("hDel");

    historyElem.appendChild(removeElem);
    removeElem.addEventListener("click", () => {
        fireDeleteFromHistoryEvent(searchCategory, searchValue, new Date()).then(() => {
            historyTab.removeChild(historyElem)
        })
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
    document.querySelector("#searchPokemon").addEventListener("click", () => {
        fireSearchEvent(searchBy.innerHTML, searchQuery.value, new Date()).then(() => {
            search(searchBy.innerHTML, searchQuery.value);
            addToHistory(searchBy.innerHTML, searchQuery.value);
        })
    })
    console.log("Search button initialized...")

    document.querySelector("#clear").addEventListener("click", () => {
        fireClearHistoryEvent(new Date()).then(() => {
            clearHistory();
        })
    })


    console.log("Initialization completed!");
}

document.addEventListener("DOMContentLoaded", (e) => {
    console.log(`${e.type}! Running scripts...`);
    ready();
})