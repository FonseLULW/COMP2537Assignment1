function updateMax(inputFieldElem, newMaxValue) {
    inputFieldElem.max = newMaxValue;
}

function setup() {
    const setup = document.querySelector("#setup");
    // setup.onsubmit = (e) => {
    //     e.preventDefault();
    // };

    const pokesInput = document.querySelector("#pokes");
    const gridSizeInput = document.querySelector("#dims");
    // updateMax(pokesInput, gridSizeInput.value)
    gridSizeInput.onchange = () => updateMax(pokesInput, parseInt(gridSizeInput.value.trim()) / 2);
}

document.addEventListener("DOMContentLoaded", setup);