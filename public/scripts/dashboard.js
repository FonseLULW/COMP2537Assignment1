function back() {
    window.location.href = "/user";
}

function initToggleAdmin(accountElem) {
    const toggleAdminBtn = accountElem.querySelector(".toggleAdmin");
    toggleAdminBtn.addEventListener("click", () => {
        console.log(accountElem, toggleAdminBtn);
    });
}

function initDeleteUser(accountElem) {
    const deleteBtn = accountElem.querySelector(".a-delete");
    deleteBtn.addEventListener("click", () => {
        console.log(accountElem, deleteBtn);
    });
}

function toggleControls(accountElem) {
    const editBtn = accountElem.querySelector(".edit");
    const saveBtn = accountElem.querySelector(".save");
    const adminBtn = accountElem.querySelector(".toggleAdmin");
    const delBtn = accountElem.querySelector(".a-delete");
    const usernameInput = accountElem.querySelector(".uname-info.val");

    const isEditing = editBtn.innerHTML.trim().toUpperCase() === "EDIT";
    adminBtn.classList.toggle("hidden");
    delBtn.classList.toggle("hidden");
    saveBtn.classList.toggle("hidden");

    if (isEditing) {
        editBtn.innerHTML = "Cancel";
        usernameInput.disabled = false;
        usernameInput.focus();
    } else {
        editBtn.innerHTML = "Edit";
        usernameInput.disabled = true;
    }
}

function cancelAllEditsButThis(accountElem) {
    const editsToCancel = [...document.querySelectorAll(".single-account")].filter(account => {
        let editBtn = account.querySelector(".edit");
        return editBtn.innerHTML.trim().toUpperCase() === "CANCEL" && account !== accountElem;
    }).forEach(editing => {
        toggleControls(editing);
    });
}

function initEditUser(accountElem) {
    const editBtn = accountElem.querySelector(".edit");
    editBtn.addEventListener("click", () => {
        cancelAllEditsButThis(accountElem);
        toggleControls(accountElem);
    });
}

function setup() {
    document.querySelector(".back").addEventListener("click", back);

    document.querySelectorAll(".single-account").forEach(account => {
        initToggleAdmin(account);
        initDeleteUser(account);
        initEditUser(account);
    });
}

document.addEventListener("DOMContentLoaded", setup);