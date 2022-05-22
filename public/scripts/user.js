function setup() {
    document.querySelector("#browse").addEventListener("click", () => {
        window.location.href="/home"
    })
}

document.addEventListener("DOMContentLoaded", setup)