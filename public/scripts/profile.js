function ready() {
    console.log(pokeEntry);
    
    const cartBtn = document.querySelector("#pBuy")
    // cartBtn.addEventListener("click", () => {
    //     $.ajax({
    //         url: "",
    //         type: "POST",
    //         data: {
    //             pokemonId: pokeEntry.id,
    //             pokemonName: pokeEntry.name,
    //             productCost: pokeEntry.id + pokeEntry.height + pokeEntry.weight + pokeEntry.base_experience,
    //             quantity
    //         }
    //     })
    // })
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