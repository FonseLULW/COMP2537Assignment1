// Total number of existing Pokemon
const POKECOUNT = 898;

// container for pokemon images
const pokeContainer = document.getElementById("pokemon-grid");

// Get a random Pokemon ID
function getRandomPokemonID() {
    return Math.floor(Math.random() * POKECOUNT) + 1;
}

// Get a Pokemon from PokeAPI
async function getPokemonByID(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();
    return pokemon;
}

// Custom Pokemon Image Graphic
function createPokemonImage(imgsrc) {
    console.log(`Creating Pokemon ${imgsrc}`);

    let pokemonContainer = document.createElement('a');
    pokemonContainer.classList.add("pokemon-container");

    pokemonContainer.setAttribute("href", "");

    getPokemonByID(imgsrc).then((thisPokemon) => {
        console.log(thisPokemon.sprites.back_default);
        pokemonContainer.innerHTML = `<img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}">`;
    });

    pokeContainer.appendChild(pokemonContainer);
}