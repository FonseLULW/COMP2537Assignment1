function populateHomePage() {
    let homePageLimit = 9;

    for (let i = 0; i < homePageLimit; i++) {
        createPokemonImage(getRandomPokemonID());
    }
}

function ready() {
    populateHomePage();
}

document.addEventListener("DOMContentLoaded", (e) => {
    console.log(`${e.type}! Running scripts...`);
    ready();
})