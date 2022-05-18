const logSession = (req, res, next) => {
    console.log(`{
        sessionID: ${req.sessionID},
        username: ${req.session.username},
        authenticated: ${req.session.authenticated}
    }`)
    next()
}

module.exports = logSession