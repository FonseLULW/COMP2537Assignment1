function ready() {
    console.log(pokeEntry.name);
}

document.addEventListener("DOMContentLoaded", () => {
    // console.log(window)
    getPokemon("pokemon", localStorage.getItem("pokemonProfile"))
        .then((pok) => {
            pokeEntry = pok;
            ready();
        })
        .catch((e) => {
            alert(`Try again later\nError: ${e}`);
        });
});