function ready() {
    console.log(pokeEntry);
    
    const cartBtn = document.querySelector("#pBuy");
    cartBtn.addEventListener("click", () => {
        console.log(`SENDING:\nId: ${pokeEntry.id}\nName: ${pokeEntry.name}\nPrice: ${pokeEntry.id + pokeEntry.height + pokeEntry.weight + pokeEntry.base_experience}`);
        $.ajax({
            url: "/shop/addToCart",
            type: "POST",
            data: {
                pokemonId: pokeEntry.id,
                pokemonName: pokeEntry.name,
                productCost: pokeEntry.id + pokeEntry.height + pokeEntry.weight + pokeEntry.base_experience,
                incrementVal: 1
            }
        });
    });
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