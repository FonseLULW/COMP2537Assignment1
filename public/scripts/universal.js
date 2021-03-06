const mockAPILink = `https://stormy-temple-14536.herokuapp.com`;
const pokeAPILink = `https://pokeapi.co/api/v2`;

// Total number of existing Pokemon
const POKECOUNT = 898;

// translate function setup
const POKEGENERATIONSCOUNT = 8;
const POKEGENERATIONS = new Map();
POKEGENERATIONS.set('one', 1);
POKEGENERATIONS.set('two', 2);
POKEGENERATIONS.set('three', 3);
POKEGENERATIONS.set('four', 4);
POKEGENERATIONS.set('five', 5);
POKEGENERATIONS.set('six', 6);
POKEGENERATIONS.set('seven', 7);
POKEGENERATIONS.set('eight', 8);

// container for pokemon images
const pokeContainer = document.getElementById("pokemon-grid");

// Get a random Pokemon ID
function getRandomPokemonID() {
    return Math.floor(Math.random() * POKECOUNT) + 1;
}

// Get a Pokemon from PokeAPI by ID
async function getPokemon(category, val) {
    const url = `${pokeAPILink}/${category}/${val}`;
    try {
        const res = await fetch(url);
        const pokemon = await res.json();
        return pokemon;
    } catch {
        return null;
    }
}

// Custom Pokemon Image Graphic
function createPokemonImage(thisPokemon) {
    console.log(`Creating Pokemon: ${thisPokemon.name}`);

    let pokemonContainer = document.createElement('a');
    pokemonContainer.classList.add("pokemon-container");
    pokemonContainer.addEventListener("click", () => {
        fireProfileEvent(thisPokemon.name, new Date()).then(() => {
            gotoProfile(thisPokemon);
        });
    });

    pokemonContainer.innerHTML = `<img src="${thisPokemon.sprites.other["official-artwork"].front_default}" alt="${thisPokemon.name}">`;

    pokeContainer.appendChild(pokemonContainer);
}

function gotoProfile(pokemon) {
    let win = window.location;
    localStorage.setItem("pokemonProfile", `${pokemon.name}`);

    win.assign(`profile/${pokemon.id}`);
}
