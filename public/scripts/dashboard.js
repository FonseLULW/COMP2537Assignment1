function back() {
    window.location.href = "/user";
}

function setup() {
    document.querySelector(".back").addEventListener("click", back);
}

document.addEventListener("DOMContentLoaded", setup);