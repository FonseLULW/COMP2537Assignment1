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

    let pokemonPromise;
    switch(searchingBy.toLowerCase()) {
        case "type":
            pokemonPromise = getPokemon("type", reformat(searchingWhat));
            pokemonPromise.then((pokeType) => {
                // console.log(pokeType.pokemon);
                pokeType.pokemon.forEach((pok) => {
                    console.log(pok.pokemon.name);
                    search("pokemon", pok.pokemon.name);
                })
            })
            break;
        case "ability":
            console.log(reformat(searchingWhat));
            break;
        case "generation":
            console.log(translate(reformat(searchingWhat)));
            break;
        default:
            pokemonPromise = getPokemon("pokemon", reformat(searchingWhat));
            pokemonPromise.then((thisPokemon) => {
                if (thisPokemon == null) {
                    console.log("No results found!");
                } else {
                    createPokemonImage(thisPokemon);
                }
            });
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
    })
    console.log("Search button initialized...")


    console.log("Initialization completed!");
}

document.addEventListener("DOMContentLoaded", (e) => {
    console.log(`${e.type}! Running scripts...`);
    ready();
})