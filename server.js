// requires
const express = require('express');
const app = express();
const https = require('https');
const bodyParser = require('body-parser')
let port = process.env.PORT || 8000;

app.set('view engine', 'ejs');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/timelineDB", {
    useNewUrlParser: true, useUnifiedTopology: true
})

const eventSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
})
const eventModel = mongoose.model("events", eventSchema);

// Statics
app.use(express.static(`./public`));
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}))

// Database
app.get("/events/getAllEvents", (req, res) => {
    eventModel.find({}, (err, events) => {
        if (err) {
            console.log(err);
        }
        res.json(events)
    })
})

app.put("/events/insertEvent", (req, res) => {
    console.log(req.body);
    eventModel.create({
        text: req.body.text,
        time: req.body.time,
        hits: req.body.hits
    }, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.send("Created successfully")
    })
})

// Dynamic profile page
app.get("/profile/:id", (req, res) => {

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

// Home page route
app.get("/", (req, res) => {
    res.sendFile("./public/index.html", { root: __dirname });
})

// Search page route
app.get("/search", (req, res) => {
    res.sendFile(`./public/html/search.html`, { root: __dirname });
})

// Timeline database

app.get("/timeline", (req, res) => {
    res.render("timeline");
})

// entry point
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server active on port ${port}!`);
    }
});