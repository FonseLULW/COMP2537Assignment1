const pokeCount = 898;

async function getPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();
    return pokemon;
}
    
function getRandomPokemonID() {
    return Math.floor(Math.random * pokeCount);
}
    
function populateHomePage() {
    let pokemonContainers = document.getElementsByClassName("pokemon-container");
    let containerCount = pokemonContainers.length;

    for (let i = 0; i < containerCount; i++) {
        
    }
}

function ready() {
    populateHomePage();
}

document.addEventListener("DOMContentLoaded", (e) => {
    console.log(`${e.type}! Running scripts...`);
    ready();
})