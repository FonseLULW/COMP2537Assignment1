let pokeEntry;

function ready() {
    console.log(pokeEntry.name);
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