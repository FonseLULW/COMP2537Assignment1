const forwardAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        res.redirect("/home")
    } else {
        next()
    }
}

const ensureAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        next()
    } else {
        res.redirect("/")
    }
}

module.exports = {forwardAuthenticated, ensureAuthenticated}