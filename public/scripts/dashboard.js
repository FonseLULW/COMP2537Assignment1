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
            },
            success: reloadPage
        });
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
    const editsToCancel = [...document.querySelectorAll(".currentUser")].filter(account => {
        let editBtn = account.querySelector(".edit");
        return editBtn.innerHTML.trim().toUpperCase() === "CANCEL" && account !== accountElem;
    }).forEach(editing => {
        toggleControls(editing);
    });
    const createToCancel = document.querySelector(".newEntry");
    if (!createToCancel.classList.contains("hidden")) {
        toggleCreateUserForm();
    }
}

function initEditUser(accountElem) {
    const editBtn = accountElem.querySelector(".edit");
    editBtn.addEventListener("click", () => {
        cancelAllEditsButThis(accountElem);
        toggleControls(accountElem);
    });
}

function toggleCreateUserForm() {
    const newUserForm = document.querySelector(".newEntry");
    const plusBtn = document.querySelector(".account-create");
    newUserForm.classList.toggle("hidden");
    plusBtn.classList.toggle("hidden");
    newUserForm.reset();
}

function playShake(elem) {
    elem.classList.add("shaking");
    console.log("shaking");

    setTimeout(() => {
        console.log("doneshaking");
        elem.classList.remove("shaking");
    }, 300);
}

function setup() {
    const takenUsernames = [...document.querySelectorAll(".currentUser")].map(user => user.querySelector(".uname-info.val").value.trim());
    const takenEmails = [...document.querySelectorAll(".currentUser")].map(user => user.querySelector(".email-info.val").value.trim());
    console.log(takenUsernames, takenEmails);

    document.querySelector(".back").addEventListener("click", back);

    document.querySelectorAll(".currentUser").forEach(account => {
        initToggleAdmin(account);
        initDeleteUser(account);
        initEditUser(account);
        
        account.onsubmit = () => {
            toggleControls(account, true);
            if (takenUsernames.includes(account.querySelector(".uname-info.val").value.trim())) {
                account.reset();
                playShake(account);
                return false;
            } else {
                return true;
            }
    
        };
    });

    document.querySelector(".account-create").addEventListener("click", () => {
        cancelAllEditsButThis();
        toggleCreateUserForm();
        document.querySelector(".cancel").addEventListener("click", toggleCreateUserForm);
    });
    
    document.querySelector(".newEntry").onsubmit = (e) => {
        const thisForm = document.querySelector(".newEntry");
        const uname = thisForm.querySelector(".uname-info.val").value.trim();
        const email = thisForm.querySelector(".email-info.val").value.trim();

        if (takenUsernames.includes(uname) || takenEmails.includes(email)) {
            playShake(thisForm);
            return false;
        } else {
            return true;
        }
    };
}

document.addEventListener("DOMContentLoaded", setup);