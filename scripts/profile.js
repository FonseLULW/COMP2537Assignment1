let pokeEntry;

// only temporary
function populateName() {
    document.querySelector("#pName").innerHTML = pokeEntry.name;
}
// function populateImages();
// function populateTypes();
// function populateAbilities();
// function populateGeneration();
// function populateMoves();
// function populateStats();
// function populateHeight();
// function populateWeight();

function ready() {
    console.log(pokeEntry.name);

    populateName();
}

document.addEventListener("DOMContentLoaded", () => {
    getPokemon("pokemon", localStorage.getItem("pokemonProfile"))
        .then((pok) => {
            pokeEntry = pok;
            ready();
        })
        .catch((e) => {
            alert(`Try again later\nError: ${e}`);
        });
});