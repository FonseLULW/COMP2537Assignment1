function setup() {
    document.querySelector("#browse").addEventListener("click", () => {
        window.location.href="/home";
    });

    document.querySelector("#viewAccounts").addEventListener("click", () => {
        window.location.href="/dashboard";
    });
}

document.addEventListener("DOMContentLoaded", setup);