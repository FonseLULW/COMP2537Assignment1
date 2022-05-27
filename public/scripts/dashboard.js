function reloadPage() {
    window.location.href = "/dashboard";
}

function back() {
    window.location.href = "/user";
}

function initToggleAdmin(accountElem) {
    const toggleAdminBtn = accountElem.querySelector(".toggleAdmin");
    const userEmail = accountElem.querySelector(".email-info.val").value.trim().toLowerCase();
    toggleAdminBtn.addEventListener("click", () => {
        $.ajax({
            url: "/admin/toggleAdmin",
            method: "POST",
            data: {
                email: userEmail
            }
        }).done(reloadPage);
    });
}

function initDeleteUser(accountElem) {
    const deleteBtn = accountElem.querySelector(".a-delete");
    deleteBtn.addEventListener("click", () => {
        console.log(accountElem, deleteBtn);
    });
}

function toggleControls(accountElem, submitted) {
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
        usernameInput.readOnly = false;
        usernameInput.focus();
    } else {
        editBtn.innerHTML = "Edit";
        usernameInput.readOnly = true;
        if (!submitted) {
            accountElem.reset();
        }
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

function initFormValidation(accountElem) {
    const takenUsernames = [...document.querySelectorAll(".uname-info.val")].map(uname => uname.value.trim());
    accountElem.onsubmit = () => {
        toggleControls(accountElem, true);
        if (takenUsernames.includes(accountElem.querySelector(".uname-info.val").value.trim())) {
            accountElem.reset();
            return false;
        } else {
            return true;
        }
        
    };
}

function setup() {
    document.querySelector(".back").addEventListener("click", back);

    document.querySelectorAll(".single-account").forEach(account => {
        initToggleAdmin(account);
        initDeleteUser(account);
        initEditUser(account);
        initFormValidation(account);
    });
}

document.addEventListener("DOMContentLoaded", setup);