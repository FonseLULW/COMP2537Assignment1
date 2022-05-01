// Total number of existing Pokemon
const POKECOUNT = 898;

// translate function setup
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
async function getPokemonByIDorName(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
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
    console.log(`Creating Pokemon ${thisPokemon.name}`);

    let pokemonContainer = document.createElement('a');
    pokemonContainer.classList.add("pokemon-container");
    pokemonContainer.setAttribute("href", "");

    pokemonContainer.innerHTML = `<img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}">`;

    pokeContainer.appendChild(pokemonContainer);
}