class MatchingGame {
    constructor(cols, rows, pokemonAmt, timeInMS, gameboardDiv) {
        this.cols = cols;
        this.rows = rows;
        this.pokemonAmt = pokemonAmt;
        this.timeInMS = timeInMS;
        this.gameboardDiv = gameboardDiv;

        this.firstSelected = null;
        this.secondSelected = null;
        this.firstCardFlipped = false;
        this.secondCardFlipped = false;
    }

    createBoard(cardsArr) {
        // Give each card a pair, and then sort randomly
        let cards = cardsArr.concat(cardsArr);
        cards.sort(() => Math.random() - 0.5);

        // Assign a row and column to each card element
        let index = 0;
        for (let i = 1; i <= this.rows; i++) {
            for (let j = 1; j <= this.cols; j++) {
                console.log(cards[index]);
                cards[index] = `<div style="grid-column: ${j}; grid-row: ${i};" class="card" id="card${index}"><img src="img/pokeball.png" class="card-back"><img src="${cards[index]}" class="card-front"></div>`;
                index++;
            }
        }

        this.gameboardDiv.innerHTML = "";

        // Append each element in cards array into the board
        let board = "";
        cards.forEach((card) => {
            board += card;
        });

        // Display the board with the proper dimensions
        this.gameboardDiv.innerHTML = board;
        this.gameboardDiv.style.gridTemplateColumns = `${(100 / this.cols)}%` * this.cols;
        this.gameboardDiv.style.gridTemplateRows = `${100 / this.rows}%` * this.rows;
    }

    async setup() {
        console.log(`generating game board:\n\tcols: ${this.cols}\n\trows: ${this.rows}\n\tpokemons: ${this.pokemonAmt}\n\ttimeInMS: ${this.timeInMS}`);

        const pokemonIds = generateUniqueIds(this.pokemonAmt, this.cols * this.rows / 2);
        console.log(pokemonIds);

        let pokemonCards = pokemonIds.map((id) => {
            return getPokemon("pokemon", id);
        });

        console.log(pokemonCards);

        pokemonCards = await Promise.all(pokemonCards);
        pokemonCards = pokemonCards.map((poke) => {
            return poke.sprites.other["official-artwork"].front_default;
        });

        console.log(pokemonCards);

        this.createBoard(pokemonCards);
    }

    play() {
        this.gameboardDiv.classList.remove("hidden");
        console.log("STARTING GAME");

        this.gameboardDiv.querySelectorAll(".card").forEach((card) => {
            card.addEventListener("click", () => {
                console.log(card, card.id, this.firstSelected);

                if (this.secondCardFlipped) {
                    console.log("ALREADY CLICKED 2 CARDS");
                    return;
                } else if (this.firstCardFlipped && this.firstSelected == card.querySelector(".card-front")) {
                    console.log("CLICK ON SOMETHING ELSE");
                    return;
                }
                card.classList.toggle("flip");

                if (!this.firstCardFlipped) {
                    this.firstSelected = card.querySelector(".card-front");
                    this.firstCardFlipped = true;
                } else {
                    this.secondSelected = card.querySelector(".card-front");
                    this.secondCardFlipped = true;
                }

            });
        });
    }
}


function updateMax(inputFieldElem, newMaxValue) {
    inputFieldElem.max = newMaxValue;
    inputFieldElem.value = newMaxValue;
}

function rootOfSquare(area) {
    return Math.floor(Math.sqrt(area));
}

function determineTimeMS(diff) {
    const milliseconds = 1000;
    switch (diff) {
        case "easy":
            return milliseconds * 60;
        case "medium":
            return milliseconds * 30;
        case "hard":
            return milliseconds * 15;
    }
}

function generateUniqueIds(amount, wantedAmt) {
    const ids = [];

    for (let i = 0; i < amount; i++) {
        let newId;
        do {
            newId = getRandomPokemonID();
        } while (ids.includes(newId));
        ids.push(newId);
    }

    let padding = ids.slice();
    let index = 0;
    let needed = wantedAmt - amount;
    for (let i = 0; i < needed; i++) {
        index = index < padding.length ? index : 0;
        ids.push(padding[index]);
        index++;
    }
    
    return ids;
}

function setup() {
    const target = document.querySelector("#game");
    const setup = document.querySelector("#setup");
    setup.onsubmit = (e) => {
        e.preventDefault();

        const dims = rootOfSquare(parseInt(setup.querySelector("#dims").value.trim()));
        const pokeCount = parseInt(setup.querySelector("#pokes").value.trim());
        const time = determineTimeMS(setup.querySelector("#difficulty").value.trim());

        const game = new MatchingGame(dims, dims, pokeCount, time, target);
        game.setup().then(() => {
            setup.classList.add("hidden");
            game.play();
        });
    };

    const pokesInput = document.querySelector("#pokes");
    const gridSizeInput = document.querySelector("#dims");
    gridSizeInput.onchange = () => updateMax(pokesInput, parseInt(gridSizeInput.value.trim()) / 2);
}

document.addEventListener("DOMContentLoaded", setup);