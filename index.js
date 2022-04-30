const pokeContainer = document.getElementById("pokemon-grid");
const pokeCount = 898;

async function getPokemonByID(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();
    return pokemon;
}
    
function getRandomPokemonID() {
    return Math.floor(Math.random() * pokeCount) + 1;
}
    
function populateHomePage() {
    let homePageLimit = 9;

    for (let i = 0; i < homePageLimit; i++) {
        createPokemonImage(getRandomPokemonID());
    }
}

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

function ready() {
    populateHomePage();
}

document.addEventListener("DOMContentLoaded", (e) => {
    console.log(`${e.type}! Running scripts...`);
    ready();
})