const User = require("../models/User");

const forwardAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        res.redirect("/user");
    } else {
        next();
    }
};

const ensureAuthenticated = (req, res, next) => {
    console.log("SESSION: ", req.session);

    if (req.session.authenticated) {
        console.log("PROCEED");
        next();
    } else {
        console.log("INVALID");
        res.redirect("/");
    }
};

const verifyAdmin = (req, res, next) => {
    User.findById(req.session.uid, "admin", (err, data) => {
        if (data.admin) {
            next();
        } else {
            res.redirect("/user");
        }
    });
};

module.exports = {forwardAuthenticated, ensureAuthenticated, verifyAdmin};