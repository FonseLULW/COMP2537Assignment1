// requires
require("dotenv").config();
const express = require('express');
const app = express();
const session = require("express-session");
const https = require('https');
const bodyParser = require('body-parser');
const cors = require('cors')
const port = process.env.PORT || 8000;
const uriString = process.env.MONGODB_URI

// Middlewares
const sessionLog = require("./middleware/session-log");
const {ensureAuthenticated, forwardAuthenticated} = require("./middleware/auths"); 

// Use middlewares
app.use(cors())
app.use(session({
    secret: "sssshhhhh",
    saveUninitialized: true,
    resave: true
}))
// app.use(sessionLog)

app.set('view engine', 'ejs');
const mongoose = require('mongoose');

mongoose.connect(uriString, {
    useNewUrlParser: true, useUnifiedTopology: true
})

const User = require('./models/User')
const Event = require('./models/Event')
const Product = require('./models/Product')
const Order = require('./models/Order')

// Statics
app.use(express.static(`./public`));
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}))

// [READ] all timelineDB events and render timeline.ejs
app.get("/timeline", ensureAuthenticated, (req, res) => {
    Event.find({doneBy: req.session.uid}, (err, events) => {
        if (err) {
            console.log(err);
        }
        res.render("timeline", {
            "events": events
        })
    })
})

app.get("/events/readAllEvents", ensureAuthenticated, (req, res) => {
    Event.find({doneBy: req.session.uid}, (err, events) => {
        if (err) {
            console.log(err)
        }
        res.json(events)
    })
})

// [CREATE] a new event and insert it to the timelineDB
app.put("/events/insertEvent", ensureAuthenticated, (req, res) => {
    Event.create({
        text: req.body.text,
        date: req.body.date,
        time: req.body.time,
        doneBy: req.session.uid,
        hits: req.body.hits,
    }, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log("DATA")
        console.log(data)
        res.send("Created successfully")
    })
})

// [UPDATE] the `hits` field of an event in the timelineDB
app.get("/events/incrementHits/:id", ensureAuthenticated, (req, res) => {
    Event.updateOne(
        {_id: req.params.id},
        {$inc: {hits: 1}}, (err, data) => {
            if (err) {
                console.log(err);
            }
            res.send("Incremented successfully")
        })
})

// [DELETE] an event from timelineDB
app.get("/events/deleteEvent/:id", ensureAuthenticated, (req, res) => {
    Event.deleteOne({_id: req.params.id}, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.send("Deleted successfully")
    })
})

// Dynamic profile page
app.get("/profile/:id", ensureAuthenticated, (req, res) => {

    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
    data = "";

    https.get(url, (https_res) => {
        https_res.on("data", (chunk) => {
            data += chunk;
        })

        https_res.on("end", () => {
            data = JSON.parse(data);
    
            res.render("profile", {
                "pokemon": data})
        })
    })
});

// Auth routes
app.post("/auth/login", (req, res) => {
    const {email, password} = req.body
    User.findOne({email: email, password: password}, (err, resp) => {
        if (err) {
            console.log(err.message)
        } else if (resp == null || resp == undefined){
            res.send("Email or password is incorrect")
        } else {
            req.session.username = resp.username
            req.session.uid = resp._id
            req.session.authenticated = true
            res.redirect("/home")
        }
    })
})

app.post("/auth/signup", (req, res) => {
    const {email, username, password} = req.body
    User.findOne({$or: [
        {username: username}, 
        {email: email}
    ]}, (err, resp) => {
        if (err) {
            console.log(err.message)
        } else if (resp == null || resp == undefined) {
            User.create({
                email: email,
                username: username,
                password: password
            }, (err, data) => {
                console.log(data)
                if (err) {
                    console.log(err.message)
                } else {
                    req.session.username = data.username
                    req.session.uid = data._id
                    req.session.authenticated = true
                    res.redirect("/home")
                }
            })
        } else if (resp.email === email && resp.username === username) {
            res.send("This email and username already exists!")
        } else if (resp.email === email) {
            res.send("This email already exists!")
        } else {
            res.send("This username is taken!")
        }
    })
})

app.get("/auth/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err.message)
        } else {
            res.redirect("/")
        }
    })
})

// Home page route
app.get("/home", ensureAuthenticated, (req, res) => {
    res.sendFile("./public/html/home.html", {root: __dirname});
})

// Login page route
app.get("/", forwardAuthenticated, (req, res) => {
    res.sendFile("./public/html/login.html", { root: __dirname });
})

// Sign up page route
app.get("/signup", (req, res) => {
    res.sendFile("./public/html/signup.html", { root: __dirname });
})

// Search page route
app.get("/search", ensureAuthenticated, (req, res) => {
    res.sendFile(`./public/html/search.html`, { root: __dirname });
})

// Checkout page route
app.get("/checkout", ensureAuthenticated, (req, res) => {
    res.render("checkout")
})

// Receipts page route
app.get("/receipts", ensureAuthenticated, (req, res) => {
    res.render("receipts")
})

// entry point
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server active on port ${port}!`);
    }
});