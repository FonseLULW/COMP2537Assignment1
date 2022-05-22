const forwardAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        res.redirect("/home")
    } else {
        next()
    }
}

const ensureAuthenticated = (req, res, next) => {
    console.log("SESSION: ", req.session)

    if (req.session.authenticated) {
        console.log("PROCEED")
        next()
    } else {
        console.log("INVALID")
        res.redirect("/")
    }
}

module.exports = {forwardAuthenticated, ensureAuthenticated}