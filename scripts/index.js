function populateHomePage() {
    let homePageLimit = 9;

    for (let i = 0; i < homePageLimit; i++) {
        let pokemonPromise = getPokemonByIDorName(getRandomPokemonID());
        pokemonPromise.then((thisPokemon) => {
            if (thisPokemon == null) {
                homePageLimit++;
            } else {
                createPokemonImage(thisPokemon);
            }
        });
    }
}

function ready() {
    populateHomePage();
    console.log("Home page populated...");

    console.log("Initialization completed!");
}

document.addEventListener("DOMContentLoaded", (e) => {
    console.log(`${e.type}! Running scripts...`);
    ready();
})